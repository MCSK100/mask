import { useEffect, useRef, useState } from "react"
import { socket } from "../../lib/socket"

/** Real-time collaborative canvas. Emits incremental strokes via wb_op. */
export function Whiteboard({ onOp, canDraw }) {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState("pen")
  const [color, setColor] = useState("#f72b2b")
  const [size, setSize] = useState(3)
  const drawing = useRef(null)
  const undoStack = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth, h = Math.max(320, parent.clientHeight - 8)
      const tmp = document.createElement("canvas")
      tmp.width = canvas.width; tmp.height = canvas.height
      try { tmp.getContext("2d").drawImage(canvas, 0, 0) } catch {}
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      const ctx = canvas.getContext("2d")
      ctx.scale(dpr, dpr)
      ctx.lineCap = "round"; ctx.lineJoin = "round"
      try { ctx.drawImage(tmp, 0, 0, w, h) } catch {}
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  // incoming ops
  useEffect(() => {
    const onRemote = ({ op }) => applyOp(op)
    socket.on("wb_op", onRemote)
    socket.on("wb_clear", () => {
      const c = canvasRef.current
      c?.getContext("2d")?.clearRect(0, 0, c.width, c.height)
    })
    return () => { socket.off("wb_op", onRemote); socket.off("wb_clear") }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, size])

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
      ctx.fillStyle = op.color; ctx.font = `${op.size * 5}px Inter, sans-serif`
      ctx.fillText(op.text.slice(0, 200), op.x, op.y)
    }
  }

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
      applyOp(op); onOp(op); drawing.current = null
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
      onOp({ t: "stroke", pts: d.pts, color, size: tool === "erase" ? size * 3 : size, mode: tool === "erase" ? "erase" : "draw" })
    } else if (["rect", "circle", "line", "arrow"].includes(tool)) {
      const op = { t: "shape", kind: tool, shape: [...d.start, x, y], color, size }
      applyOp(op); onOp(op)
    }
  }

  const savePng = () => {
    const a = document.createElement("a")
    a.download = "shadowmeet-board.png"
    a.href = canvasRef.current.toDataURL("image/png")
    a.click()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 p-2">
        {[["pen", "✏️"], ["erase", "🧽"], ["line", "📏"], ["arrow", "➡️"], ["rect", "▭"], ["circle", "⭕"], ["text", "T"]].map(([t, icon]) => (
          <button key={t} onClick={() => setTool(t)} aria-label={t} className={`rounded-[3px] px-2.5 py-1.5 text-sm font-bold ${tool === t ? "bg-supari-primary text-white" : "bg-white/5 text-white"}`}>{icon}</button>
        ))}
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Color" className="h-8 w-10 cursor-pointer rounded bg-transparent" />
        <input type="range" min={1} max={12} value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Brush size" className="w-20" />
        <button onClick={() => { undoStack.current = []; canvasRef.current.getContext("2d").clearRect(0, 0, 9999, 9999) }} className="rounded-lg bg-white/5 px-2 py-1 text-xs">Clear view</button>
        <button onClick={savePng} className="rounded-lg bg-white/5 px-2 py-1 text-xs">PNG</button>
        {!canDraw && <span className="text-[11px] font-bold text-white">Drawing Paused By Host</span>}
      </div>
      <div className="relative flex-1 touch-none overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
        />
      </div>
    </div>
  )
}
