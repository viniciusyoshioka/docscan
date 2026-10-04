import type { ViewStyle } from 'react-native'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { useAppTheme } from '@theme'


interface CheckingOrRequestingCameraPermissionProps {
  style?: ViewStyle
}


export function CheckingOrRequestingCameraPermission(
  props: CheckingOrRequestingCameraPermissionProps,
) {
  const { style } = props


  const { colors } = useAppTheme()


  return (
    <View
      style={{
        ...style,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator
        size={'large'}
        color={colors.primary}
      />
    </View>
  )
}
