import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton } from "react-native-paper"

import { useSettings } from "@lib/settings"
import { ThemeType } from "@lib/settings/theme"
import { translate } from "@locales"
import { NavigationProps } from "@router"


export function ChangeTheme() {


  const navigation = useNavigation<NavigationProps<"ChangeTheme">>()

  const { settings, setSettings } = useSettings()
  const [newTheme, setNewTheme] = useState(settings.theme)


  function updateTheme() {
    setSettings({ theme: newTheme })
    navigation.goBack()
  }


  return (
    <Dialog visible={true} onDismiss={navigation.goBack}>
      <Dialog.Title>
        {translate("ChangeTheme_title")}
      </Dialog.Title>

      <Dialog.Content>
        <RadioButton.Group
          value={newTheme}
          onValueChange={newValue => setNewTheme(newValue as ThemeType)}
        >
          <RadioButton.Item
            label={translate("ChangeTheme_auto")}
            value={"auto" as ThemeType}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_light")}
            value={"light" as ThemeType}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ChangeTheme_dark")}
            value={"dark" as ThemeType}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          children={translate("cancel")}
          onPress={navigation.goBack}
        />

        <Button
          children={translate("ok")}
          onPress={updateTheme}
        />
      </Dialog.Actions>
    </Dialog>
  )
}
