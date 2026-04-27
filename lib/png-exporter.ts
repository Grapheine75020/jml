import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
import type { EngineStore } from './types'
import { drawOnContext } from './renderer-utils'

/**
 * Exports the current composition to a high-resolution PNG file.
 * Target resolution is 300dpi (assuming 1200px is ~4 inches).
 */
export function exportToPNG(store: EngineStore) {
  const { characters, transform } = store

  // 300dpi scaling factor (approx 4x from standard 72/96dpi)
  const EXPORT_SCALE = 4
  const width = CANVAS_WIDTH * EXPORT_SCALE
  const height = CANVAS_HEIGHT * EXPORT_SCALE

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Draw composition without selection highlight
  drawOnContext(ctx, characters, transform, {
    showSelection: false,
    width,
    height,
    exportScale: EXPORT_SCALE,
  })

  // Export to blob and download
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jml-export-${new Date().getTime()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png')
}
