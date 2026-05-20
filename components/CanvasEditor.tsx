'use client'

import { useRef, useState, useEffect } from 'react'
import { useEngineStore } from '@/lib/store'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'
import { useHitDetection } from '@/hooks/useHitDetection'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants'
import { checkRendererIntegrity } from '@/components/ConsoleCredit'
import { Input } from '@/components/ui/input'
import ExportPanel from '@/components/ExportPanel'
import { useLang } from '@/lib/i18n/LangContext'

export default function CanvasEditor() {
  const { t } = useLang()
  const [text, setText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markDirty = useEngineStore((s) => s.markDirty)

  useCanvasRenderer(canvasRef, text)
  useHitDetection(canvasRef)

  useEffect(() => {
    markDirty()
    checkRendererIntegrity()
  }, [markDirty])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toLowerCase())
    markDirty()
  }

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      <div className="overflow-x-auto">
        <div
          className="flex flex-col overflow-hidden rounded-4xl border border-border shadow-sm"
          style={{ width: CANVAS_WIDTH }}
        >
          {/* Canvas — pas de border CSS, le wrapper gère les arrondis */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block cursor-pointer"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-3 border-t border-border bg-background px-4 h-[52px]">
            <Input
              value={text}
              onChange={handleChange}
              placeholder={t('canvas.placeholder')}
              className="flex-1 h-9 border-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
            <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
