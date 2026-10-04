import type { TextStyle, ViewStyle } from 'react-native'
import { Linking, ScrollView, View, useWindowDimensions } from 'react-native'
import { Button, Text } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'
import { useAppTheme } from '@theme'
import { CAMERA_HEADER_HEIGHT } from '../CameraHeader'
import { styles } from './no-permission-message.styles.ts'


interface NoPermissionMessageProps {
  cameraControlHeight: number
  requestCameraPermission: () => Promise<void>
  style?: ViewStyle
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {
  const { cameraControlHeight, requestCameraPermission, style } = props


  const { height } = useWindowDimensions()

  const { t } = useLocale()
  const { colors, typography } = useAppTheme()


  const scrollScreenStyle: ViewStyle = {
    ...style,
    marginTop: CAMERA_HEADER_HEIGHT,
    marginBottom: cameraControlHeight,
  }

  const scrollScreenContentContainerStyle: ViewStyle = {
    minHeight: height - CAMERA_HEADER_HEIGHT - cameraControlHeight,
  }

  const messageTitle: TextStyle = {
    ...styles.messageTitle,
    ...typography.title.large,
    color: colors.onBackground,
  }

  const messageText: TextStyle = {
    ...styles.messageText,
    ...typography.body.large,
    color: colors.onBackground,
  }


  return (
    <ScrollView
      style={scrollScreenStyle}
      contentContainerStyle={scrollScreenContentContainerStyle}
    >
      <View style={styles.textContainer}>
        <Text variant={'titleLarge'} style={messageTitle}>
          {t('Camera_noPermission', { ns: Namespaces.APP })}
        </Text>

        <Text variant={'bodyLarge'} style={messageText}>
          &bull; {t(
            'Camera_allowCameraWithGrantPermission',
            { ns: Namespaces.APP },
          )}
        </Text>

        <Text variant={'bodyLarge'} style={messageText}>
          &bull; {t(
            'Camera_allowCameraThroughSettings',
            { ns: Namespaces.APP },
          )}
        </Text>

        <Text variant={'bodyLarge'} style={messageText}>
          &bull; {t(
            'Camera_enableCamera',
            { ns: Namespaces.APP },
          )}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode={'outlined'}
          children={t('Camera_openSettings', { ns: Namespaces.APP })}
          onPress={Linking.openSettings}
          style={{ width: '100%' }}
        />

        <Button
          mode={'contained'}
          children={t('Camera_grantPermission', { ns: Namespaces.APP })}
          onPress={requestCameraPermission}
          style={{ width: '100%' }}
        />
      </View>
    </ScrollView>
  )
}
