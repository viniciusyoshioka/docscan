import { EmptyScreen } from "react-native-paper-towel"

import { translate } from "@locales"


interface EmptyPicturesProps {}


export function EmptyPictures(props: EmptyPicturesProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon name={"image-off-outline"} size={56} />

      <EmptyScreen.Message>
        {translate("EditDocument_emptyDocument")}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
