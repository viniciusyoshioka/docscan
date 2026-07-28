import { resources } from '../locale.resources.ts'
import { Namespaces, SupportedLanguages } from '../locale.types.ts'


type MissingTranslationKeys = {
  [key in Namespaces]: Set<string>
}


function getMissingTranslationKeys(): MissingTranslationKeys {
  const referenceLanguage = SupportedLanguages.PT_BR

  const languages = Object.values(SupportedLanguages)
  const namespaces = Object.values(Namespaces)

  const missingKeys: MissingTranslationKeys = {
    [Namespaces.APP]: new Set<string>(),
    [Namespaces.COMMON]: new Set<string>(),
    [Namespaces.HOME]: new Set<string>(),
    [Namespaces.INITIALIZATION]: new Set<string>(),
  }


  for (const language of languages) {
    if (language === referenceLanguage) {
      continue
    }

    for (const namespace of namespaces) {
      const referenceKeys = Object.keys(resources[referenceLanguage][namespace])
      const currentKeys = Object.keys(resources[language][namespace])

      referenceKeys
        .filter(key => !currentKeys.includes(key))
        .forEach(key => missingKeys[namespace].add(key))

      currentKeys
        .filter(key => !referenceKeys.includes(key))
        .forEach(key => missingKeys[namespace].add(key))
    }
  }


  return missingKeys
}


export function printMissingTranslationKeys(): void {
  const missingTranslationKeys = getMissingTranslationKeys()

  const namespaces = Object.keys(missingTranslationKeys) as Namespaces[]
  namespaces.forEach(namespace => {
    const hasMissingTranslationKeys = !!missingTranslationKeys[namespace].size
    if (!hasMissingTranslationKeys) return

    const formattedMissingTranslationKeys = Array
      .from(missingTranslationKeys[namespace])
      .join(', ')

    console.warn(`[i18n] Missing translation keys in namespace "${namespace}": ${formattedMissingTranslationKeys}`)
  })
}
