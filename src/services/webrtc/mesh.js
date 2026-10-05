/**
 * Mesh WebRTC manager: one RTCPeerConnection per remote peer.
 * UI-agnostic. Signaling transport injected (socket.io).
 * Reuses offer/answer/candidate JSON shape from maskWebRTC.
 */
import { getIceServers } from "../../lib/webrtc"
import { createMaskVideoPeer } from "../../lib/maskWebRTC"

export function createMesh({ socket, getLocalStream, onRemoteStream, onPeerLeft, onConnectionState }) {
  const peers = new Map() // socketId -> peer handle
  const pending = new Map() // socketId -> queued signals

  function ensurePeer(remoteId, initiator) {
    if (peers.has(remoteId)) return peers.get(remoteId)
    const stream = getLocalStream?.()
    const handle = createMaskVideoPeer({
      initiator,
      localStream: stream || new MediaStream(),
      iceServers: getIceServers(),
      onSignal: (payload) => socket.emit("signal", { to: remoteId, data: payload }),
      onRemoteStream: (s) => onRemoteStream?.(remoteId, s),
      onError: (e) => {
        console.warn("[mesh]", remoteId, e?.message)
        onConnectionState?.(remoteId, "failed")
      }
    })
    // monitor pc state
    try {
      const pc = handle.getPeerConnection()
      pc.onconnectionstatechange = () => onConnectionState?.(remoteId, pc.connectionState)
    } catch {}
    peers.set(remoteId, handle)
    // flush queued
    const q = pending.get(remoteId)
    if (q?.length) {
      pending.delete(remoteId)
      q.forEach((d) => { try { void handle.handleRemoteSignal(d) } catch {} })
    }
    return handle
  }

  // Attach local tracks to all peers (for late joiners / screen share swap)
  async function setLocalStream(stream) {
    for (const [, handle] of peers) {
      try {
        const pc = handle.getPeerConnection()
        const senders = pc.getSenders()
        const tracks = stream.getTracks()
        // replace existing same-kind, else add
        for (const track of tracks) {
          const sender = senders.find((s) => s.track?.kind === track.kind)
          if (sender) await sender.replaceTrack(track).catch(() => {})
          else pc.addTrack(track, stream)
        }
      } catch (e) { console.warn("[mesh] setLocalStream", e) }
    }
  }

  function handleSignal(from, data) {
    let handle = peers.get(from)
    if (!handle) {
      // non-initiator side: create responder lazily
      if (data?.type === "offer") {
        handle = ensurePeer(from, false)
      } else {
        const q = pending.get(from) || []
        q.push(data)
        pending.set(from, q)
        return
      }
    }
    try { void handle.handleRemoteSignal(data) } catch {}
  }

  function addPeer(remoteId, initiator) {
    return ensurePeer(remoteId, initiator)
  }

  function removePeer(remoteId) {
    const h = peers.get(remoteId)
    if (h) { try { h.destroy() } catch {} peers.delete(remoteId) }
    pending.delete(remoteId)
    onPeerLeft?.(remoteId)
  }

  function destroy() {
    for (const [, h] of peers) { try { h.destroy() } catch {} }
    peers.clear()
    pending.clear()
  }

  return { addPeer, removePeer, handleSignal, setLocalStream, destroy, _peers: peers }
}
