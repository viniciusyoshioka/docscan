import { createRef } from 'react'
import type { TextInput as RNTextInput } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { Button, Dialog, TextInput } from 'react-native-paper'
import { Input } from 'react-native-paper-towel'

import type { BackHandlerCallback } from '@hooks'
import { useBackHandler, useBlurInputOnKeyboardDismiss } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import {
  useOnDismissRenameDocument,
  useRenameDocument,
  useRenameDocumentTitle,
} from './hooks'


export function RenameDocument() {


  const { t } = useLocale()

  const inputRef = createRef<RNTextInput>()
  useBlurInputOnKeyboardDismiss(inputRef)


  const { newTitle, setNewTitle, hasChangedTitle } = useRenameDocumentTitle()

  const renameDocument = useRenameDocument({
    hasChangedTitle,
    newTitle,
    inputRef,
  })

  const { isLoading } = renameDocument
  const isDisabled = renameDocument.isLoading

  const onDismiss = useOnDismissRenameDocument({
    inputRef,
    isDisabled,
    hasChangedTitle,
  })


  useBackHandler(onDismiss as unknown as BackHandlerCallback)


  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={{ flex: 1 }}
    >
      <Dialog visible onDismiss={onDismiss}>
        <Dialog.Icon icon={'rename-outline'} />

        <Dialog.Title style={{ textAlign: 'center' }}>
          {t('RenameDocument_title', { ns: Namespaces.APP })}
        </Dialog.Title>

        <Dialog.Content>
          <Input
            ref={inputRef}
            placeholder={t(
              'RenameDocument_documentName_placeholder',
              { ns: Namespaces.APP },
            )}
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus={true}
            disabled={isDisabled}
            right={(
              <TextInput.Icon
                icon={'close'}
                size={18}
                disabled={isDisabled}
                onPress={() => setNewTitle('')}
              />
            )}
          />
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            onPress={onDismiss}
            disabled={isDisabled}
          >
            {t('cancel')}
          </Button>

          <Button
            onPress={renameDocument.renameDocument}
            loading={isLoading}
            disabled={isDisabled}
          >
            {t('ok')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </KeyboardAvoidingView>
  )
}
