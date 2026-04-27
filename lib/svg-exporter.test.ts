import { describe, it, expect, vi } from 'vitest'
import { generateSVG } from './svg-exporter'
import type { EngineStore, CharacterState } from './types'

describe('SVG Exporter', () => {
  it('should generate a valid SVG string with correct transforms', () => {
    // Mock opentype font and glyph
    const mockPath = { toPathData: () => 'M 0 0 L 10 10' }
    const mockGlyph = { getPath: vi.fn().mockReturnValue(mockPath) }
    const mockFont = {
      charToGlyph: vi.fn().mockReturnValue(mockGlyph),
    }

    const characters: CharacterState[] = [
      {
        char: 'A',
        position: 0,
        bounds: { x: 10, y: 10, width: 50, height: 80, ascent: 60, descent: 20 },
        isSelected: false,
      },
    ]

    const store = {
      characters,
      opentypeFont: mockFont,
      transform: { scale: 2, offsetX: 100, offsetY: 200 },
    } as unknown as EngineStore

    const mockCtx = {
      measureText: vi.fn().mockReturnValue({ actualBoundingBoxLeft: 5 }),
    } as unknown as CanvasRenderingContext2D

    const svg = generateSVG(store, {}, mockCtx)

    expect(svg).toContain('<svg')
    expect(svg).toContain('width="1200"')
    expect(svg).toContain('height="800"')
    expect(svg).toContain('transform="scale(2) translate(100 200)"')
    expect(svg).toContain('d="M 0 0 L 10 10"')
    expect(mockFont.charToGlyph).toHaveBeenCalledWith('A')
    // x = bounds.x (10) + left (5) = 15
    expect(mockGlyph.getPath).toHaveBeenCalledWith(15, 0, 200)
  })

  it('should include clipPaths when characters have extensions', () => {
    const mockPath = { toPathData: () => 'M 0 0' }
    const mockGlyph = { getPath: vi.fn().mockReturnValue(mockPath) }
    const mockFont = {
      charToGlyph: vi.fn().mockReturnValue(mockGlyph),
    }

    const characters: CharacterState[] = [
      {
        char: 'B',
        position: 0,
        bounds: { x: 0, y: 0, width: 60, height: 60, ascent: 50, descent: 10 },
        isSelected: false,
        extension: {
          direction: 'right',
          sliceCount: 1,
          gap: 10,
          slices: [], // slices are re-built by buildSliceRegions in the exporter
        },
      },
    ]

    const store = {
      characters,
      opentypeFont: mockFont,
      transform: { scale: 1, offsetX: 0, offsetY: 0 },
    } as unknown as EngineStore

    const mockCtx = {
      measureText: vi.fn().mockReturnValue({ actualBoundingBoxLeft: 0 }),
    } as unknown as CanvasRenderingContext2D

    const svg = generateSVG(store, {}, mockCtx)

    expect(svg).toContain('<clipPath id="clip-0-0">')
    expect(svg).toContain('<rect x="70"') // bounds.x(0) + bounds.width(60) + gap(10) = 70
    expect(svg).toContain('clip-path="url(#clip-0-0)"')
  })
})
