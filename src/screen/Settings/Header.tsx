import { useNavigation } from "@react-navigation/native"
import { Appbar } from "react-native-paper"

import { translate } from "@locales"
import { NavigationProps } from "@router"


export interface SettingsHeaderProps {}


export function SettingsHeader(props: SettingsHeaderProps) {


  const navigation = useNavigation<NavigationProps<"Settings">>()


  function goBack() {
    navigation.navigate("Home")
  }


  return (
    <Appbar.Header elevated={true}>
      <Appbar.BackAction onPress={goBack} />

      <Appbar.Content title={translate("Settings_header_title")} />
    </Appbar.Header>
  )
}
