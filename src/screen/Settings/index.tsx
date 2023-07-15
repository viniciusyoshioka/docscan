import { ListItem, Screen, StatusBar, Text } from "@elementium/native"
import { useNavigation } from "@react-navigation/core"
import { useState } from "react"
import { Alert } from "react-native"
import Share from "react-native-share"

import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { NavigationParamProps } from "../../router"
import { appDatabaseFullPath, appName, appType, appVersion, logDatabaseFullPath } from "../../services/constant"
import { log, stringfyError } from "../../services/log"
import { useAppTheme } from "../../theme"
import { ChangeTheme } from "./ChangeTheme"
import { SettingsHeader } from "./Header"
import { ViewVersion } from "./style"


export function Settings() {


    const navigation = useNavigation<NavigationParamProps<"Settings">>()
    const { color } = useAppTheme()

    const [changeThemeVisible, setChangeThemeVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        navigation.navigate("Home")
    }

    async function shareLogDatabaseFile() {
        try {
            await Share.open({
                type: "application/x-sqlite3",
                url: `file://${logDatabaseFullPath}`,
                failOnCancel: false,
            })
        } catch (error) {
            log.error(`Error sharing log file: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Settings_alert_errorSharingLogDatabase_text")
            )
        }
    }

    async function shareAppDatabaseFile() {
        try {
            await Share.open({
                type: "application/x-sqlite3",
                url: `file://${appDatabaseFullPath}`,
                failOnCancel: false,
            })
        } catch (error) {
            log.error(`Error sharing document database file: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Settings_alert_errorSharingAppDatabase_text")
            )
        }
    }


    return (
        <Screen>
            <StatusBar />

            <SettingsHeader
                goBack={goBack}
            />

            <ListItem
                leadingIcon={{ iconName: "brightness-medium" }}
                title={translate("Settings_theme_title")}
                description={translate("Settings_theme_text")}
                onPress={() => setChangeThemeVisible(true)}
            />

            <ListItem
                leadingIcon={{ iconName: "receipt-long" }}
                title={translate("Settings_shareLogDatabase_title")}
                description={translate("Settings_shareLogDatabase_text")}
                onPress={shareLogDatabaseFile}
            />

            {__DEV__ && (
                <ListItem
                    leadingIcon={{ iconName: "receipt-long" }}
                    title={translate("Settings_shareAppDatabase_title")}
                    description={translate("Settings_shareAppDatabase_text")}
                    onPress={shareAppDatabaseFile}
                />
            )}

            <ViewVersion>
                <Text
                    variant={"body"}
                    size={"medium"}
                    style={{ color: color.onBackground }}
                    children={`${appName} ${appVersion} - ${appType}`}
                />
            </ViewVersion>

            <ChangeTheme
                visible={changeThemeVisible}
                onRequestClose={() => setChangeThemeVisible(false)}
            />
        </Screen>
    )
}
