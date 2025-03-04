import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"
import { HomeHeaderMenu } from "../HomeHeaderMenu"


export * from "./constants"


interface HomeHeaderProps {
  isSelectionMode: boolean
  selectedDocumentsCount: number
  exitSelectionMode: () => void
  invertSelection: () => void
  deleteDocuments: () => void
  importDocuments: () => void
  exportDocuments: () => void
  mergeDocuments: () => void
  duplicateDocuments: () => void
}


export function HomeHeader(props: HomeHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()


  if (props.isSelectionMode) return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Action
        icon={"close"}
        onPress={props.exitSelectionMode}
      />

      <Appbar.Content title={props.selectedDocumentsCount.toString()} />

      <Appbar.Action
        icon={"swap-horizontal"}
        onPress={props.invertSelection}
      />

      <Appbar.Action
        icon={"trash-can-outline"}
        onPress={props.deleteDocuments}
      />

      <HomeHeaderMenu
        isSelectionMode={props.isSelectionMode}
        importDocuments={props.importDocuments}
        exportDocuments={props.exportDocuments}
        mergeDocuments={props.mergeDocuments}
        duplicateDocuments={props.duplicateDocuments}
      />
    </Appbar.Header>
  )


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Content title={translate("Home_header_title")} />

      <HomeHeaderMenu
        isSelectionMode={props.isSelectionMode}
        importDocuments={props.importDocuments}
        exportDocuments={props.exportDocuments}
        mergeDocuments={props.mergeDocuments}
        duplicateDocuments={props.duplicateDocuments}
      />
    </Appbar.Header>
  )
}
