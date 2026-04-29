'use client'

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEngineStore } from '@/lib/store'
import type { Direction, SlicePreset } from '@/lib/types'

const SLICE_PRESETS: SlicePreset[] = [3, 4, 6]

const DIRECTIONS: { value: Direction; icon: React.ReactNode; label: string }[] = [
  { value: 'up', icon: <ArrowUp size={16} />, label: 'Haut' },
  { value: 'down', icon: <ArrowDown size={16} />, label: 'Bas' },
  { value: 'left', icon: <ArrowLeft size={16} />, label: 'Gauche' },
  { value: 'right', icon: <ArrowRight size={16} />, label: 'Droite' },
]

export default function DirectionPicker() {
  const popupPosition = useEngineStore((s) => s.popupPosition)
  const selectedIndex = useEngineStore((s) => s.selectedIndex)
  const characters = useEngineStore((s) => s.characters)
  const slicePreset = useEngineStore((s) => s.slicePreset)
  const setDirection = useEngineStore((s) => s.setDirection)
  const setSliceCount = useEngineStore((s) => s.setSliceCount)
  const setSlicePreset = useEngineStore((s) => s.setSlicePreset)
  const setGap = useEngineStore((s) => s.setGap)
  const setPopupPosition = useEngineStore((s) => s.setPopupPosition)
  const selectCharacter = useEngineStore((s) => s.selectCharacter)

  if (!popupPosition || selectedIndex === null) return null

  const ext = characters[selectedIndex]?.extension
  const currentDirection = ext?.direction ?? ''
  const currentSliceCount = ext?.sliceCount ?? 3
  const currentGap = ext?.gap ?? 10

  const handleDirection = (value: string) => {
    if (!value) return
    setDirection(value as Direction)
    setPopupPosition(null)
  }

  const handleSliceCount = (value: number[]) => {
    const n = value[0] as 1 | 2 | 3 | 4 | 5 | 6
    setSliceCount(n)
  }

  const handleSlicePreset = (p: SlicePreset) => {
    setSlicePreset(p)
  }

  const handleGap = (value: number[]) => {
    setGap(value[0])
  }

  const handleBackdrop = () => {
    selectCharacter(null)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={handleBackdrop} />
      <Card
        className="fixed z-50 flex flex-col gap-3 p-3 shadow-lg"
        style={{ left: popupPosition.x + 12, top: popupPosition.y + 12, minWidth: 180 }}
      >
        <ToggleGroup
          type="single"
          value={currentDirection}
          onValueChange={handleDirection}
        >
          {DIRECTIONS.map(({ value, icon, label }) => (
            <ToggleGroupItem key={value} value={value} aria-label={label}>
              {icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {ext?.direction && (
          <>
            <Separator />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Tranches</span>
                <span className="text-xs font-medium">{currentSliceCount}</span>
              </div>
              <div className="flex gap-1">
                {SLICE_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSlicePreset(p)}
                    className={`flex-1 rounded px-2 py-0.5 text-xs transition-colors ${
                      slicePreset === p
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Slider
                min={1}
                max={slicePreset}
                step={1}
                value={[currentSliceCount]}
                onValueChange={handleSliceCount}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Gap</span>
                <span className="text-xs font-medium">{currentGap}px</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[currentGap]}
                onValueChange={handleGap}
              />
            </div>
          </>
        )}
      </Card>
    </>
  )
}
