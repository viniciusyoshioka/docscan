import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Locale } from './locale.ts'
import { locale } from './locale.ts'
import type { SupportedLanguages } from './locale.types.ts'


export function useLocale(): Locale {


  const { t, i18n } = useTranslation()


  return useMemo<Locale>(() => {
    const currentLanguage = i18n.language as SupportedLanguages

    const changeLanguage = async (newLanguage: SupportedLanguages) => {
      await i18n.changeLanguage(newLanguage)
    }

    return {
      fallbackLanguage: locale.fallbackLanguage,
      deviceLanguage: locale.deviceLanguage,
      currentLanguage,
      changeLanguage,
      t,
    }
  }, [t, i18n])
}
