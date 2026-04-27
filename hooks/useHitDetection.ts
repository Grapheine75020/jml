'use client'

import { useEffect } from 'react'
import { useEngineStore } from '@/lib/store'

export function useHitDetection(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const characters = useEngineStore((s) => s.characters)
  const selectCharacter = useEngineStore((s) => s.selectCharacter)
  const setPopupPosition = useEngineStore((s) => s.setPopupPosition)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

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
  }, [canvasRef, characters, selectCharacter, setPopupPosition])
}
