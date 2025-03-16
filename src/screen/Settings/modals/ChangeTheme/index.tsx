import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton } from "react-native-paper"

import { Theme, useSettings } from "@libs/settings"
import { translate } from "@locales"
import { NavigationProps } from "@router"


export function ChangeTheme() {


  const navigation = useNavigation<NavigationProps<"ChangeTheme">>()

  const { settings, setSettings } = useSettings()
  const [newTheme, setNewTheme] = useState(settings.theme)


  function selectNewTheme(value: string) {
    const selectedNewTheme = value as Theme
    setNewTheme(selectedNewTheme)
  }

  function cancelThemeChange() {
    navigation.goBack()
  }

  function updateTheme() {
    setSettings({ theme: newTheme })
    navigation.goBack()
  }


  return (
    <Dialog visible={true} onDismiss={cancelThemeChange}>
      <Dialog.Title>
        {translate("ChangeTheme_title")}
      </Dialog.Title>

      <Dialog.Content>
        <RadioButton.Group value={newTheme} onValueChange={selectNewTheme}>
          <RadioButton.Item
            label={translate("ChangeTheme_auto")}
            value={Theme.AUTO}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_light")}
            value={Theme.LIGHT}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_dark")}
            value={Theme.DARK}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={cancelThemeChange}>
          {translate("cancel")}
        </Button>

        <Button onPress={updateTheme}>
          {translate("ok")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
