'use client'

import { useFontLoader } from '@/hooks/useFontLoader'
import { useEngineStore } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

export default function FontLoader({ children }: { children: React.ReactNode }) {
  useFontLoader()

  const fontStatus = useEngineStore((s) => s.fontStatus)

  if (fontStatus === 'loading' || fontStatus === 'idle') {
    return (
      <div className="flex min-h-svh items-center justify-center gap-3">
        <Spinner />
        <span className="text-muted-foreground text-sm">
          Chargement de la police…
        </span>
      </div>
    )
  }

  if (fontStatus === 'error') {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Police introuvable</AlertTitle>
          <AlertDescription>
            Impossible de charger Libre Franklin Medium. Vérifiez que le fichier{' '}
            <code>/public/fonts/LibreFranklin-Medium.ttf</code> est présent et
            rechargez la page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
