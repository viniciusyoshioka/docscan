import { useCallback, useMemo, useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"


interface EditDocumentHeaderMenuProps {
  convertToPdf: () => void
  sharePdf: () => void
  visualizePdf: () => void
  renameDocument: () => void
  deletePdf: () => void
  deleteDocument: () => void
}


// TODO: Add option to split selected pictures into a new document
export function EditDocumentHeaderMenu(props: EditDocumentHeaderMenuProps) {
  const { convertToPdf, sharePdf, visualizePdf, renameDocument, deletePdf, deleteDocument } = props


  const [isOpen, setIsOpen] = useState(false)


  const MenuAnchor = useMemo(() => {
    return (
      <Appbar.Action
        icon={"dots-vertical"}
        onPress={() => setIsOpen(true)}
      />
    )
  }, [])


  const onDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onConvertToPdf = useCallback(() => {
    onDismiss()
    convertToPdf()
  }, [onDismiss, convertToPdf])

  const onSharePdf = useCallback(() => {
    onDismiss()
    sharePdf()
  }, [onDismiss, sharePdf])

  const onVisualizePdf = useCallback(() => {
    onDismiss()
    visualizePdf()
  }, [onDismiss, visualizePdf])

  const onRenameDocument = useCallback(() => {
    onDismiss()
    renameDocument()
  }, [onDismiss, renameDocument])

  const onDeletePdf = useCallback(() => {
    onDismiss()
    deletePdf()
  }, [onDismiss, deletePdf])

  const onDeleteDocument = useCallback(() => {
    onDismiss()
    deleteDocument()
  }, [onDismiss, deleteDocument])


  return (
    <Menu
      anchor={MenuAnchor}
      visible={isOpen}
      onDismiss={onDismiss}
      statusBarHeight={StatusBar.currentHeight}
    >
      <Menu.Item
        leadingIcon={"file-pdf-box"}
        title={translate("EditDocument_menu_convertToPdf")}
        onPress={onConvertToPdf}
      />

      <Menu.Item
        leadingIcon={"share-variant-outline"}
        title={translate("EditDocument_menu_sharePdf")}
        onPress={onSharePdf}
      />

      <Menu.Item
        leadingIcon={"open-in-new"}
        title={translate("EditDocument_menu_visualizePdf")}
        onPress={onVisualizePdf}
      />

      <Menu.Item
        leadingIcon={"rename-outline"}
        title={translate("EditDocument_menu_rename")}
        onPress={onRenameDocument}
      />

      <Menu.Item
        leadingIcon={"file-document-remove-outline"}
        title={translate("EditDocument_menu_deletePdf")}
        onPress={onDeletePdf}
      />

      <Menu.Item
        leadingIcon={"trash-can-outline"}
        title={translate("EditDocument_menu_deleteDocument")}
        onPress={onDeleteDocument}
      />
    </Menu>
  )
}
