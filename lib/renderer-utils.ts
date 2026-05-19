import { CANVAS_FONT, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
import type { CharacterState } from './types'
import { buildSliceRegions } from './slice-engine'

/**
 * Shared drawing logic for the main renderer and the PNG exporter.
 */
export function drawOnContext(
  ctx: CanvasRenderingContext2D,
  characters: CharacterState[],
  transform: { scale: number; offsetX: number; offsetY: number },
  options: {
    showSelection?: boolean
    width?: number
    height?: number
    exportScale?: number
    isDark?: boolean
    forceTextColor?: string
  } = {},
) {
  const { scale, offsetX, offsetY } = transform
  const {
    showSelection = false,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
    exportScale = 1,
    isDark = false,
    forceTextColor,
  } = options

  const textColor = forceTextColor ?? (isDark ? '#ffffff' : '#000000')

  ctx.save()
  ctx.clearRect(0, 0, width, height)

  if (isDark) {
    ctx.fillStyle = '#09090b'
    ctx.fillRect(0, 0, width, height)
  }

  // Apply export scale if any (for high res)
  if (exportScale !== 1) {
    ctx.scale(exportScale, exportScale)
  }

  // Apply composition scale and translation
  ctx.scale(scale, scale)
  ctx.translate(offsetX, offsetY)

  // Set font once before any measureText calls — required so that char 0
  // is measured with the correct font (not whatever was active before this call).
  ctx.font = CANVAS_FONT

  // 1. Draw base characters
  characters.forEach((c) => {
    // Recompute baseline X from bounds
    const m = ctx.measureText(c.char)
    const x = c.bounds.x + m.actualBoundingBoxLeft
    const y = 0

    if (showSelection && c.isSelected) {
      ctx.save()
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 2 / scale
      ctx.strokeRect(
        c.bounds.x - 3,
        c.bounds.y - 3,
        c.bounds.width + 6,
        c.bounds.height + 6,
      )
      ctx.restore()
    }

    ctx.fillStyle = textColor
    ctx.fillText(c.char, x, y)
  })

  // 2. Draw extensions (slices)
  characters.forEach((c) => {
    const ext = c.extension
    if (!ext?.directions?.length) return

    const m = ctx.measureText(c.char)
    const x = c.bounds.x + m.actualBoundingBoxLeft

    for (const dir of ext.directions) {
      const slices = buildSliceRegions(c.bounds, dir, ext.sliceCount, ext.gap)
      for (const slice of slices) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(slice.clipRect.x, slice.clipRect.y, slice.clipRect.w, slice.clipRect.h)
        ctx.clip()
        ctx.fillStyle = textColor
        ctx.font = CANVAS_FONT
        ctx.fillText(c.char, x + slice.renderOffset.dx, slice.renderOffset.dy)
        ctx.restore()
      }
    }
  })

  ctx.restore()
}
