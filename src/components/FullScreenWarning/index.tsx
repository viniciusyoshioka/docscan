import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppTheme } from '@theme'


interface FullScreenWarningProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>
  scrollViewStyle?: StyleProp<ViewStyle>
}


export function FullScreenWarning(props: FullScreenWarningProps) {


  const { colors } = useAppTheme()


  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colors.background,
        },
        props.style,
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          {
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: '100%',
            padding: 16,
          },
          props.scrollViewStyle,
        ]}
      >
        {props.children}
      </ScrollView>
    </SafeAreaView>
  )
}
