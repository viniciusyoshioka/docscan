import { useNavigation } from "@react-navigation/native"
import { StatusBar } from "react-native"
import { Appbar } from "react-native-paper"

import { translate } from "@locales"
import { NavigationParamProps } from "@router"


export interface SettingsHeaderProps {}


export function SettingsHeader(props: SettingsHeaderProps) {


    const navigation = useNavigation<NavigationParamProps<"Settings">>()


    return (
        <Appbar.Header elevated={true} statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction onPress={() => navigation.navigate("Home")} />

            <Appbar.Content title={translate("Settings_header_title")} />
        </Appbar.Header>
    )
}
