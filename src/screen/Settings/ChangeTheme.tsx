import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton } from "react-native-paper"

import { translate } from "@locales"
import { NavigationProps } from "@router"
import { useSettings } from "@services/settings"
import { ThemeType } from "@theme"


export function ChangeTheme() {


  const navigation = useNavigation<NavigationProps<"ChangeTheme">>()
  const { settings, setSettings } = useSettings()

  const [selectedTheme, setSelectedTheme] = useState(settings.theme)


  function updateTheme() {
    setSettings({
      ...settings,
      theme: selectedTheme,
    })
    navigation.goBack()
  }


  return (
    <Dialog visible={true} onDismiss={navigation.goBack}>
      <Dialog.Title>
        {translate("ChangeTheme_title")}
      </Dialog.Title>

      <Dialog.Content>
        <RadioButton.Group
          value={selectedTheme}
          onValueChange={newValue => setSelectedTheme(newValue as ThemeType)}
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
