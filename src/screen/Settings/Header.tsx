import { useNavigation } from "@react-navigation/native"
import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"
import { NavigationParamProps } from "@router"


export interface SettingsHeaderProps {}


export function SettingsHeader(props: SettingsHeaderProps) {


    const safeAreaInsets = useSafeAreaInsets()

    const navigation = useNavigation<NavigationParamProps<"Settings">>()


    return (
        <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
            <Appbar.BackAction onPress={() => navigation.navigate("Home")} />

            <Appbar.Content title={translate("Settings_header_title")} />
        </Appbar.Header>
    )
}
