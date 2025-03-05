import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton } from "react-native-paper"

import { ThemeType, useSettings } from "@libs/settings"
import { translate } from "@locales"
import { NavigationProps } from "@router"


export function ChangeTheme() {


  const navigation = useNavigation<NavigationProps<"ChangeTheme">>()

  const { settings, setSettings } = useSettings()
  const [newTheme, setNewTheme] = useState<ThemeType>(settings.theme)


  function selectNewTheme(newTheme: string) {
    setNewTheme(newTheme as ThemeType)
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
        <RadioButton.Group
          value={newTheme}
          onValueChange={selectNewTheme}
        >
          <RadioButton.Item
            label={translate("ChangeTheme_auto")}
            value={"auto"}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_light")}
            value={"light"}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_dark")}
            value={"dark"}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          children={translate("cancel")}
          onPress={cancelThemeChange}
        />

        <Button
          children={translate("ok")}
          onPress={updateTheme}
        />
      </Dialog.Actions>
    </Dialog>
  )
}
