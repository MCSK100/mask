import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react"
import {
  MousePointer2, PenTool, Eraser, Minus, MoveUpRight, Square, Circle, Type,
  Undo2, Redo2, Trash2, Download
} from "lucide-react"

const COLORS = ["#16283A", "#724aee", "#9c80f3", "#E8382F", "#22B573", "#F5B301"]

/**
 * Classroom whiteboard — white canvas card with left rail + bottom color bar.
 * Realtime transport is LiveKit data (ops only, never full images).
 * Parent sends local ops via `onOp` and delivers remote ops via ref.applyRemoteOp().
 */
export const Whiteboard = forwardRef(function Whiteboard({ onOp, canDraw, remoteOps = [] }, ref) {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState("pen")
  const [color, setColor] = useState("#16283A")
  const [size] = useState(3)
  const drawing = useRef(null)

  const applyOp = (op) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (op.t === "stroke") {
      ctx.strokeStyle = op.color; ctx.lineWidth = op.size
      ctx.globalCompositeOperation = op.mode === "erase" ? "destination-out" : "source-over"
      ctx.beginPath()
      op.pts.forEach(([x, y], i) => { i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) })
      ctx.stroke()
      ctx.globalCompositeOperation = "source-over"
    } else if (op.t === "shape" && op.shape) {
      ctx.strokeStyle = op.color; ctx.lineWidth = op.size
      ctx.beginPath()
      const [x1, y1, x2, y2] = op.shape
      if (op.kind === "rect") ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
      else if (op.kind === "circle") { ctx.arc((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2, 0, 7); ctx.stroke() }
      else if (op.kind === "line" || op.kind === "arrow") {
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
        if (op.kind === "arrow") {
          const a = Math.atan2(y2 - y1, x2 - x1)
          ctx.beginPath()
          ctx.moveTo(x2, y2)
          ctx.lineTo(x2 - 12 * Math.cos(a - 0.4), y2 - 12 * Math.sin(a - 0.4))
          ctx.moveTo(x2, y2)
          ctx.lineTo(x2 - 12 * Math.cos(a + 0.4), y2 - 12 * Math.sin(a + 0.4))
          ctx.stroke()
        }
      }
    } else if (op.t === "text" && op.text) {
      ctx.fillStyle = op.color; ctx.font = `${op.size * 5}px 'Hanken Grotesk', sans-serif`
      ctx.fillText(op.text.slice(0, 200), op.x, op.y)
    }
  }

  // Spec ops {op:'draw'|..., tool, points, color, width} <-> legacy canvas ops.
  const normalizeOp = (msg) => {
    if (!msg || typeof msg !== "object") return null
    if (msg.t) return msg // already legacy
    if (msg.op === "draw" || msg.op === "erase") {
      return {
        t: "stroke",
        pts: msg.points || [],
        color: msg.color || "#16283A",
        size: msg.width || 3,
        mode: msg.op === "erase" ? "erase" : "draw",
      }
    }
    if (msg.op === "shape") {
      return {
        t: "shape", kind: msg.tool || "rect",
        shape: msg.points?.length >= 2 ? [...msg.points[0], ...msg.points[1]] : null,
        color: msg.color || "#16283A", size: msg.width || 3,
      }
    }
    if (msg.op === "text") {
      return { t: "text", text: msg.text || "", x: msg.points?.[0]?.[0] || 0, y: msg.points?.[0]?.[1] || 0, color: msg.color || "#16283A", size: msg.width || 3 }
    }
    return null
  }

  const emitSpec = (legacy) => {
    if (!legacy) return
    if (legacy.t === "stroke") {
      onOp?.({ op: legacy.mode === "erase" ? "erase" : "draw", tool: legacy.mode === "erase" ? "erase" : "pen", points: legacy.pts, color: legacy.color, width: legacy.size })
    } else if (legacy.t === "shape") {
      const [x1, y1, x2, y2] = legacy.shape || [0, 0, 0, 0]
      onOp?.({ op: "shape", tool: legacy.kind, points: [[x1, y1], [x2, y2]], color: legacy.color, width: legacy.size })
    } else if (legacy.t === "text") {
      onOp?.({ op: "text", tool: "text", points: [[legacy.x, legacy.y]], text: legacy.text, color: legacy.color, width: legacy.size })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth, h = Math.max(280, parent.clientHeight - 4)
      const tmp = document.createElement("canvas")
      tmp.width = canvas.width; tmp.height = canvas.height
      try { tmp.getContext("2d").drawImage(canvas, 0, 0) } catch { /* keep blank on resize failure */ }
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      const ctx = canvas.getContext("2d")
      ctx.scale(dpr, dpr)
      ctx.lineCap = "round"; ctx.lineJoin = "round"
      try { ctx.drawImage(tmp, 0, 0, w, h) } catch { /* keep blank on resize failure */ }
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  // Remote ops arrive via LiveKit data through the `remoteOps` prop
  // (parent appends; each mounted instance applies new entries).
  // Supports both legacy socket-style ops {t:'stroke'...} and spec ops {op:'draw'...}.
  const lastSeq = useRef(-1)
  useEffect(() => {
    for (const msg of remoteOps) {
      if (msg._seq !== undefined && msg._seq <= lastSeq.current) continue
      if (msg._seq !== undefined) lastSeq.current = msg._seq
      if (msg.op === "clear") {
        const c = canvasRef.current
        c?.getContext("2d")?.clearRect(0, 0, c.width, c.height)
        continue
      }
      const legacy = normalizeOp(msg)
      if (legacy) applyOp(legacy)
    }
  }, [remoteOps])

  useImperativeHandle(ref, () => ({
    applyRemoteOp(msg) {
      if (!msg) return
      if (msg.op === "clear") {
        const c = canvasRef.current
        c?.getContext("2d")?.clearRect(0, 0, c.width, c.height)
        return
      }
      const legacy = normalizeOp(msg)
      if (legacy) applyOp(legacy)
    },
    clear() {
      const c = canvasRef.current
      c?.getContext("2d")?.clearRect(0, 0, c.width, c.height)
    },
  }))

  const pos = (e) => {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const cx = (e.touches?.[0]?.clientX ?? e.clientX) - r.left
    const cy = (e.touches?.[0]?.clientY ?? e.clientY) - r.top
    return [cx, cy]
  }

  const startDraw = (e) => {
    if (!canDraw) return
    e.preventDefault()
    const [x, y] = pos(e)
    drawing.current = { pts: [[x, y]], start: [x, y], text: tool === "text" ? prompt("Text:") || "" : null }
    if (tool === "text" && drawing.current.text) {
      const op = { t: "text", text: drawing.current.text, x, y, color, size }
      applyOp(op); emitSpec(op); drawing.current = null
    }
  }
  const moveDraw = (e) => {
    if (!drawing.current || !canDraw || tool === "text") return
    e.preventDefault()
    const [x, y] = pos(e)
    drawing.current.pts.push([x, y])
    if (tool === "pen" || tool === "erase") {
      const pts = drawing.current.pts.slice(-2)
      applyOp({ t: "stroke", pts, color, size: tool === "erase" ? size * 3 : size, mode: tool === "erase" ? "erase" : "draw" })
    }
  }
  const endDraw = (e) => {
    if (!drawing.current || !canDraw) { drawing.current = null; return }
    const [x, y] = pos(e)
    const d = drawing.current
    drawing.current = null
    if (tool === "pen" || tool === "erase") {
      const full = { t: "stroke", pts: d.pts, color, size: tool === "erase" ? size * 3 : size, mode: tool === "erase" ? "erase" : "draw" }
      emitSpec(full)
    } else if (["rect", "circle", "line", "arrow"].includes(tool)) {
      const op = { t: "shape", kind: tool, shape: [...d.start, x, y], color, size }
      applyOp(op); emitSpec(op)
    }
  }

  const clearAll = () => {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, 9999, 9999)
    try { onOp?.({ op: "clear" }) } catch { /* best-effort broadcast */ }
  }

  const tools = [
    ["select", MousePointer2], ["pen", PenTool], ["erase", Eraser],
    ["line", Minus], ["arrow", MoveUpRight], ["rect", Square], ["circle", Circle], ["text", Type],
  ]

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative min-h-0 flex-1">
        {/* left vertical rail like reference */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 rounded-2xl border border-[#E3ECF7] bg-white/95 p-1.5 shadow-sm">
          {tools.map(([t, Icon]) => (
            <button
              key={t}
              onClick={() => t !== "select" && setTool(t)}
              aria-label={t} title={t}
              className={`classroom-rail-btn ${tool === t ? "active" : ""}`}
              style={{ width: "32px", height: "32px", borderRadius: "10px" }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <div className="h-full w-full touch-none overflow-hidden">
          <canvas
            ref={canvasRef}
            className="touch-none cursor-crosshair"
            onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
          />
        </div>
        {!canDraw && (
          <span className="absolute right-2 top-2 rounded-full bg-[#F1F6FA] px-2.5 py-1 text-[10px] font-bold text-[#8AA6B8]">View only</span>
        )}
      </div>
      {/* bottom toolbar like reference */}
      <div className="flex items-center justify-center gap-2 border-t border-[#EAF0F7] bg-white px-3 py-2">
        <button className="classroom-rail-btn" style={{ width: "30px", height: "30px" }} title="Undo" onClick={() => setTool("pen")}>
          <Undo2 size={14} />
        </button>
        <button className="classroom-rail-btn" style={{ width: "30px", height: "30px" }} title="Redo" onClick={() => setTool("pen")}>
          <Redo2 size={14} />
        </button>
        <span className="mx-1 h-5 w-px bg-[#E3ECF7]" />
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool("pen") }}
            aria-label={`Color ${c}`}
            style={{
              width: "22px", height: "22px", borderRadius: "50%", background: c, cursor: "pointer",
              border: color === c ? "2px solid #724aee" : "2px solid #fff",
              boxShadow: "0 0 0 1px rgba(30,70,140,.15)",
            }}
          />
        ))}
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Custom color" className="h-6 w-8 cursor-pointer" style={{ background: "none", border: "none" }} />
        <span className="mx-1 h-5 w-px bg-[#E3ECF7]" />
        <button onClick={clearAll} className="classroom-rail-btn" style={{ width: "30px", height: "30px" }} title="Clear">
          <Trash2 size={14} />
        </button>
        <button onClick={() => {
          const a = document.createElement("a")
          a.download = "shadowmeet-board.png"
          a.href = canvasRef.current.toDataURL("image/png")
          a.click()
        }} className="classroom-rail-btn" style={{ width: "30px", height: "30px" }} title="Save PNG">
          <Download size={14} />
        </button>
      </div>
    </div>
  )
})
