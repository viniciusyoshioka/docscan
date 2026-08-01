import { Button, Dialog, Text } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'


interface DeleteSelectedDocumentsModalProps {
  isVisible: boolean
  onDismiss: () => void
  deleteSelectedDocuments: () => void
  exitSelection: () => void
}


export function DeleteSelectedDocumentsModal(
  props: DeleteSelectedDocumentsModalProps,
) {
  const { isVisible, onDismiss, deleteSelectedDocuments, exitSelection } = props


  const { t } = useLocale()


  function handleDeleteSelectedDocuments() {
    deleteSelectedDocuments()
    onDismiss()
    exitSelection()
  }


  return (
    <Dialog visible={isVisible}>
      <Dialog.Icon icon={'trash-can-outline'} />

      <Dialog.Title style={{ textAlign: 'center' }}>
        {t('DeleteSelectedDocumentsModal_title', { ns: Namespaces.APP })}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={'bodyLarge'}>
          {t(
            'DeleteSelectedDocumentsModal_description',
            { ns: Namespaces.APP },
          )}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {t('cancel')}
        </Button>

        <Button onPress={handleDeleteSelectedDocuments}>
          {t('delete')}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
