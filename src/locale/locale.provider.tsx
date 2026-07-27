import i18next from 'i18next'
import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'

import { normalizeError } from '@utils'
import { LocaleInitializationError } from './components'
import { resources } from './locale.resources.ts'
import { locale } from './locale.ts'
import { Namespaces, SupportedLanguages } from './locale.types.ts'
import { printMissingTranslationKeys } from './utils'


interface LocaleProviderProps extends PropsWithChildren {}


export function LocaleProvider(props: LocaleProviderProps) {


  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)


  const initialize = useCallback(async () => {
    await i18next
      .use(initReactI18next)
      .init(
        {
          lng: locale.deviceLanguage,
          fallbackLng: SupportedLanguages.EN_US,
          defaultNS: Namespaces.COMMON,
          ns: Object.values(Namespaces),
          resources,
          debug: __DEV__,
          interpolation: {
            escapeValue: false,
          },
        },
        error => {
          if (error) {
            const errorInstance = normalizeError(error)
            setIsLoading(false)
            setError(errorInstance)
          } else {
            setIsLoading(false)
          }
        },
      )
  }, [])


  useEffect(() => {
    if (__DEV__) {
      printMissingTranslationKeys()
    }

    initialize()
  }, [])


  if (isLoading) {
    return null
  }

  if (error) {
    return <LocaleInitializationError error={error} />
  }

  return (
    <>
      {props.children}
    </>
  )
}
