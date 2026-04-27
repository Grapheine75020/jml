import type { GlyphBounds } from './types'
import { CANVAS_FONT } from './constants'

export function computeGlyphBounds(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
): GlyphBounds {
  ctx.font = CANVAS_FONT
  const m = ctx.measureText(char)

  const ascent = m.actualBoundingBoxAscent
  const descent = m.actualBoundingBoxDescent
  const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
  const height = ascent + descent

  return {
    x: x - m.actualBoundingBoxLeft,
    y: y - ascent,
    width,
    height,
    ascent,
    descent,
  }
}
