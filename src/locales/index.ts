/* eslint-disable camelcase */
import { I18n } from "i18n-js"
import { NativeModules, Platform } from "react-native"

import { TranslationKeyType } from "../types"
import { en_US } from "./en_US"
import { pt_BR } from "./pt_BR"


const normalizeLanguageCode = {
    "en": "en_US",
    "en_US": "en_US",
    "pt_BR": "pt_BR",
    "pt_US": "pt_BR",
}


const i18n = new I18n()
i18n.translations = {
    "en_US": en_US,
    "pt_BR": pt_BR,
}


function getDeviceLanguage(): string {
    switch (Platform.OS) {
        case "android":
            return normalizeLanguageCode[NativeModules.I18nManager.localeIdentifier]
        case "ios":
            return normalizeLanguageCode[NativeModules.SettingsManager.settings.AppleLocale]
        default:
            throw new Error("Only Android and iOS are supported.")
    }
}


function setLanguageToI18n() {
    const deviceLanguage = getDeviceLanguage()
    const allSupportedLanguages = Object.keys(i18n.translations)

    const isLanguageSupported = allSupportedLanguages.includes(deviceLanguage)
    isLanguageSupported
        ? i18n.locale = deviceLanguage
        : i18n.defaultLocale = "en_US"
}


setLanguageToI18n()


/**
 * Receives a key and returns the corresponding text
 * already translated to device language, if available
 *
 * @param key TranslationKeyType to get the translation in language object
 *
 * @returns translated text
 */
export const translate = (key: TranslationKeyType): string => i18n.t(key)
