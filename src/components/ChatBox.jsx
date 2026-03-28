export default function ChatBox({ messages, loading = false }) {
  return (
    <div className="chat-scrollbar grid flex-1 grid-cols-1 gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
      {loading && !messages.length && (
        <div className="grid gap-3">
          <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-800/70" />
          <div className="ml-auto h-10 w-1/2 animate-pulse rounded-2xl bg-violet-900/50" />
          <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-slate-800/70" />
        </div>
      )}
      {!messages.length && !loading && (
        <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400">
          Say hi to start the conversation.
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={`${message.type}-${index}`}
          className={`flex ${message.type === "me" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex max-w-[88%] items-end gap-2 ${message.type === "me" ? "flex-row-reverse" : ""}`}>
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${
                message.type === "me" ? "bg-violet-400/20 text-violet-200" : "bg-slate-700/70 text-slate-200"
              }`}
            >
              {message.type === "me" ? "You" : "S"}
            </span>
            <div
              className={`rounded-2xl px-4 py-2 text-sm md:text-base ${
              message.type === "me"
                ? "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/30"
                : "border border-white/10 bg-slate-800/80 text-slate-100"
            }`}
            >
              <p>{message.text}</p>
              {message.time && (
                <span className={`mt-1 block text-[10px] ${message.type === "me" ? "text-violet-100/80" : "text-slate-400"}`}>
                  {message.time}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}