import { EmptyScreen } from "react-native-paper-towel"

import { translate } from "@locales"


interface EmptyImagesListProps {}


export function EmptyImagesList(props: EmptyImagesListProps) {
  return (
    <EmptyScreen.Content visible={true}>
      <EmptyScreen.Icon name={"image-outline"} size={56} />

      <EmptyScreen.Message>
        {translate("Gallery_emptyGallery")}
      </EmptyScreen.Message>
    </EmptyScreen.Content>
  )
}
