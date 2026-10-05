import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Room, RoomEvent, Track, ConnectionState } from "livekit-client"
import { encodeData } from "../lib/livekit"

/**
 * useLiveKitRoom — reusable LiveKit room lifecycle.
 *
 * LiveKit handles: WebRTC connections, audio/video/screen tracks,
 * subscriptions, network adaptation, reconnection, data transport.
 * This hook owns connection + devices + participants + quality state.
 * Product UI (Meeting.jsx) only renders — no mesh logic there.
 */
export function useLiveKitRoom({ serverUrl, token, audio = true, video = true, onData }) {
  const [room, setRoom] = useState(null)
  const [connectionState, setConnectionState] = useState("disconnected")
  const [participants, setParticipants] = useState([])
  const [cameraEnabled, setCameraState] = useState(video)
  const [micEnabled, setMicState] = useState(audio)
  const [screenShareEnabled, setScreenState] = useState(false)
  const [error, setError] = useState(null)
  const roomRef = useRef(null)
  const onDataRef = useRef(onData)
  onDataRef.current = onData
  const lastSendRef = useRef({})

  const snapshot = useCallback((r) => {
    if (!r) {
      setParticipants([])
      return
    }
    const all = [r.localParticipant, ...r.remoteParticipants.values()]
    setParticipants(
      all.map((p) => {
        let role = "participant"
        try {
          const meta = p.metadata ? JSON.parse(p.metadata) : null
          if (meta?.role) role = meta.role
        } catch { /* best-effort: ignore transient media/data errors */ }
        const pubs = [...p.getTrackPublications().values()]
        const cam = pubs.find((t) => t.source === Track.Source.Camera)
        const mic = pubs.find((t) => t.source === Track.Source.Microphone)
        const screen = pubs.find((t) => t.source === Track.Source.ScreenShare)
        return {
          identity: p.identity,
          name: p.name || p.identity,
          role,
          isLocal: p === r.localParticipant,
          isSpeaking: Boolean(p.isSpeaking),
          connectionQuality: p.connectionQuality || "unknown",
          cameraEnabled: cam ? !cam.isMuted && Boolean(cam.track) : false,
          micEnabled: mic ? !mic.isMuted : true,
          screenShareEnabled: screen ? Boolean(screen.track) && !screen.isMuted : false,
          participant: p,
        }
      })
    )
  }, [])

  useEffect(() => {
    if (!serverUrl || !token) return
    let cancelled = false
    let r = null

    const connect = async () => {
      setError(null)
      setConnectionState("connecting")
      r = new Room({ adaptiveStream: true, dynacast: true })
      roomRef.current = r

      const refresh = () => snapshot(r)
      r.on(RoomEvent.ParticipantConnected, refresh)
        .on(RoomEvent.ParticipantDisconnected, refresh)
        .on(RoomEvent.TrackSubscribed, refresh)
        .on(RoomEvent.TrackUnsubscribed, refresh)
        .on(RoomEvent.TrackMuted, refresh)
        .on(RoomEvent.TrackUnmuted, refresh)
        .on(RoomEvent.LocalTrackPublished, refresh)
        .on(RoomEvent.LocalTrackUnpublished, refresh)
        .on(RoomEvent.ActiveSpeakersChanged, refresh)
        .on(RoomEvent.ConnectionQualityChanged, refresh)
        .on(RoomEvent.ParticipantMetadataChanged, refresh)
        .on(RoomEvent.ConnectionStateChanged, (s) => {
          if (s === ConnectionState.Connected) setConnectionState("connected")
          else if (s === ConnectionState.Reconnecting) setConnectionState("reconnecting")
          else if (s === ConnectionState.Disconnected) setConnectionState("disconnected")
          else setConnectionState("connecting")
        })
        .on(RoomEvent.Reconnecting, () => setConnectionState("reconnecting"))
        .on(RoomEvent.Reconnected, () => setConnectionState("connected"))
        .on(RoomEvent.DataReceived, (payload, participant, _kind, topic) => {
          try {
            onDataRef.current?.({ payload, participant, topic })
          } catch { /* best-effort: ignore transient media/data errors */ }
        })
        .on(RoomEvent.Disconnected, () => {
          if (!cancelled) setConnectionState("disconnected")
        })

      try {
        await r.connect(serverUrl, token)
        if (cancelled) {
          try { await r.disconnect() } catch { /* best-effort: ignore transient media/data errors */ }
          return
        }
        // Publish local devices (pre-join choices flow through `audio`/`video`)
        try {
          await r.localParticipant.setCameraEnabled(video)
          setCameraState(video)
        } catch {
          setCameraState(false)
        }
        try {
          await r.localParticipant.setMicrophoneEnabled(audio)
          setMicState(audio)
        } catch {
          setMicState(false)
        }
        setRoom(r)
        setConnectionState("connected")
        refresh()
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Could not connect to media server.")
          setConnectionState("disconnected")
        }
      }
    }

    connect()
    return () => {
      cancelled = true
      try { r?.disconnect() } catch { /* best-effort: ignore transient media/data errors */ }
      roomRef.current = null
      setRoom(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl, token])

  const setCameraEnabled = useCallback(async (enabled) => {
    const r = roomRef.current
    if (!r) {
      setCameraState(enabled)
      return
    }
    try {
      await r.localParticipant.setCameraEnabled(enabled)
      setCameraState(enabled)
    } catch (e) {
      setError(e?.message || "Camera unavailable.")
      throw e
    }
  }, [])

  const setMicrophoneEnabled = useCallback(async (enabled) => {
    const r = roomRef.current
    if (!r) {
      setMicState(enabled)
      return
    }
    try {
      await r.localParticipant.setMicrophoneEnabled(enabled)
      setMicState(enabled)
    } catch (e) {
      setError(e?.message || "Microphone unavailable.")
      throw e
    }
  }, [])

  const setScreenShareEnabled = useCallback(async (enabled) => {
    const r = roomRef.current
    if (!r) return
    try {
      await r.localParticipant.setScreenShareEnabled(enabled)
      setScreenState(enabled)
    } catch (e) {
      setError(e?.message || "Screen share failed.")
      throw e
    }
  }, [])

  /** Rate-limited data publish (chat ~1/800ms, whiteboard ~60/s bucket). */
  const publishData = useCallback(async (obj, { topic, reliable = true } = {}) => {
    const r = roomRef.current
    if (!r) throw new Error("Not connected.")
    const now = Date.now()
    const bucket = lastSendRef.current[topic] || []
    const windowMs = topic === "sm-whiteboard" ? 1000 : 800
    const max = topic === "sm-whiteboard" ? 60 : 8
    const active = bucket.filter((t) => now - t < windowMs)
    if (active.length >= max) throw new Error("Sending too fast. Slow down.")
    active.push(now)
    lastSendRef.current[topic] = active
    await r.localParticipant.publishData(encodeData(obj), { reliable, topic })
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await roomRef.current?.disconnect()
    } catch { /* best-effort: ignore transient media/data errors */ }
  }, [])

  const value = useMemo(
    () => ({
      room,
      connectionState,
      participants,
      localIdentity: room?.localParticipant?.identity || null,
      cameraEnabled,
      micEnabled,
      screenShareEnabled,
      error,
      setCameraEnabled,
      setMicrophoneEnabled,
      setScreenShareEnabled,
      publishData,
      disconnect,
    }),
    [room, connectionState, participants, cameraEnabled, micEnabled, screenShareEnabled, error, setCameraEnabled, setMicrophoneEnabled, setScreenShareEnabled, publishData, disconnect]
  )

  return value
}
