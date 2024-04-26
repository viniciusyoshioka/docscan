import { useNavigation } from "@react-navigation/native"
import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { NavigationProps } from "@router"
import { EditDocumentMenu } from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
  goBack: () => void
  exitSelectionMode: () => void
  isSelectionMode: boolean
  selectedPicturesAmount: number
  invertSelection: () => void
  deletePicture: () => void
  openCamera: () => void
  shareDocument: () => void
  visualizePdf: () => void
  deletePdf: () => void
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()
  const safeAreaInsets = useSafeAreaInsets()

  const { documentState } = useDocumentState()
  const { document } = documentState as DocumentStateData

  const documentTitle = props.isSelectionMode
    ? props.selectedPicturesAmount.toString()
    : document.name


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Action
        icon={props.isSelectionMode ? "close" : "arrow-left"}
        onPress={props.isSelectionMode ? props.exitSelectionMode : props.goBack}
      />

      <Appbar.Content title={documentTitle} />

      {!props.isSelectionMode && (
        <>
          <Appbar.Action icon={"camera-plus-outline"} onPress={props.openCamera} />

          <EditDocumentMenu
            convertToPdf={() => navigation.navigate("ConvertPdfOption")}
            shareDocument={props.shareDocument}
            visualizePdf={props.visualizePdf}
            renameDocument={() => navigation.navigate("RenameDocument")}
            deletePdf={props.deletePdf}
          />
        </>
      )}

      {props.isSelectionMode && (
        <>
          <Appbar.Action icon={"swap-horizontal"} onPress={props.invertSelection} />

          <Appbar.Action icon={"trash-can-outline"} onPress={props.deletePicture} />
        </>
      )}
    </Appbar.Header>
  )
}
