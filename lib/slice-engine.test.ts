import { buildSliceRegions } from './slice-engine'
import type { GlyphBounds } from './types'

const B: GlyphBounds = {
  x: 40,
  y: 100,
  width: 120,
  height: 180,
  ascent: 150,
  descent: 30,
}

const bandH = B.height / 6 // 30
const bandW = B.width / 6  // 20

describe('buildSliceRegions — largest closest, smallest furthest', () => {

  describe('direction: up', () => {
    it('sliceCount=1 → 1 projection, 1 band thick', () => {
      const [s] = buildSliceRegions(B, 'up', 1, 0)
      expect(s.clipRect.h).toBeCloseTo(bandH)
      expect(s.clipRect.w).toBeCloseTo(B.width)
    })

    it('sliceCount=2 → closest=2 bands, furthest=1 band', () => {
      const [s1, s2] = buildSliceRegions(B, 'up', 2, 0)
      expect(s1.clipRect.h).toBeCloseTo(2 * bandH) // largest, closest
      expect(s2.clipRect.h).toBeCloseTo(1 * bandH) // smallest, furthest
    })

    it('sliceCount=3 → closest=3 bands, middle=2, furthest=1', () => {
      const [s1, s2, s3] = buildSliceRegions(B, 'up', 3, 0)
      expect(s1.clipRect.h).toBeCloseTo(3 * bandH)
      expect(s2.clipRect.h).toBeCloseTo(2 * bandH)
      expect(s3.clipRect.h).toBeCloseTo(1 * bandH)
    })

    it('projection 1 bottom edge is flush with letter top (gap=0)', () => {
      const [s1] = buildSliceRegions(B, 'up', 1, 0)
      expect(s1.clipRect.y + s1.clipRect.h).toBeCloseTo(B.y)
    })

    it('projection 1 (closest) bottom edge is flush with letter top (sliceCount=3, gap=0)', () => {
      const [s1] = buildSliceRegions(B, 'up', 3, 0)
      expect(s1.clipRect.y + s1.clipRect.h).toBeCloseTo(B.y)
    })

    it('gap separates letter top from projection 1', () => {
      const [s1] = buildSliceRegions(B, 'up', 1, 20)
      expect(B.y - (s1.clipRect.y + s1.clipRect.h)).toBeCloseTo(20)
    })

    it('projections stack with gap between them', () => {
      const GAP = 10
      const [s1, s2] = buildSliceRegions(B, 'up', 2, GAP)
      const distBetween = s1.clipRect.y - (s2.clipRect.y + s2.clipRect.h)
      expect(distBetween).toBeCloseTo(GAP)
    })

    it('projections do not overlap (gap=0)', () => {
      const [s1, s2] = buildSliceRegions(B, 'up', 2, 0)
      expect(s1.clipRect.y).toBeCloseTo(s2.clipRect.y + s2.clipRect.h)
    })

    it('each projection has a distinct renderOffset', () => {
      const [s1, s2, s3] = buildSliceRegions(B, 'up', 3, 0)
      expect(s1.renderOffset.dy).not.toBeCloseTo(s2.renderOffset.dy)
      expect(s2.renderOffset.dy).not.toBeCloseTo(s3.renderOffset.dy)
      // All offsets are negative (upward)
      expect(s1.renderOffset.dy).toBeLessThan(0)
    })
  })

  describe('direction: down', () => {
    it('sliceCount=1 → 1 projection, 1 band thick', () => {
      const [s] = buildSliceRegions(B, 'down', 1, 0)
      expect(s.clipRect.h).toBeCloseTo(bandH)
    })

    it('sliceCount=3 → closest=3 bands, middle=2, furthest=1', () => {
      const [s1, s2, s3] = buildSliceRegions(B, 'down', 3, 0)
      expect(s1.clipRect.h).toBeCloseTo(3 * bandH)
      expect(s2.clipRect.h).toBeCloseTo(2 * bandH)
      expect(s3.clipRect.h).toBeCloseTo(1 * bandH)
    })

    it('projection 1 top edge is flush with letter bottom (gap=0)', () => {
      const [s1] = buildSliceRegions(B, 'down', 3, 0)
      expect(s1.clipRect.y).toBeCloseTo(B.y + B.height)
    })

    it('projections stack with gap between them', () => {
      const GAP = 10
      const [s1, s2] = buildSliceRegions(B, 'down', 2, GAP)
      const distBetween = s2.clipRect.y - (s1.clipRect.y + s1.clipRect.h)
      expect(distBetween).toBeCloseTo(GAP)
    })

    it('all renderOffset.dy are positive (downward)', () => {
      const slices = buildSliceRegions(B, 'down', 3, 0)
      slices.forEach((s) => expect(s.renderOffset.dy).toBeGreaterThan(0))
    })
  })

  describe('direction: left', () => {
    it('sliceCount=3 → closest=3 bands, middle=2, furthest=1', () => {
      const [s1, s2, s3] = buildSliceRegions(B, 'left', 3, 0)
      expect(s1.clipRect.w).toBeCloseTo(3 * bandW)
      expect(s2.clipRect.w).toBeCloseTo(2 * bandW)
      expect(s3.clipRect.w).toBeCloseTo(1 * bandW)
    })

    it('projection 1 right edge is flush with letter left (gap=0)', () => {
      const [s1] = buildSliceRegions(B, 'left', 3, 0)
      expect(s1.clipRect.x + s1.clipRect.w).toBeCloseTo(B.x)
    })

    it('projections stack with gap between them', () => {
      const GAP = 5
      const [s1, s2] = buildSliceRegions(B, 'left', 2, GAP)
      const distBetween = s1.clipRect.x - (s2.clipRect.x + s2.clipRect.w)
      expect(distBetween).toBeCloseTo(GAP)
    })
  })

  describe('direction: right', () => {
    it('sliceCount=3 → closest=3 bands, middle=2, furthest=1', () => {
      const [s1, s2, s3] = buildSliceRegions(B, 'right', 3, 0)
      expect(s1.clipRect.w).toBeCloseTo(3 * bandW)
      expect(s2.clipRect.w).toBeCloseTo(2 * bandW)
      expect(s3.clipRect.w).toBeCloseTo(1 * bandW)
    })

    it('projection 1 left edge is flush with letter right (gap=0)', () => {
      const [s1] = buildSliceRegions(B, 'right', 3, 0)
      expect(s1.clipRect.x).toBeCloseTo(B.x + B.width)
    })

    it('projections stack with gap between them', () => {
      const GAP = 15
      const [s1, s2] = buildSliceRegions(B, 'right', 2, GAP)
      const distBetween = s2.clipRect.x - (s1.clipRect.x + s1.clipRect.w)
      expect(distBetween).toBeCloseTo(GAP)
    })
  })

  describe('sliceCount variants — correct count returned', () => {
    it.each([1, 2, 3] as const)('sliceCount=%i returns exactly %i projections', (n) => {
      expect(buildSliceRegions(B, 'up', n, 0)).toHaveLength(n)
      expect(buildSliceRegions(B, 'down', n, 0)).toHaveLength(n)
      expect(buildSliceRegions(B, 'left', n, 0)).toHaveLength(n)
      expect(buildSliceRegions(B, 'right', n, 0)).toHaveLength(n)
    })
  })

  describe('edge cases', () => {
    it('glyph with descender — no exception', () => {
      const deep: GlyphBounds = { x: 0, y: 50, width: 100, height: 240, ascent: 180, descent: 60 }
      expect(() => buildSliceRegions(deep, 'down', 3, 0)).not.toThrow()
      expect(() => buildSliceRegions(deep, 'up', 3, 0)).not.toThrow()
    })

    it('gap=0 and gap=100 both produce valid slices', () => {
      expect(() => buildSliceRegions(B, 'right', 3, 0)).not.toThrow()
      expect(() => buildSliceRegions(B, 'right', 3, 100)).not.toThrow()
    })
  })
})
