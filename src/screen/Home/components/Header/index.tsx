import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"
import { HomeHeaderMenu } from "../HomeHeaderMenu"


export * from "./constants"


interface HomeHeaderProps {
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


  if (props.isSelectionMode) return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Action
        icon={"close"}
        onPress={props.exitSelectionMode}
      />

      <Appbar.Content title={props.selectedDocumentsAmount.toString()} />

      <Appbar.Action
        icon={"swap-horizontal"}
        onPress={props.invertSelection}
      />

      <Appbar.Action
        icon={"trash-can-outline"}
        onPress={props.deleteSelectedDocuments}
      />

      <HomeHeaderMenu
        isSelectionMode={props.isSelectionMode}
        importDocument={props.importDocument}
        exportDocument={props.exportDocument}
        mergeDocument={props.mergeDocument}
        duplicateDocument={props.duplicateDocument}
      />
    </Appbar.Header>
  )


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Content title={translate("Home_header_title")} />

      <HomeHeaderMenu
        isSelectionMode={props.isSelectionMode}
        importDocument={props.importDocument}
        exportDocument={props.exportDocument}
        mergeDocument={props.mergeDocument}
        duplicateDocument={props.duplicateDocument}
      />
    </Appbar.Header>
  )
}
