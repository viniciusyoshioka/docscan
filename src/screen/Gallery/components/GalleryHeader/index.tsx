import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"


export * from "./constants"


interface GalleryHeaderProps {
  goBack: () => void
  exitSelection: () => void
  importImages: () => void
  isSelectionMode: boolean
  selectedImagesCount: number
}


export function GalleryHeader(props: GalleryHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()


  if (props.isSelectionMode) return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Action icon={"close"} onPress={props.exitSelection} />
      <Appbar.Content title={props.selectedImagesCount.toString()} />
      <Appbar.Action icon={"check"} onPress={props.importImages} />
    </Appbar.Header>
  )


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.BackAction onPress={props.goBack} />
      <Appbar.Content title={translate("Gallery_header_title")} />
    </Appbar.Header>
  )
}
