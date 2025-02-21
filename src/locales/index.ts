import { I18n } from "i18n-js"

import { pt_BR } from "./pt_BR"
import { TranslationKeyType } from "./types"


export * from "./types"


type LanguageCodeNormalization = {
  [key in string]: string
}

const normalizedLanguageCode: LanguageCodeNormalization = {
  en: "en_US",
  en_US: "en_US",
  pt_BR: "pt_BR",
  pt_US: "pt_BR",
}


export const i18n = new I18n({
  pt_BR: pt_BR,
})


function getDeviceLanguage(): string {
  return normalizedLanguageCode["pt_BR"]
}


function setLanguageToI18n() {
  const deviceLanguage = getDeviceLanguage()
  const allSupportedLanguages = Object.keys(i18n.translations)

  const isLanguageSupported = allSupportedLanguages.includes(deviceLanguage)
  if (isLanguageSupported) {
    i18n.locale = deviceLanguage
  } else {
    i18n.defaultLocale = "pt_BR"
  }
}


setLanguageToI18n()


export const translate = (key: TranslationKeyType): string => i18n.t(key)
