import { useNavigation } from "@react-navigation/core"
import { Alert, ScrollView, View } from "react-native"
import { List } from "react-native-paper"
import Share from "react-native-share"

import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationParamProps } from "@router"
import { Constants } from "@services/constant"
import { log, stringfyError } from "@services/log"
import { SettingsHeader } from "./Header"


export { ChangeTheme } from "./ChangeTheme"


export function Settings() {


  const navigation = useNavigation<NavigationParamProps<"Settings">>()


  useBackHandler(() => {
    navigation.navigate("Home")
    return true
  })


  async function shareLogDatabaseFile() {
    try {
      await Share.open({
        type: "application/x-sqlite3",
        url: `file://${Constants.logDatabaseFullPath}`,
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
        url: `file://${Constants.appDatabaseFullPath}`,
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
    <View style={{ flex: 1 }}>
      <SettingsHeader />

      <ScrollView>
        <List.Item
          left={() => <List.Icon icon={"brightness-6"} />}
          title={translate("Settings_theme_title")}
          description={translate("Settings_theme_text")}
          onPress={() => navigation.navigate("ChangeTheme")}
          style={{ paddingLeft: 16 }}
        />

        <List.Item
          left={() => <List.Icon icon={"receipt-text-clock-outline"} />}
          title={translate("Settings_shareLogDatabase_title")}
          description={translate("Settings_shareLogDatabase_text")}
          onPress={shareLogDatabaseFile}
          style={{ paddingLeft: 16 }}
        />

        {__DEV__ && (
          <List.Item
            left={() => <List.Icon icon={"receipt-text-clock-outline"} />}
            title={translate("Settings_shareAppDatabase_title")}
            description={translate("Settings_shareAppDatabase_text")}
            onPress={shareAppDatabaseFile}
            style={{ paddingLeft: 16 }}
          />
        )}

        <List.Item
          left={() => <List.Icon icon={"information-outline"} />}
          title={translate("Settings_appVersionInfo_title")}
          description={`${Constants.appName} ${Constants.appVersion} - ${Constants.appType}`}
          style={{ paddingLeft: 16 }}
        />
      </ScrollView>
    </View>
  )
}
