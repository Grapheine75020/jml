import type { Font } from 'opentype.js'
import { CANVAS_FONT, CANVAS_FONT_SIZE } from './constants'
import { populateGlyphCache } from './glyph-cache'

const FONT_URL = '/fonts/LibreFranklin-Medium.ttf'

export type LoadFontResult =
  | { ok: true; font: Font }
  | { ok: false; error: string }

export async function loadFont(): Promise<LoadFontResult> {
  try {
    const fontFace = new FontFace('Libre Franklin', `url(${FONT_URL})`, {
      weight: '500',
      style: 'normal',
    })
    await fontFace.load()
    document.fonts.add(fontFace)

    const opentype = await import('opentype.js')
    const response = await fetch(FONT_URL)
    const buffer = await response.arrayBuffer()
    const font = opentype.parse(buffer)

    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = CANVAS_FONT_SIZE * 2
    const ctx = canvas.getContext('2d')!
    ctx.font = CANVAS_FONT
    populateGlyphCache(ctx)

    return { ok: true, font }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue',
    }
  }
}
