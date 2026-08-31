import { EmptyScreen } from 'react-native-paper-towel'

import { Namespaces, useLocale } from '@locale'


interface EmptyPicturesProps {}


export function EmptyPictures(props: EmptyPicturesProps) {


  const { t } = useLocale()


  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon name={'image-off-outline'} size={56} />

      <EmptyScreen.Message>
        {t('DocumentDetail_emptyDocument', { ns: Namespaces.APP })}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
