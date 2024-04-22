import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Document, IdOf } from "@database"
import { translate } from "@locales"
import { HomeMenu } from "./HomeMenu"
import { useDeleteSelectedDocuments } from "./useDeleteSelectedDocuments"


export interface HomeHeaderProps {
  isSelectionMode: boolean
  selectedDocuments: IdOf<Document>[]
  exitSelectionMode: () => void
  invertSelection: () => void
  importDocument: () => void
  exportDocument: () => void
}


export function HomeHeader(props: HomeHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const deleteSelectedDocuments = useDeleteSelectedDocuments(props.selectedDocuments)


  function getTitle(): string {
    if (props.isSelectionMode) {
      return props.selectedDocuments.length.toString()
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
            onPress={deleteSelectedDocuments}
          />
        </>
      )}

      <HomeMenu
        isSelectionMode={props.isSelectionMode}
        importDocument={props.importDocument}
        exportDocument={props.exportDocument}
      />
    </Appbar.Header>
  )
}
