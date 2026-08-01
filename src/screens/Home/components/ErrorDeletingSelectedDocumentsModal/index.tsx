import { Button, Dialog, Text } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'


interface ErrorDeletingSelectedDocumentsModalProps {
  isVisible: boolean
  onDismiss: () => void
}


export function ErrorDeletingSelectedDocumentsModal(
  props: ErrorDeletingSelectedDocumentsModalProps,
) {
  const { isVisible, onDismiss } = props


  const { t } = useLocale()


  return (
    <Dialog visible={isVisible}>
      <Dialog.Icon icon={'alert-outline'} />

      <Dialog.Title style={{ textAlign: 'center' }}>
        {t(
          'ErrorDeletingSelectedDocumentsModal_title',
          { ns: Namespaces.APP },
        )}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={'bodyLarge'}>
          {t(
            'ErrorDeletingSelectedDocumentsModal_description',
            { ns: Namespaces.APP },
          )}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {t('ok')}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
