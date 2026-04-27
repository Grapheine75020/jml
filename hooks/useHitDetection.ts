'use client'

import { useEffect } from 'react'
import { useEngineStore } from '@/lib/store'

export function useHitDetection(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const characters = useEngineStore((s) => s.characters)
  const transform = useEngineStore((s) => s.transform)
  const selectCharacter = useEngineStore((s) => s.selectCharacter)
  const setPopupPosition = useEngineStore((s) => s.setPopupPosition)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Raw canvas coordinates (in CSS pixels)
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Convert to local coordinates (undo scale and translate)
      // (localX + offsetX) * scale = mouseX  => localX = (mouseX / scale) - offsetX
      const x = (mouseX / transform.scale) - transform.offsetX
      const y = (mouseY / transform.scale) - transform.offsetY

      for (let i = 0; i < characters.length; i++) {
        const { bounds } = characters[i]
        if (
          x >= bounds.x &&
          x <= bounds.x + bounds.width &&
          y >= bounds.y &&
          y <= bounds.y + bounds.height
        ) {
          selectCharacter(i)
          setPopupPosition({ x: e.clientX, y: e.clientY })
          return
        }
      }

      selectCharacter(null)
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [canvasRef, characters, selectCharacter, setPopupPosition, transform])
}
