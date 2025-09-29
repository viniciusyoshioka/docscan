import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useDocumentState } from "@libs/document-state"
import { DocumentService } from "@services/document"
import { EditDocumentHeaderMenu } from "../EditDocumentHeaderMenu"


export { EDIT_DOCUMENT_HEADER_HEIGHT } from "./constants"


interface EditDocumentHeaderProps {
  isSelectionMode: boolean
  goBack: () => void
  exitSelection: () => void
  selectedPicturesCount: number
  openCamera: () => void
  invertPicturesSelection: () => void
  deletePictures: () => void
  convertToPdf: () => void
  sharePdf: () => void
  visualizePdf: () => void
  renameDocument: () => void
  deletePdf: () => void
  deleteDocument: () => void
}


// TODO: Add option to split selected pictures into a new document
export function EditDocumentHeader(props: EditDocumentHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const { documentState } = useDocumentState()

  const documentName = documentState?.document.name ?? DocumentService.getNewName()


  if (props.isSelectionMode) return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.Action
        icon={"close"}
        onPress={props.exitSelection}
      />

      <Appbar.Content title={props.selectedPicturesCount.toString()} />

      <Appbar.Action
        icon={"swap-horizontal"}
        onPress={props.invertPicturesSelection}
      />

      <Appbar.Action
        icon={"trash-can-outline"}
        onPress={props.deletePictures}
      />
    </Appbar.Header>
  )


  return (
    <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
      <Appbar.BackAction onPress={props.goBack} />

      <Appbar.Content title={documentName} />

      <Appbar.Action
        icon={"camera-plus-outline"}
        onPress={props.openCamera}
      />

      <EditDocumentHeaderMenu
        convertToPdf={props.convertToPdf}
        sharePdf={props.sharePdf}
        visualizePdf={props.visualizePdf}
        renameDocument={props.renameDocument}
        deletePdf={props.deletePdf}
        deleteDocument={props.deleteDocument}
      />
    </Appbar.Header>
  )
}
