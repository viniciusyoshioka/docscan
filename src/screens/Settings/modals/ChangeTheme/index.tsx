import { Button, Dialog, RadioButton } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'
import { Theme } from '@modules/settings'
import { useChangeTheme } from './hooks'


export function ChangeTheme() {


  const { t } = useLocale()

  const changeTheme = useChangeTheme()


  return (
    <Dialog visible={true} onDismiss={changeTheme.cancel}>
      <Dialog.Title>
        {t('ChangeTheme_title', { ns: Namespaces.APP })}
      </Dialog.Title>

      <Dialog.Content>
        <RadioButton.Group
          value={changeTheme.selectedTheme}
          onValueChange={changeTheme.selectTheme}
        >
          <RadioButton.Item
            label={t('ChangeTheme_auto', { ns: Namespaces.APP })}
            value={Theme.AUTO}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={t('ChangeTheme_light', { ns: Namespaces.APP })}
            value={Theme.LIGHT}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={t('ChangeTheme_dark', { ns: Namespaces.APP })}
            value={Theme.DARK}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={changeTheme.cancel}>
          {t('cancel')}
        </Button>

        <Button onPress={changeTheme.updateTheme}>
          {t('ok')}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
