'use client'

import { useEffect, useRef } from 'react'
import { useEngineStore } from '@/lib/store'
import { CANVAS_FONT, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants'
import { computeGlyphBounds } from '@/lib/glyph-metrics'
import { buildSliceRegions } from '@/lib/slice-engine'
import { drawOnContext } from '@/lib/renderer-utils'
import type { CharacterState, ExtensionConfig } from '@/lib/types'

const BASELINE_RATIO = 0.65
const SELECTION_COLOR = '#7c3aed'

/**
 * Returns the total horizontal width occupied by projections,
 * measured from the character's visual edge outward.
 * bandW = bounds.width / 6
 */
/**
 * Returns the total visual extension length (outward from the glyph edge)
 * For sliceCount=N: size = bandSize * (N * (N+1) / 2) + N * gap
 */
function extensionLength(baseSize: number, ext: ExtensionConfig): number {
  const bandSize = baseSize / 6
  const cumulativeBands = (ext.sliceCount * (ext.sliceCount + 1)) / 2
  return ext.gap * ext.sliceCount + bandSize * cumulativeBands
}

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  text: string,
) {
  const isDirty = useEngineStore((s) => s.isDirty)
  const selectedIndex = useEngineStore((s) => s.selectedIndex)
  const updateCharacters = useEngineStore((s) => s.updateCharacters)
  const setTransform = useEngineStore((s) => s.setTransform)
  const markDirty = useEngineStore((s) => s.markDirty)
  const rafRef = useRef<number | null>(null)
  const dprInit = useRef(false)

  // Re-render when theme changes (dark/light class on <html>)
  useEffect(() => {
    const observer = new MutationObserver(() => markDirty())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [markDirty])

  useEffect(() => {
    if (!isDirty) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!dprInit.current) {
      const dpr = window.devicePixelRatio || 1
      canvas.width = CANVAS_WIDTH * dpr
      canvas.height = CANVAS_HEIGHT * dpr
      canvas.style.width = `${CANVAS_WIDTH}px`
      canvas.style.height = `${CANVAS_HEIGHT}px`
      ctx.scale(dpr, dpr)
      dprInit.current = true
    }

    rafRef.current = requestAnimationFrame(() => {
      ctx.save()
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      if (!text) {
        updateCharacters([])
        ctx.restore()
        return
      }

      ctx.font = CANVAS_FONT
      const baseline = 0 // We'll compute the actual Y shift later
      const n = text.length

      // ── Phase 1 : métriques de base (à l'échelle 1:1) ────────────
      const advances: number[] = []
      const blLeft: number[] = [] 
      const blRight: number[] = []
      const blAscent: number[] = []
      const blDescent: number[] = []

      for (let i = 0; i < n; i++) {
        const m = ctx.measureText(text[i])
        advances[i] = m.width
        blLeft[i] = m.actualBoundingBoxLeft
        blRight[i] = m.actualBoundingBoxRight
        blAscent[i] = m.actualBoundingBoxAscent
        blDescent[i] = m.actualBoundingBoxDescent
      }

      const prevChars = useEngineStore.getState().characters
      const extensions: (ExtensionConfig | undefined)[] = Array.from({ length: n }, (_, i) =>
        prevChars[i]?.char === text[i] ? prevChars[i].extension : undefined,
      )

      // ── Phase 2 : calcul des push offsets ────────────────────────────────
      const pushOffsets: number[] = new Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        const ext = extensions[i]
        if (!ext?.direction) continue
        const boundsWidth = blLeft[i] + blRight[i]
        const extLen = extensionLength(boundsWidth, ext)

        if (ext.direction === 'right') {
          for (let j = i + 1; j < n; j++) pushOffsets[j] += extLen
        } else if (ext.direction === 'left') {
          for (let j = 0; j < i; j++) pushOffsets[j] -= extLen
        }
      }

      // ── Phase 3 : étendue totale pour auto-zoom et centrage ──────────────
      const rawCursors: number[] = new Array(n).fill(0)
      let rx = 0
      for (let i = 0; i < n; i++) {
        rawCursors[i] = rx + pushOffsets[i]
        rx += advances[i]
      }

      const visualLefts: number[] = []
      const visualRights: number[] = []
      const visualTops: number[] = []
      const visualBottoms: number[] = []

      for (let i = 0; i < n; i++) {
        const ext = extensions[i]
        const boundsWidth = blLeft[i] + blRight[i]
        const boundsHeight = blAscent[i] + blDescent[i]
        
        let leftExt = 0, rightExt = 0, topExt = 0, bottomExt = 0
        if (ext?.direction === 'left') leftExt = extensionLength(boundsWidth, ext)
        if (ext?.direction === 'right') rightExt = extensionLength(boundsWidth, ext)
        if (ext?.direction === 'up') topExt = extensionLength(boundsHeight, ext)
        if (ext?.direction === 'down') bottomExt = extensionLength(boundsHeight, ext)

        visualLefts.push(rawCursors[i] - blLeft[i] - leftExt)
        visualRights.push(rawCursors[i] + blRight[i] + rightExt)
        visualTops.push(-blAscent[i] - topExt)
        visualBottoms.push(blDescent[i] + bottomExt)
      }

      const minL = Math.min(...visualLefts)
      const maxR = Math.max(...visualRights)
      const minT = Math.min(...visualTops)
      const maxB = Math.max(...visualBottoms)

      const totalW = maxR - minL
      const totalH = maxB - minT

      // ── Phase 4 : calcul Zoom & Translation ──────────────────────────────
      const PADDING = 60
      const availableW = CANVAS_WIDTH - PADDING * 2
      const availableH = CANVAS_HEIGHT - PADDING * 2
      
      const scale = Math.min(1, availableW / totalW, availableH / totalH)
      
      // On applique le scale
      ctx.scale(scale, scale)

      // Décalage pour centrer
      const targetCenterX = CANVAS_WIDTH / 2 / scale
      const targetCenterY = CANVAS_HEIGHT / 2 / scale
      const currentCenterX = (minL + maxR) / 2
      const currentCenterY = (minT + maxB) / 2

      const offsetX = targetCenterX - currentCenterX
      const offsetY = targetCenterY - currentCenterY

      ctx.translate(offsetX, offsetY)
      setTransform({ scale, offsetX, offsetY })

      // ── Phase 5 : rendu final ────────────────────────────────────────────
      const finalChars: CharacterState[] = []

      for (let i = 0; i < n; i++) {
        const char = text[i]
        const x = rawCursors[i]
        const y = 0 // relative to translation
        const bounds = computeGlyphBounds(ctx, char, x, y)

        finalChars.push({
          char,
          position: i,
          bounds,
          isSelected: i === selectedIndex,
          extension: extensions[i],
        })
      }

      // We need to restore because drawOnContext does its own save/restore and clear
      ctx.restore()
      
      const isDark = document.documentElement.classList.contains('dark')
      drawOnContext(ctx, finalChars, { scale, offsetX, offsetY }, {
        showSelection: true,
        isDark,
      })

      updateCharacters(finalChars)
    })

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isDirty, text, selectedIndex, canvasRef, updateCharacters, setTransform])
}
