import type * as ptBRApp from './pt-br/app.json'
import type * as ptBRCommon from './pt-br/common.json'
import type * as ptBRHome from './pt-br/home.json'
import type * as ptBRInitialization from './pt-br/initialization.json'


export enum SupportedLanguages {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
}


export enum Namespaces {
  INITIALIZATION = 'initialization',
  COMMON = 'common',
  APP = 'app',
  HOME = 'home',
}


export type LanguagesToNamespacesMapType = {
  [language in SupportedLanguages]: {
    [namespace in Namespaces]: NamespacesToTranslationMapType[namespace]
  }
}


export type NamespacesToTranslationMapType = {
  [Namespaces.INITIALIZATION]: typeof ptBRInitialization
  [Namespaces.COMMON]: typeof ptBRCommon
  [Namespaces.HOME]: typeof ptBRHome
  [Namespaces.APP]: typeof ptBRApp
}


export type TranslationKeys<Namespace extends Namespaces> = (
  keyof NamespacesToTranslationMapType[Namespace] & string
)
