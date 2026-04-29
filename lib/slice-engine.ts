import type { Direction, GlyphBounds, SliceRegion } from './types'

/**
 * Builds cumulative progressive slice projections.
 *
 * For sliceCount=N, projections go from closest to furthest:
 *   Projection 1 (closest) → N bands thick (largest)
 *   Projection 2           → N-1 bands thick
 *   Projection N (furthest)→ 1 band thick (smallest)
 *
 * Each projection stacks outward with `gap` between every element
 * (letter → proj1, proj1 → proj2, etc.).
 *
 * 'up' / 'left'   → uses top/left bands, projects outward in negative direction
 * 'down' / 'right'→ uses bottom/right bands, projects outward in positive direction
 */
export function buildSliceRegions(
  bounds: GlyphBounds,
  direction: Direction,
  sliceCount: number,
  gap: number,
): SliceRegion[] {
  const result: SliceRegion[] = []

  if (direction === 'up' || direction === 'down') {
    const bandH = bounds.height / 6

    if (direction === 'up') {
      let runningY = bounds.y
      for (let j = 1; j <= sliceCount; j++) {
        const size = (sliceCount + 1 - j) * bandH
        const clipY = runningY - gap - size
        result.push({
          index: j - 1,
          clipRect: { x: bounds.x, y: clipY, w: bounds.width, h: size },
          renderOffset: { dx: 0, dy: clipY - bounds.y },
        })
        runningY = clipY
      }
    } else {
      let runningY = bounds.y + bounds.height
      for (let j = 1; j <= sliceCount; j++) {
        const size = (sliceCount + 1 - j) * bandH
        const clipY = runningY + gap
        const srcY = bounds.y + bounds.height - size
        result.push({
          index: j - 1,
          clipRect: { x: bounds.x, y: clipY, w: bounds.width, h: size },
          renderOffset: { dx: 0, dy: clipY - srcY },
        })
        runningY = clipY + size
      }
    }
  } else {
    const bandW = bounds.width / 6

    if (direction === 'left') {
      let runningX = bounds.x
      for (let j = 1; j <= sliceCount; j++) {
        const size = (sliceCount + 1 - j) * bandW
        const clipX = runningX - gap - size
        result.push({
          index: j - 1,
          clipRect: { x: clipX, y: bounds.y, w: size, h: bounds.height },
          renderOffset: { dx: clipX - bounds.x, dy: 0 },
        })
        runningX = clipX
      }
    } else {
      let runningX = bounds.x + bounds.width
      for (let j = 1; j <= sliceCount; j++) {
        const size = (sliceCount + 1 - j) * bandW
        const clipX = runningX + gap
        const srcX = bounds.x + bounds.width - size
        result.push({
          index: j - 1,
          clipRect: { x: clipX, y: bounds.y, w: size, h: bounds.height },
          renderOffset: { dx: clipX - srcX, dy: 0 },
        })
        runningX = clipX + size
      }
    }
  }

  return result
}
