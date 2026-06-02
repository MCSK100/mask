import { useEffect, useRef } from "react"

export default function ChatBox({ messages, loading = false, strangerTyping = false }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
      block: "end"
    })
  }, [messages, loading, strangerTyping])

  return (
    <div
      className="flex flex-col gap-4 sm:gap-5"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {loading && !messages.length && (
        <div className="grid place-items-center gap-5 rounded-2xl border border-dashed border-cyan-500/25 bg-slate-950/40 p-10 text-center backdrop-blur-sm">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-500/15" />
            <span className="absolute inset-2 animate-pulse rounded-full bg-cyan-500/20" />
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-cyan-400/40 bg-cyan-950/60 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M21 12a8.5 8.5 0 11-3.2-6.6M21 4v5h-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-cyan-100 sm:text-lg">
              Wait for the stranger to chat with you
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              We are searching for someone nearby…
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-cyan-200/70">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:300ms]" />
          </span>
        </div>
      )}

      {!messages.length && !loading && (
        <div className="grid place-items-center rounded-2xl border border-dashed border-cyan-500/20 bg-slate-950/40 p-8 text-center text-sm text-slate-400 backdrop-blur-sm">
          Say hi to start the conversation.
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === "me" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex max-w-[min(88%,520px)] items-end gap-2.5 ${
              message.type === "me" ? "flex-row-reverse" : ""
            }`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold shadow-lg ${
                message.type === "me"
                  ? "border border-fuchsia-400/30 bg-fuchsia-950/60 text-fuchsia-200 shadow-[0_0_16px_rgba(217,70,239,0.35)]"
                  : "border border-cyan-400/25 bg-cyan-950/50 text-cyan-100 shadow-[0_0_16px_rgba(56,189,248,0.25)]"
              }`}
            >
              {message.type === "me" ? "You" : "S"}
            </span>
            <div
              className={[
                "rounded-[1.35rem] px-4 py-2.5 text-sm leading-snug backdrop-blur-sm md:text-[15px]",
                "break-words [word-break:break-word] whitespace-pre-wrap",
                message.type === "me"
                  ? "border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-600/95 via-purple-600/90 to-pink-600/85 text-white shadow-bubble-me"
                  : "border border-cyan-400/35 bg-slate-900/75 text-slate-100 shadow-bubble-them"
              ].join(" ")}
            >
              <p className="m-0">{message.text}</p>
              {message.time && (
                <time
                  dateTime={message.isoTime}
                  className={`mt-1.5 block text-end text-[10px] tabular-nums ${
                    message.type === "me" ? "text-fuchsia-100/75" : "text-cyan-200/50"
                  }`}
                >
                  {message.time}
                </time>
              )}
            </div>
          </div>
        </div>
      ))}

      {strangerTyping && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-slate-900/80 px-4 py-3 shadow-bubble-them backdrop-blur-md">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] [animation-delay:240ms]" />
            </span>
            <span className="text-xs text-cyan-100/80">Stranger is typing…</span>
          </div>
        </div>
      )}

      <div ref={endRef} className="h-px w-full shrink-0" aria-hidden />
    </div>
  )
}
