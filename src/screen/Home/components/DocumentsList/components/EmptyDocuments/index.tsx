import { EmptyScreen } from "react-native-paper-towel"

import { translate } from "@locales"
import { Constants } from "@services/constant"


interface EmptyDocumentsProps {}


// TODO: Improve app icon
// TODO: Replace EmptyScreen component after update the library
export function EmptyDocuments(props: EmptyDocumentsProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Image source={Constants.appIconOutline} />

      <EmptyScreen.Message>
        {translate("Home_emptyDocumentList")}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
