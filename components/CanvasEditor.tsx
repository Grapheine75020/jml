'use client'

import { useRef, useState, useEffect } from 'react'
import { useEngineStore } from '@/lib/store'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'
import { useHitDetection } from '@/hooks/useHitDetection'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants'
import { Input } from '@/components/ui/input'

export default function CanvasEditor() {
  const [text, setText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markDirty = useEngineStore((s) => s.markDirty)

  useCanvasRenderer(canvasRef, text)
  useHitDetection(canvasRef)

  useEffect(() => {
    markDirty()
  }, [markDirty])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    markDirty()
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block cursor-pointer border border-border bg-white"
        />
      </div>
      <Input
        value={text}
        onChange={handleChange}
        placeholder="Saisissez votre texte…"
        className="w-80"
        autoFocus
      />
    </div>
  )
}
