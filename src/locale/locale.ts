import i18next from 'i18next'
import { getLocales } from 'react-native-localize'

import type { TranslationKeys } from './locale.types.ts'
import { Namespaces, SupportedLanguages } from './locale.types.ts'


export class Locale {


  get fallbackLanguage(): SupportedLanguages {
    return SupportedLanguages.EN_US
  }

  get deviceLanguage(): string {
    const deviceLanguages = getLocales()
    const preferredLanguage = deviceLanguages.at(0)

    if (preferredLanguage) {
      return preferredLanguage.languageTag
    }
    return this.fallbackLanguage
  }

  get currentLanguage(): SupportedLanguages {
    return i18next.language as SupportedLanguages
  }


  async changeLanguage(language: SupportedLanguages): Promise<void> {
    await i18next.changeLanguage(language)
  }


  t<Namespace extends Namespaces = Namespaces.COMMON>(
    key: TranslationKeys<Namespace>,
    options?: {
      ns: Namespace
    },
  ): string {
    const { ns = Namespaces.COMMON } = options ?? {}

    return i18next.t(key, {
      ns,
    })
  }
}


export const locale = new Locale()
