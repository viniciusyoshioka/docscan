import { EmptyScreen } from 'react-native-paper-towel'

import { Namespaces, useLocale } from '@locale'


export function CameraDeviceError() {


  const { t } = useLocale()


  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon
        name={'camera-off-outline'}
        size={56}
      />

      <EmptyScreen.Message>
        {t('Camera_unexpectedErrorInitializingCameraDevice', { ns: Namespaces.APP })}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
