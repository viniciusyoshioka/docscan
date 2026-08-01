import type { ImageSourcePropType } from 'react-native'
import { EmptyScreen } from 'react-native-paper-towel'

import { Namespaces, useLocale } from '@locale'
import { Info } from '@modules/info'


interface EmptyDocumentsProps {}


// TODO: Improve app icon
// TODO: Replace EmptyScreen component after update the library
export function EmptyDocuments(props: EmptyDocumentsProps) {


  const { t } = useLocale()


  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Image
        source={Info.app.iconOutline as ImageSourcePropType}
      />

      <EmptyScreen.Message>
        {t('Home_emptyDocumentList', { ns: Namespaces.APP })}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
