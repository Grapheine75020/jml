'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLang } from '@/lib/i18n/LangContext'

// < 768px = phones only; 768px is Tailwind's md breakpoint (tablets pass through)
const PHONE_MAX_WIDTH = 768

export default function MobileWarning({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  const [state, setState] = useState({ isPhone: false, checked: false })

  useEffect(() => {
    const check = () =>
      setState({ isPhone: window.innerWidth < PHONE_MAX_WIDTH, checked: true })
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!state.checked) return null

  if (state.isPhone) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>{t('mobile.title')}</AlertTitle>
          <AlertDescription>{t('mobile.description')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
