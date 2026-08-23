import type { TextStyle, ViewStyle } from 'react-native'
import { Linking, ScrollView, useWindowDimensions, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Namespaces, useLocale } from '@locale'
import { useAppTheme } from '@theme'
import { GALLERY_HEADER_HEIGHT } from '../../../../gallery.constants.ts'
import { useRequestReadStoragePermission } from '../../hooks'
import { styles } from './styles.ts'


interface NoImagesListPermissionProps {}


export function NoImagesListPermission(props: NoImagesListPermissionProps) {


  const { height } = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()
  const { colors, typography } = useAppTheme()

  const requestReadStoragePermission = useRequestReadStoragePermission()


  const scrollScreenContentContainerStyle: ViewStyle = {
    minHeight: height - GALLERY_HEADER_HEIGHT,
    paddingLeft: safeAreaInsets.left,
    paddingRight: safeAreaInsets.right,
  }

  const permissionMessageTitleStyle: TextStyle = {
    ...styles.permissionMessageTitle,
    color: colors.onBackground,
    ...typography.title.large,
  }

  const permissionMessageDescriptionStyle: TextStyle = {
    ...styles.permissionMessageDescription,
    color: colors.onBackground,
    ...typography.body.large,
  }

  const permissionMessageTopicStyle: TextStyle = {
    ...styles.permissionMessageTopic,
    color: colors.onBackground,
    ...typography.body.large,
  }


  return (
    <ScrollView contentContainerStyle={scrollScreenContentContainerStyle}>
      <View style={styles.textContainer}>
        <Text variant={'titleLarge'} style={permissionMessageTitleStyle}>
          {t(
            'Gallery_noPermission',
            { ns: Namespaces.APP },
          )}
        </Text>

        <Text variant={'bodyLarge'} style={permissionMessageDescriptionStyle}>
          {t(
            'Gallery_photoAccessPermissionDescription',
            { ns: Namespaces.APP },
          )}
        </Text>

        <Text variant={'bodyLarge'} style={permissionMessageTopicStyle}>
          &bull; {t(
            'Gallery_allowPhotoAccessWithGrantPermission',
            { ns: Namespaces.APP },
          )}
        </Text>

        <Text variant={'bodyLarge'} style={permissionMessageTopicStyle}>
          &bull; {t(
            'Gallery_allowPhotoAccessThroughSettings',
            { ns: Namespaces.APP },
          )}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button mode={'outlined'} onPress={Linking.openSettings}>
          {t(
            'Gallery_openSettings',
            { ns: Namespaces.APP },
          )}
        </Button>

        <Button mode={'contained'} onPress={requestReadStoragePermission}>
          {t(
            'Gallery_grantPermission',
            { ns: Namespaces.APP },
          )}
        </Button>
      </View>
    </ScrollView>
  )
}
