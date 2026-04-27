import type { GlyphBounds, SliceRegion } from './types'
import { CACHED_CHARS, CANVAS_FONT_SIZE } from './constants'
import { computeGlyphBounds } from './glyph-metrics'

export type CachedGlyph = {
  char: string
  bounds: GlyphBounds
  horizontalSlices: SliceRegion[]
  verticalSlices: SliceRegion[]
}

export const GLYPH_CACHE = new Map<string, CachedGlyph>()

function buildHorizontalSlices(bounds: GlyphBounds): SliceRegion[] {
  const bandH = bounds.height / 6
  return Array.from({ length: 6 }, (_, i) => ({
    index: i,
    clipRect: { x: bounds.x, y: bounds.y + i * bandH, w: bounds.width, h: bandH },
    renderOffset: { dx: 0, dy: 0 },
  }))
}

function buildVerticalSlices(bounds: GlyphBounds): SliceRegion[] {
  const bandW = bounds.width / 6
  return Array.from({ length: 6 }, (_, i) => ({
    index: i,
    clipRect: { x: bounds.x + i * bandW, y: bounds.y, w: bandW, h: bounds.height },
    renderOffset: { dx: 0, dy: 0 },
  }))
}

export function populateGlyphCache(ctx: CanvasRenderingContext2D): void {
  GLYPH_CACHE.clear()

  const baseline = CANVAS_FONT_SIZE * 1.2

  for (const char of CACHED_CHARS) {
    const bounds = computeGlyphBounds(ctx, char, 0, baseline)
    GLYPH_CACHE.set(char, {
      char,
      bounds,
      horizontalSlices: buildHorizontalSlices(bounds),
      verticalSlices: buildVerticalSlices(bounds),
    })
  }
}

export function lookupGlyph(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
): CachedGlyph {
  const cached = GLYPH_CACHE.get(char)
  if (cached) {
    return {
      ...cached,
      bounds: {
        ...cached.bounds,
        x: x - (cached.bounds.x === 0 ? 0 : cached.bounds.x),
      },
    }
  }

  const bounds = computeGlyphBounds(ctx, char, x, y)
  const entry: CachedGlyph = {
    char,
    bounds,
    horizontalSlices: buildHorizontalSlices(bounds),
    verticalSlices: buildVerticalSlices(bounds),
  }
  GLYPH_CACHE.set(char, entry)
  return entry
}
