import { EmptyScreen } from 'react-native-paper-towel'

import { Namespaces, useLocale } from '@locale'


interface NoDeviceFoundProps {}


export function NoDeviceFound(props: NoDeviceFoundProps) {


  const { t } = useLocale()


  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon
        name={'camera-off-outline'}
        size={56}
      />

      <EmptyScreen.Message>
        {t('Camera_noCameraAvailable', { ns: Namespaces.APP })}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
