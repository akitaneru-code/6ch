import { createContext, useContext, useState, ReactNode } from 'react'
import { LangCode, Translations, translations } from './translations'

interface LangContextValue {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: Translations
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('ko')

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
