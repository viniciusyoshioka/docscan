import type { Namespaces, NamespacesToTranslationMapType } from '../locale.types.ts'


declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: Namespaces.COMMON
    resources: NamespacesToTranslationMapType[Namespaces]
  }
}
