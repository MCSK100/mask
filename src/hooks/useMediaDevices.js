import { useCallback, useEffect, useRef, useState } from "react"

export function useMediaDevices() {
  const [stream, setStream] = useState(null)
  const [devices, setDevices] = useState({ audio: [], video: [], output: [] })
  const [error, setError] = useState(null)
  const [muted, setMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const streamRef = useRef(null)

  const refreshDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices()
      setDevices({
        audio: list.filter((d) => d.kind === "audioinput"),
        video: list.filter((d) => d.kind === "videoinput"),
        output: list.filter((d) => d.kind === "audiooutput")
      })
    } catch {}
  }, [])

  const start = useCallback(async (constraints = { video: { facingMode: "user" }, audio: true }) => {
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = s
      setStream(s)
      setMuted(false)
      setCameraOff(false)
      await refreshDevices()
      return s
    } catch (e) {
      const msg = e?.name === "NotAllowedError"
        ? "Camera or mic permission denied. Allow access and retry."
        : e?.name === "NotFoundError"
          ? "No camera or microphone found."
          : "Could not access camera/microphone."
      setError(msg)
      throw new Error(msg)
    }
  }, [refreshDevices])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !next })
      return next
    })
  }, [])

  const toggleCamera = useCallback(() => {
    setCameraOff((c) => {
      const next = !c
      streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !next })
      return next
    })
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { stream, streamRef, devices, error, muted, cameraOff, start, stop, toggleMute, toggleCamera, refreshDevices, setStream }
}
