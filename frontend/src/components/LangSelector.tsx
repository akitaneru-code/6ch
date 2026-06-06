import { LangCode, translations } from '../i18n/translations'
import { useLang } from '../i18n/LangContext'
import './LangSelector.css'

const LANGS: LangCode[] = ['ko', 'en', 'yue', 'szeyup', 'br']

export default function LangSelector() {
  const { lang, setLang } = useLang()

  return (
    <div className="lang-selector">
      {LANGS.map((code) => (
        <button
          key={code}
          className={`lang-btn${lang === code ? ' active' : ''}`}
          onClick={() => setLang(code)}
          title={translations[code].langName}
        >
          {translations[code].langName}
        </button>
      ))}
    </div>
  )
}
