'use client'

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEngineStore } from '@/lib/store'
import type { Direction } from '@/lib/types'
import { useLang } from '@/lib/i18n/LangContext'

const DIRECTION_VALUES: { value: Direction; icon: React.ReactNode }[] = [
  { value: 'up', icon: <ArrowUp size={16} /> },
  { value: 'down', icon: <ArrowDown size={16} /> },
  { value: 'left', icon: <ArrowLeft size={16} /> },
  { value: 'right', icon: <ArrowRight size={16} /> },
]

export default function DirectionPicker() {
  const { t } = useLang()
  const popupPosition = useEngineStore((s) => s.popupPosition)
  const selectedIndex = useEngineStore((s) => s.selectedIndex)
  const characters = useEngineStore((s) => s.characters)
  const toggleDirection = useEngineStore((s) => s.toggleDirection)
  const setSliceCount = useEngineStore((s) => s.setSliceCount)
  const setPopupPosition = useEngineStore((s) => s.setPopupPosition)
  const selectCharacter = useEngineStore((s) => s.selectCharacter)

  if (!popupPosition || selectedIndex === null) return null

  const ext = characters[selectedIndex]?.extension
  const currentDirections = ext?.directions ?? []
  const currentSliceCount = ext?.sliceCount ?? 3

  const handleDirection = (values: string[]) => {
    const prev = new Set(currentDirections)
    const next = new Set(values as Direction[])
    const toggled =
      [...next].find((d) => !prev.has(d)) ?? [...prev].find((d) => !next.has(d))
    if (toggled) toggleDirection(toggled as Direction)
  }

  const handleSliceCount = (value: number[]) => {
    const n = value[0] as 1 | 2 | 3 | 4 | 5 | 6
    setSliceCount(n)
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
          type="multiple"
          value={currentDirections}
          onValueChange={handleDirection}
        >
          {DIRECTION_VALUES.map(({ value, icon }) => (
            <ToggleGroupItem key={value} value={value} aria-label={t(`direction.${value}` as `direction.${Direction}`)}>
              {icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {currentDirections.length > 0 && (
          <>
            <Separator />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">{t('direction.slices')}</span>
                <span className="text-xs font-medium">{currentSliceCount}</span>
              </div>
              <Slider
                min={1}
                max={6}
                step={1}
                value={[currentSliceCount]}
                onValueChange={handleSliceCount}
              />
            </div>

          </>
        )}
      </Card>
    </>
  )
}
