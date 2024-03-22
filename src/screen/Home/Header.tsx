import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"
import { HomeMenu } from "./HomeMenu"


export interface HomeHeaderProps {
  isSelectionMode: boolean
  selectedDocumentsAmount: number
  exitSelectionMode: () => void
  invertSelection: () => void
  deleteSelectedDocuments: () => void
  importDocument: () => void
  exportDocument: () => void
  mergeDocument: () => void
  duplicateDocument: () => void
}


export function HomeHeader(props: HomeHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()


  function getTitle(): string {
    if (props.isSelectionMode) {
      return props.selectedDocumentsAmount.toString()
    }
    return translate("Home_header_title")
  }


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      {props.isSelectionMode && (
        <Appbar.Action icon={"close"} onPress={props.exitSelectionMode} />
      )}

      <Appbar.Content title={getTitle()} />

      {props.isSelectionMode && (
        <>
          <Appbar.Action icon={"swap-horizontal"} onPress={props.invertSelection} />

          <Appbar.Action
            icon={"trash-can-outline"}
            onPress={props.deleteSelectedDocuments}
          />
        </>
      )}

      <HomeMenu
        isSelectionMode={props.isSelectionMode}
        importDocument={props.importDocument}
        exportDocument={props.exportDocument}
        mergeDocument={props.mergeDocument}
        duplicateDocument={props.duplicateDocument}
      />
    </Appbar.Header>
  )
}
