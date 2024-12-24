import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"


export interface GalleryHeaderProps {
  goBack: () => void
  exitSelectionMode: () => void
  importImage: () => void
  isSelectionMode: boolean
  selectedImagesAmount: number
}


export function GalleryHeader(props: GalleryHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()


  function getTitle(): string {
    if (props.isSelectionMode) {
      return props.selectedImagesAmount.toString()
    }
    return translate("Gallery_header_title")
  }


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      {props.isSelectionMode && (
        <Appbar.Action icon={"close"} onPress={props.exitSelectionMode} />
      )}

      {!props.isSelectionMode && (
        <Appbar.BackAction onPress={props.goBack} />
      )}

      <Appbar.Content title={getTitle()} />

      {props.isSelectionMode && (
        <Appbar.Action icon={"check"} onPress={props.importImage} />
      )}
    </Appbar.Header>
  )
}
