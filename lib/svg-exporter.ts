import { CANVAS_FONT, CANVAS_FONT_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
import type { CharacterState, EngineStore } from './types'
import { buildSliceRegions } from './slice-engine'

/**
 * Generates the SVG string for the current composition.
 * Separated from DOM logic for testability.
 */
export function generateSVG(
  store: EngineStore,
  opentype: any,
  ctx: CanvasRenderingContext2D,
): string {
  const { characters, opentypeFont, transform } = store
  if (!opentypeFont) return ''

  const { scale, offsetX, offsetY } = transform
  const fontSize = CANVAS_FONT_SIZE

  let svgContent = `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">\n`

  // 1. Definitions for clipping
  svgContent += '  <defs>\n'
  characters.forEach((charState, i) => {
    const { extension, bounds } = charState
    if (extension?.direction) {
      const slices = buildSliceRegions(
        bounds,
        extension.direction,
        extension.sliceCount,
        extension.gap,
      )
      slices.forEach((slice, j) => {
        svgContent += `    <clipPath id="clip-${i}-${j}">\n`
        svgContent += `      <rect x="${slice.clipRect.x}" y="${slice.clipRect.y}" width="${slice.clipRect.w}" height="${slice.clipRect.h}" />\n`
        svgContent += `    </clipPath>\n`
      })
    }
  })
  svgContent += '  </defs>\n'

  // 2. Characters group with global transform
  svgContent += `  <g transform="scale(${scale}) translate(${offsetX} ${offsetY})">\n`

  characters.forEach((charState, i) => {
    const { char, bounds, extension } = charState
    const m = ctx.measureText(char)
    const x = bounds.x + m.actualBoundingBoxLeft
    const y = 0

    const glyph = opentypeFont.charToGlyph(char)
    const pathData = glyph.getPath(x, y, fontSize).toPathData(2)

    svgContent += `    <path d="${pathData}" fill="black" />\n`

    if (extension?.direction) {
      const slices = buildSliceRegions(
        bounds,
        extension.direction,
        extension.sliceCount,
        extension.gap,
      )
      slices.forEach((slice, j) => {
        const sliceX = x + slice.renderOffset.dx
        const sliceY = y + slice.renderOffset.dy
        const slicePathData = glyph.getPath(sliceX, sliceY, fontSize).toPathData(2)
        svgContent += `    <path d="${slicePathData}" fill="black" clip-path="url(#clip-${i}-${j})" />\n`
      })
    }
  })

  svgContent += '  </g>\n'
  svgContent += '</svg>'

  return svgContent
}

/**
 * Exports the current composition to a vector SVG file.
 */
export async function exportToSVG(store: EngineStore) {
  const { opentypeFont } = store
  if (!opentypeFont) {
    console.error('Font not loaded for SVG export')
    return
  }

  const opentype = await import('opentype.js')

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.font = CANVAS_FONT

  const svgContent = generateSVG(store, opentype, ctx)

  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jml-export-${new Date().getTime()}.svg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
