import { EmptyScreen } from 'react-native-paper-towel'

import { Namespaces, useLocale } from '@locale'


interface EmptyImagesListProps {}


// TODO: Replace EmptyScreen component after update the library
export function EmptyImagesList(props: EmptyImagesListProps) {


  const { t } = useLocale()


  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon name={'image-outline'} size={56} />

      <EmptyScreen.Message>
        {t('Gallery_emptyGallery', { ns: Namespaces.APP })}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
