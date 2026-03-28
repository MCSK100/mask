import { useRef, useEffect } from "react"

export default function VideoGrid({ localStream, remoteStream, loading = false }) {
  const myVideo = useRef(null)
  const strangerVideo = useRef(null)

  useEffect(() => {
    if (myVideo.current && localStream) {
      myVideo.current.srcObject = localStream
    }
    if (strangerVideo.current && remoteStream) {
      strangerVideo.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  return (
    <div className="grid h-full grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3">
      <div className="relative col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-black/80">
        <video ref={strangerVideo} autoPlay playsInline className="h-full min-h-[300px] w-full object-cover md:min-h-[360px]" />
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80" />
        )}
        {!remoteStream && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/70 text-slate-300">
            Waiting for stranger video...
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/80">
        <video ref={myVideo} autoPlay playsInline muted className="h-full min-h-[170px] w-full object-cover md:min-h-[220px]" />
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80" />
        )}
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-slate-200">
          You
        </span>
      </div>
    </div>
  )
}