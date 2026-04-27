export type Direction = 'up' | 'down' | 'left' | 'right'

export type GlyphBounds = {
  x: number
  y: number
  width: number
  height: number
  ascent: number
  descent: number
}

export type SliceRegion = {
  index: number
  clipRect: { x: number; y: number; w: number; h: number }
  renderOffset: { dx: number; dy: number }
}

export type ExtensionConfig = {
  direction: Direction
  sliceCount: 1 | 2 | 3
  gap: number
  slices: SliceRegion[]
}

export type CharacterState = {
  char: string
  position: number
  bounds: GlyphBounds
  isSelected: boolean
  extension?: ExtensionConfig
}

export type FontStatus = 'idle' | 'loading' | 'ready' | 'error'

export type PopupPosition = { x: number; y: number }

export interface EngineStore {
  fontStatus: FontStatus
  opentypeFont: import('opentype.js').Font | null
  characters: CharacterState[]
  selectedIndex: number | null
  isDirty: boolean
  direction: Direction
  sliceCount: 1 | 2 | 3
  gap: number
  popupPosition: PopupPosition | null
  selectCharacter: (index: number | null) => void
  setDirection: (d: Direction) => void
  setSliceCount: (n: 1 | 2 | 3) => void
  setGap: (px: number) => void
  markDirty: () => void
  updateCharacters: (chars: CharacterState[]) => void
  setFontStatus: (status: FontStatus) => void
  setOpentypeFont: (font: import('opentype.js').Font | null) => void
  setPopupPosition: (pos: PopupPosition | null) => void
}
