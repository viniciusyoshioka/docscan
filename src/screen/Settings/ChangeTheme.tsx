import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton } from "react-native-paper"

import { translate } from "@locales"
import { NavigationParamProps } from "@router"
import { ThemeType, useAppTheme } from "@theme"


export function ChangeTheme() {


    const navigation = useNavigation<NavigationParamProps<"ChangeTheme">>()
    const { appTheme, switchTheme } = useAppTheme()

    const [selectedTheme, setSelectedTheme] = useState(appTheme)


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
                    onPress={() => {
                        switchTheme(selectedTheme)
                        navigation.goBack()
                    }}
                />
            </Dialog.Actions>
        </Dialog>
    )
}
