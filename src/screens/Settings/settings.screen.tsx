import type { ViewStyle } from 'react-native'
import { ScrollView, View } from 'react-native'
import { List } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header } from '@components'
import { useBackHandler } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { Info } from '@modules/info'
import {
  useGoBack,
  useOpenChangeThemeModal,
  useShareAppDatabase,
  useShareLogDatabase,
} from './hooks'


const APP_NAME_AND_VERSION = `${Info.app.name} ${Info.app.version}`


export function Settings() {


  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()

  const goBack = useGoBack()
  const openChangeThemeModal = useOpenChangeThemeModal()
  const shareAppDatabase = useShareAppDatabase()
  const shareLogDatabase = useShareLogDatabase()


  useBackHandler(goBack)


  const listItemStyle: ViewStyle = {
    paddingLeft: 16 + safeAreaInsets.left,
    paddingRight: safeAreaInsets.right,
  }


  return (
    <View style={{ flex: 1 }}>
      <Header
        onGoBack={goBack}
        title={t('Settings_header_title', { ns: Namespaces.APP })}
      />

      <ScrollView>
        <List.Item
          left={() => <List.Icon icon={'brightness-4'} />}
          title={t('Settings_theme_title', { ns: Namespaces.APP })}
          description={t('Settings_theme_text', { ns: Namespaces.APP })}
          onPress={openChangeThemeModal}
          style={listItemStyle}
        />

        <List.Item
          left={() => <List.Icon icon={'database-export-outline'} />}
          title={t('Settings_shareLogDatabase_title', { ns: Namespaces.APP })}
          description={t('Settings_shareLogDatabase_text', { ns: Namespaces.APP })}
          onPress={shareLogDatabase}
          style={listItemStyle}
        />

        {__DEV__ && (
          <List.Item
            left={() => <List.Icon icon={'database-export-outline'} />}
            title={t('Settings_shareAppDatabase_title', { ns: Namespaces.APP })}
            description={t('Settings_shareAppDatabase_text', { ns: Namespaces.APP })}
            onPress={shareAppDatabase}
            style={listItemStyle}
          />
        )}

        <List.Item
          left={() => <List.Icon icon={'information-outline'} />}
          title={t('Settings_appVersionInfo_title', { ns: Namespaces.APP })}
          description={APP_NAME_AND_VERSION}
          style={listItemStyle}
        />
      </ScrollView>
    </View>
  )
}
