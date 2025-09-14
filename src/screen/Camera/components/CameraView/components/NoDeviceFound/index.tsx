import { EmptyScreen } from "react-native-paper-towel"

import { translate } from "@locales"


interface NoDeviceFoundProps {}


export function NoDeviceFound(props: NoDeviceFoundProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon
        name={"camera-off-outline"}
        size={56}
      />

      <EmptyScreen.Message>
        {translate("Camera_noCameraAvailable")}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
