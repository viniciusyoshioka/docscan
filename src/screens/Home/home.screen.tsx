import { View } from 'react-native'

import { Header } from '@components'
import { useHideSplashscreen } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { Info } from '@modules/info'
import { useOpenSettings } from './hooks'


export function Home() {


  useHideSplashscreen()


  const { t } = useLocale()

  const openSettings = useOpenSettings()


  return (
    <View>
      <Header
        title={Info.app.name}
        menuItems={[
          {
            iconName: 'cog-outline',
            title: t('Home_menu_settings', { ns: Namespaces.APP }),
            onPress: openSettings,
          },
        ]}
      />
    </View>
  )
}
