'use client'

import { useEffect } from 'react'
import { loadFont } from '@/lib/font-loader'
import { useEngineStore } from '@/lib/store'

export function useFontLoader() {
  const setFontStatus = useEngineStore((s) => s.setFontStatus)
  const setOpentypeFont = useEngineStore((s) => s.setOpentypeFont)
  const fontStatus = useEngineStore((s) => s.fontStatus)

  useEffect(() => {
    if (fontStatus !== 'idle') return

    setFontStatus('loading')

    loadFont().then((result) => {
      if (result.ok) {
        setOpentypeFont(result.font)
        setFontStatus('ready')
      } else {
        setFontStatus('error')
      }
    })
  }, [fontStatus, setFontStatus, setOpentypeFont])
}
