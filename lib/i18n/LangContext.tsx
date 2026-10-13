'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import fr from './fr.json'
import en from './en.json'

export type Lang = 'fr' | 'en'
export type TranslationKey = keyof typeof fr

const translations: Record<Lang, typeof fr> = { fr, en }

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jml-lang')
      // Lecture après hydratation pour éviter un mismatch SSR
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'fr' || saved === 'en') setLangState(saved)
    } catch {
      // localStorage inaccessible — conserver FR par défaut
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('jml-lang', l)
    } catch {
      // localStorage inaccessible — changement de langue en mémoire seulement
    }
  }

  const t = (key: TranslationKey): string =>
    (translations[lang] as Record<string, string>)[key] ??
    (translations.fr as Record<string, string>)[key] ??
    key

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
