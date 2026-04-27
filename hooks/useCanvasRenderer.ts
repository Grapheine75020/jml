'use client'

import { useEffect, useRef } from 'react'
import { useEngineStore } from '@/lib/store'
import { CANVAS_FONT, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants'
import { computeGlyphBounds } from '@/lib/glyph-metrics'
import { buildSliceRegions } from '@/lib/slice-engine'
import type { CharacterState, ExtensionConfig } from '@/lib/types'

const BASELINE_RATIO = 0.65
const SELECTION_COLOR = '#7c3aed'

/**
 * Returns the total horizontal width occupied by projections,
 * measured from the character's visual edge outward.
 * bandW = bounds.width / 6
 */
function extensionWidth(boundsWidth: number, ext: ExtensionConfig): number {
  const bandW = boundsWidth / 6
  return ext.sliceCount * ext.gap + bandW * (ext.sliceCount * (ext.sliceCount + 1)) / 2
}

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  text: string,
) {
  const isDirty = useEngineStore((s) => s.isDirty)
  const selectedIndex = useEngineStore((s) => s.selectedIndex)
  const updateCharacters = useEngineStore((s) => s.updateCharacters)
  const rafRef = useRef<number | null>(null)
  const dprInit = useRef(false)

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
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      if (!text) {
        updateCharacters([])
        return
      }

      ctx.font = CANVAS_FONT
      const baseline = CANVAS_HEIGHT * BASELINE_RATIO
      const n = text.length

      // ── Phase 1 : métriques de base (position-indépendantes) ────────────
      const advances: number[] = []
      const blLeft: number[] = []  // actualBoundingBoxLeft
      const blRight: number[] = [] // actualBoundingBoxRight

      for (let i = 0; i < n; i++) {
        const m = ctx.measureText(text[i])
        advances[i] = m.width
        blLeft[i] = m.actualBoundingBoxLeft
        blRight[i] = m.actualBoundingBoxRight
      }

      // Récupère les extensions stockées (non-réactif)
      const prevChars = useEngineStore.getState().characters
      const extensions: (ExtensionConfig | undefined)[] = Array.from({ length: n }, (_, i) =>
        prevChars[i]?.char === text[i] ? prevChars[i].extension : undefined,
      )

      // ── Phase 2 : calcul des push offsets ────────────────────────────────
      // Pour chaque extension horizontale, décale les lettres adjacentes.
      const pushOffsets: number[] = new Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        const ext = extensions[i]
        if (!ext?.direction) continue
        const boundsWidth = blLeft[i] + blRight[i]
        const extW = extensionWidth(boundsWidth, ext)

        if (ext.direction === 'right') {
          // Les lettres après i se décalent vers la droite
          for (let j = i + 1; j < n; j++) pushOffsets[j] += extW
        } else if (ext.direction === 'left') {
          // Les lettres avant i se décalent vers la gauche
          for (let j = 0; j < i; j++) pushOffsets[j] -= extW
        }
      }

      // ── Phase 3 : positions curseurs ajustées + centrage ─────────────────
      const rawCursors: number[] = new Array(n).fill(0)
      let rx = 0
      for (let i = 0; i < n; i++) {
        rawCursors[i] = rx + pushOffsets[i]
        rx += advances[i]
      }

      // Étendue visuelle totale (lettres + projections horizontales)
      const rightExts = extensions.map((ext, i) =>
        ext && (ext.direction === 'right')
          ? extensionWidth(blLeft[i] + blRight[i], ext)
          : 0,
      )
      const leftExts = extensions.map((ext, i) =>
        ext && (ext.direction === 'left')
          ? extensionWidth(blLeft[i] + blRight[i], ext)
          : 0,
      )

      const visualLefts = rawCursors.map((x, i) => x - blLeft[i] - leftExts[i])
      const visualRights = rawCursors.map((x, i) => x + blRight[i] + rightExts[i])
      const minLeft = Math.min(...visualLefts)
      const maxRight = Math.max(...visualRights)
      const totalWidth = maxRight - minLeft

      // Décalage pour centrer la composition
      const centerOffset = (CANVAS_WIDTH - totalWidth) / 2 - minLeft
      const cursorXs = rawCursors.map((x) => x + centerOffset)

      // ── Phase 4 : rendu ──────────────────────────────────────────────────
      const chars: CharacterState[] = []

      for (let i = 0; i < n; i++) {
        const char = text[i]
        const x = cursorXs[i]
        const bounds = computeGlyphBounds(ctx, char, x, baseline)

        chars.push({
          char,
          position: i,
          bounds,
          isSelected: i === selectedIndex,
          extension: extensions[i],
        })

        if (i === selectedIndex) {
          ctx.save()
          ctx.strokeStyle = SELECTION_COLOR
          ctx.lineWidth = 2
          ctx.strokeRect(bounds.x - 3, bounds.y - 3, bounds.width + 6, bounds.height + 6)
          ctx.restore()
        }

        ctx.fillStyle = '#000000'
        ctx.fillText(char, x, baseline)
      }

      // ── Phase 5 : tranches pour tous les caractères avec extension ────────
      for (let i = 0; i < n; i++) {
        const ext = chars[i].extension
        if (!ext?.direction) continue

        const slices = buildSliceRegions(
          chars[i].bounds,
          ext.direction,
          ext.sliceCount,
          ext.gap,
        )

        for (const slice of slices) {
          ctx.save()
          ctx.beginPath()
          ctx.rect(slice.clipRect.x, slice.clipRect.y, slice.clipRect.w, slice.clipRect.h)
          ctx.clip()
          ctx.fillStyle = '#000000'
          ctx.font = CANVAS_FONT
          ctx.fillText(
            chars[i].char,
            cursorXs[i] + slice.renderOffset.dx,
            baseline + slice.renderOffset.dy,
          )
          ctx.restore()
        }
      }

      updateCharacters(chars)
    })

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isDirty, text, selectedIndex, canvasRef, updateCharacters])
}
