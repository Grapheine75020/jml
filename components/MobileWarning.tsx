'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const DESKTOP_MIN_WIDTH = 1280

export default function MobileWarning({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < DESKTOP_MIN_WIDTH)
    check()
    setChecked(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!checked) return null

  if (isMobile) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Outil non disponible sur mobile</AlertTitle>
          <AlertDescription>
            JML Graphic Haikus est conçu pour desktop. Merci d&apos;utiliser
            Chrome, Safari ou Edge sur un écran d&apos;au moins 1280px de large.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
