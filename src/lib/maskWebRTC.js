/**
 * Native RTCPeerConnection wrapper (replaces simple-peer for Vite/browser compatibility).
 * Signaling payloads are plain JSON for Socket.IO.
 */

/**
 * @param {object} opts
 * @param {boolean} opts.initiator
 * @param {MediaStream} opts.localStream
 * @param {RTCIceServer[]} opts.iceServers
 * @param {(payload: object) => void} opts.onSignal - emit to socket
 * @param {(stream: MediaStream) => void} opts.onRemoteStream
 * @param {(err: Error) => void} [opts.onError]
 */
export function createMaskVideoPeer({
  initiator,
  localStream,
  iceServers,
  onSignal,
  onRemoteStream,
  onError
}) {
  const pc = new RTCPeerConnection({ iceServers })
  const pendingRemoteCandidates = []

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })

  pc.onicecandidate = (ev) => {
    if (ev.candidate) {
      try {
        onSignal({ type: "candidate", candidate: ev.candidate.toJSON() })
      } catch {
        onSignal({ type: "candidate", candidate: ev.candidate })
      }
    }
  }

  pc.ontrack = (ev) => {
    const stream = ev.streams[0]
    if (stream) onRemoteStream(stream)
  }

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "failed") {
      onError?.(new Error("WebRTC connection failed"))
    }
  }

  async function flushPendingCandidates() {
    while (pendingRemoteCandidates.length) {
      const c = pendingRemoteCandidates.shift()
      try {
        await pc.addIceCandidate(c)
      } catch (e) {
        console.warn("[maskWebRTC] addIceCandidate", e)
      }
    }
  }

  async function handleRemoteSignal(data) {
    if (!data || typeof data !== "object") return

    try {
      if (data.type === "offer" && data.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }))
        await flushPendingCandidates()
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        onSignal({ type: "answer", sdp: answer.sdp })
        return
      }

      if (data.type === "answer" && data.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }))
        await flushPendingCandidates()
        return
      }

      if (data.type === "candidate" && data.candidate) {
        const cand = new RTCIceCandidate(data.candidate)
        if (!pc.remoteDescription) {
          pendingRemoteCandidates.push(cand)
        } else {
          await pc.addIceCandidate(cand)
        }
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)))
    }
  }

  async function runInitiator() {
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      onSignal({ type: "offer", sdp: offer.sdp })
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)))
    }
  }

  if (initiator) {
    void runInitiator()
  }

  return {
    handleRemoteSignal,
    destroy() {
      try {
        pc.close()
      } catch {
        /* ignore */
      }
    },
    getPeerConnection() {
      return pc
    }
  }
}
