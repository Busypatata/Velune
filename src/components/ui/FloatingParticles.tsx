'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#B7A7D9', '#8FBF9F', '#FFB997', '#B8F2D0', '#FFD166', '#7BDFF2']

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div')
      const size = 3 + Math.random() * 5
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        animation: floatUp ${8 + Math.random() * 12}s linear ${Math.random() * 15}s infinite;
        opacity: 0;
        pointer-events: none;
      `
      container.appendChild(p)
    }
    return () => { if (container) container.innerHTML = '' }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
