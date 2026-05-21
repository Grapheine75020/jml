'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/i18n/LangContext'

export default function FloatingNav() {
  const { lang, setLang, t } = useLang()

  return (
    <nav aria-label={t('nav.graphicTool')} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {/* Logo + label — cliquable, retour à l'outil */}
      <Link
        href="/"
        className="h-12 px-3 rounded-4xl border border-border bg-background/80 backdrop-blur-md shadow-sm flex items-center gap-2 shrink-0"
      >
        {/* Logo noir (light) */}
        <Image
          src="/logo-jml/SVG/Logo_JMLlogo-noir.svg"
          alt="JML"
          width={32}
          height={32}
          unoptimized
          className="dark:hidden"
        />
        {/* Logo blanc (dark) */}
        <Image
          src="/logo-jml/SVG/Logo_JMLlogo-blanc.svg"
          alt="JML"
          width={32}
          height={32}
          unoptimized
          className="hidden dark:block"
        />
        <span className="text-sm text-muted-foreground font-medium select-none">
          {t('nav.graphicTool')}
        </span>
      </Link>

      {/* À propos + toggle langue */}
      <div className="flex items-center h-12 px-2 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-sm">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">{t('nav.about')}</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="text-xs font-medium text-muted-foreground"
          aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </Button>
      </div>
    </nav>
  )
}
