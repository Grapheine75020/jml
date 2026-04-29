import { create } from 'zustand'
import type { Font } from 'opentype.js'
import type {
  CharacterState,
  Direction,
  EngineStore,
  FontStatus,
  PopupPosition,
  SlicePreset,
} from './types'

function updateSelectedExtension(
  state: { characters: CharacterState[]; selectedIndex: number | null },
  patch: Partial<{ direction: Direction; sliceCount: 1 | 2 | 3 | 4 | 5 | 6; gap: number }>,
): CharacterState[] {
  if (state.selectedIndex === null) return state.characters
  return state.characters.map((c, i) => {
    if (i !== state.selectedIndex || !c.extension) return c
    return { ...c, extension: { ...c.extension, ...patch } }
  })
}

export const useEngineStore = create<EngineStore>()((set) => ({
  fontStatus: 'idle',
  opentypeFont: null,
  characters: [],
  selectedIndex: null,
  isDirty: false,
  direction: 'right',
  sliceCount: 3,
  slicePreset: 3,
  gap: 10,
  popupPosition: null,
  transform: { scale: 1, offsetX: 0, offsetY: 0 },

  selectCharacter: (index) =>
    set(
      index === null
        ? { selectedIndex: null, isDirty: true, popupPosition: null }
        : { selectedIndex: index, isDirty: true },
    ),

  setDirection: (d: Direction) =>
    set((state) => {
      if (state.selectedIndex === null) return { direction: d, isDirty: true }
      const characters = state.characters.map((c, i) =>
        i === state.selectedIndex
          ? {
              ...c,
              extension: {
                direction: d,
                sliceCount: c.extension?.sliceCount ?? state.sliceCount,
                gap: c.extension?.gap ?? state.gap,
                slices: [],
              },
            }
          : c,
      )
      return { direction: d, isDirty: true, characters }
    }),

  setSliceCount: (n: 1 | 2 | 3 | 4 | 5 | 6) =>
    set((state) => ({
      sliceCount: n,
      isDirty: true,
      characters: updateSelectedExtension(state, { sliceCount: n }),
    })),

  setSlicePreset: (p: SlicePreset) =>
    set((state) => {
      const clampedSlice = Math.min(state.sliceCount, p) as 1 | 2 | 3 | 4 | 5 | 6
      const characters = clampedSlice !== state.sliceCount
        ? updateSelectedExtension(state, { sliceCount: clampedSlice })
        : state.characters
      return {
        slicePreset: p,
        sliceCount: clampedSlice,
        isDirty: true,
        characters,
      }
    }),

  setGap: (px: number) =>
    set((state) => ({
      gap: px,
      isDirty: true,
      characters: updateSelectedExtension(state, { gap: px }),
    })),

  markDirty: () =>
    set({ isDirty: true }),

  updateCharacters: (chars: CharacterState[]) =>
    set({ characters: chars, isDirty: false }),

  setTransform: (t) =>
    set({ transform: t }),

  setFontStatus: (status: FontStatus) =>
    set({ fontStatus: status }),

  setOpentypeFont: (font: Font | null) =>
    set({ opentypeFont: font }),

  setPopupPosition: (pos: PopupPosition | null) =>
    set({ popupPosition: pos }),
}))
