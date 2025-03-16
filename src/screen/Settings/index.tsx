import { useNavigation } from "@react-navigation/core"
import { ScrollView, View, ViewStyle } from "react-native"
import { List } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { Constants } from "@services/constant"
import { SettingsHeader } from "./components"
import { useGoBack, useShareAppDatabase, useShareLogDatabase } from "./hooks"


export * from "./modals"


export function Settings() {


  const navigation = useNavigation<NavigationProps<"Settings">>()
  const safeAreaInsets = useSafeAreaInsets()

  const goBack = useGoBack()
  const shareAppDatabase = useShareAppDatabase()
  const shareLogDatabase = useShareLogDatabase()


  useBackHandler(goBack)


  const listItemStyle: ViewStyle = {
    paddingLeft: 16 + safeAreaInsets.left,
    paddingRight: safeAreaInsets.right,
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
          style={listItemStyle}
        />

        <List.Item
          left={() => <List.Icon icon={"receipt-text-clock-outline"} />}
          title={translate("Settings_shareLogDatabase_title")}
          description={translate("Settings_shareLogDatabase_text")}
          onPress={shareLogDatabase}
          style={listItemStyle}
        />

        {__DEV__ && (
          <List.Item
            left={() => <List.Icon icon={"receipt-text-clock-outline"} />}
            title={translate("Settings_shareAppDatabase_title")}
            description={translate("Settings_shareAppDatabase_text")}
            onPress={shareAppDatabase}
            style={listItemStyle}
          />
        )}

        <List.Item
          left={() => <List.Icon icon={"information-outline"} />}
          title={translate("Settings_appVersionInfo_title")}
          description={`${Constants.appName} ${Constants.appVersion}`}
          style={listItemStyle}
        />
      </ScrollView>
    </View>
  )
}
