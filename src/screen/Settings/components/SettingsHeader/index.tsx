import { Appbar } from "react-native-paper"

import { translate } from "@locales"
import { useGoBack } from "../../hooks"


interface SettingsHeaderProps {}


export function SettingsHeader(props: SettingsHeaderProps) {


  const goBack = useGoBack()


  return (
    <Appbar.Header elevated={true}>
      <Appbar.BackAction onPress={goBack} />

      <Appbar.Content title={translate("Settings_header_title")} />
    </Appbar.Header>
  )
}
