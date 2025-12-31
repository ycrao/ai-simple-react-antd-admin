import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

interface LanguageState {
  language: string
  setLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'zh-CN',
      setLanguage: (lang: string) => {
        set({ language: lang })
        i18n.changeLanguage(lang)
      },
    }),
    {
      name: 'language-storage',
    }
  )
)