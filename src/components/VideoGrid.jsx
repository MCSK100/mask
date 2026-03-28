import { useRef, useEffect } from "react"

function StrangerPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-[#0a1628] to-black">
      <div
        className="mb-4 h-28 w-20 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 opacity-90 shadow-[0_0_40px_rgba(56,189,248,0.25)]"
        style={{ clipPath: "ellipse(50% 45% at 50% 40%)" }}
        aria-hidden
      />
      <div className="relative -mt-6 h-16 w-32 rounded-t-[3rem] bg-gradient-to-b from-slate-800 to-slate-950 shadow-[inset_0_2px_20px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-x-3 top-3 h-2 rounded-full bg-black/70" />
      </div>
    </div>
  )
}

export default function VideoGrid({ localStream, remoteStream, loading = false }) {
  const myVideo = useRef(null)
  const strangerVideo = useRef(null)

  useEffect(() => {
    const localEl = myVideo.current
    const remoteEl = strangerVideo.current

    if (localEl && localStream) {
      localEl.srcObject = localStream
      localEl.play().catch(() => {})
    }
    if (remoteEl && remoteStream) {
      remoteEl.srcObject = remoteStream
      remoteEl.play().catch(() => {})
    }
  }, [localStream, remoteStream])

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:min-h-[280px] md:grid-cols-2 lg:gap-6">
      {/* You — left, pink neon */}
      <div className="relative min-h-[200px] overflow-hidden rounded-2xl md:min-h-[260px] lg:min-h-[320px]">
        <div
          className="absolute inset-0 rounded-2xl p-[2px]"
          style={{
            background: "linear-gradient(145deg, rgba(236,72,153,0.85), rgba(168,85,247,0.4), rgba(236,72,153,0.6))",
            boxShadow:
              "0 0 24px rgba(236, 72, 153, 0.35), 0 0 48px rgba(236, 72, 153, 0.12), inset 0 0 40px rgba(236, 72, 153, 0.06)"
          }}
        >
          <div className="relative h-full min-h-[200px] overflow-hidden rounded-[14px] bg-black/90 md:min-h-[252px] lg:min-h-[312px]">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {loading && (
              <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-fuchsia-950/40 via-purple-950/30 to-black/60" />
            )}
            <span className="absolute bottom-3 left-3 rounded-lg border border-fuchsia-400/30 bg-black/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-100 shadow-neon-pink backdrop-blur-sm sm:bottom-4 sm:left-4">
              You
            </span>
          </div>
        </div>
      </div>

      {/* Stranger — right, blue neon */}
      <div className="relative min-h-[200px] overflow-hidden rounded-2xl md:min-h-[260px] lg:min-h-[320px]">
        <div
          className="absolute inset-0 rounded-2xl p-[2px]"
          style={{
            background: "linear-gradient(145deg, rgba(56,189,248,0.85), rgba(99,102,241,0.45), rgba(34,211,238,0.55))",
            boxShadow:
              "0 0 24px rgba(56, 189, 248, 0.35), 0 0 48px rgba(56, 189, 248, 0.12), inset 0 0 40px rgba(56, 189, 248, 0.06)"
          }}
        >
          <div className="relative h-full min-h-[200px] overflow-hidden rounded-[14px] bg-black/90 md:min-h-[252px] lg:min-h-[312px]">
            <video ref={strangerVideo} autoPlay playsInline className="relative z-[1] h-full w-full object-cover" />
            {loading && (
              <div className="pointer-events-none absolute inset-0 z-[2] animate-pulse bg-gradient-to-br from-cyan-950/40 via-slate-900/40 to-black/60" />
            )}
            {!remoteStream && (
              <div className="absolute inset-0 z-[2]">
                <StrangerPlaceholder />
                <div className="absolute inset-x-0 bottom-10 flex justify-center px-3 text-center sm:bottom-12">
                  <div className="max-w-xs space-y-1 rounded-xl border border-cyan-500/20 bg-black/55 px-3 py-2 backdrop-blur-md sm:max-w-md">
                    <p className="text-xs font-medium text-cyan-100 sm:text-sm">
                      {loading ? "Waiting for stranger video…" : "Connecting peer video (WebRTC)…"}
                    </p>
                    {!loading && (
                      <p className="text-[10px] leading-relaxed text-cyan-200/60 sm:text-xs">
                        Open two browsers to test. Different networks may need TURN in env.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <span className="absolute bottom-3 left-3 z-[3] rounded-lg border border-cyan-400/35 bg-black/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 shadow-neon-blue backdrop-blur-sm sm:bottom-4 sm:left-4">
              Stranger
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
