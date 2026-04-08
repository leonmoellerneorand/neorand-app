'use client'
import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
  pulseSpeed: number
}

export function PortalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    let animFrame: number
    let w = window.innerWidth
    let h = window.innerHeight

    canvas.width = w
    canvas.height = h

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', resize)

    const COUNT = Math.floor((w * h) / 22000)
    const MAX_DIST = 160

    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }))

    let tick = 0

    function draw() {
      ctx.clearRect(0, 0, w, h)
      tick++

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.pulse += n.pulseSpeed
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Nodes with pulse
      for (const n of nodes) {
        const alpha = 0.25 + Math.sin(n.pulse) * 0.15
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.fill()
      }

      // Occasional bright node highlight
      if (tick % 120 === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)]
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20)
        grd.addColorStop(0, 'rgba(56, 189, 248, 0.3)')
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, 20, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8 }}
    />
  )
}
