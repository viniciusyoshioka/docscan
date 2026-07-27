import { Text } from 'react-native-paper'

import { FullScreenWarning } from '@components'
import { useHideSplashscreen } from '@hooks'


interface LocaleInitializationError {
  error: Error
}


export function LocaleInitializationError(props: LocaleInitializationError) {


  useHideSplashscreen()


  console.error('Error initializing locale module:', props.error)


  return (
    <FullScreenWarning>
      <Text
        variant={'bodyLarge'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        Error loading translations
      </Text>

      <Text variant={'bodyMedium'}>
        An unexpected error occurred when loading translations
      </Text>
    </FullScreenWarning>
  )
}
