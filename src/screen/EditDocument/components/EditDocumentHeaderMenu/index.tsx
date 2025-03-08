import { useMemo, useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"


interface EditDocumentHeaderMenuProps {
  convertToPdf: () => void
  sharePdf: () => void
  visualizePdf: () => void
  renameDocument: () => void
  deletePdf: () => void
}


// TODO: Add option to split selected pictures into a new document
export function EditDocumentHeaderMenu(props: EditDocumentHeaderMenuProps) {
  const { convertToPdf, sharePdf, visualizePdf, renameDocument, deletePdf } = props


  const [isOpen, setIsOpen] = useState(false)


  const MenuAnchor = useMemo(() => {
    return (
      <Appbar.Action
        icon={"dots-vertical"}
        onPress={() => setIsOpen(true)}
      />
    )
  }, [])

  function onDismiss() {
    setIsOpen(false)
  }

  function onConvertToPdf() {
    onDismiss()
    convertToPdf()
  }

  function onSharePdf() {
    onDismiss()
    sharePdf()
  }

  function onVisualizePdf() {
    onDismiss()
    visualizePdf()
  }

  function onRenameDocument() {
    onDismiss()
    renameDocument()
  }

  function onDeletePdf() {
    onDismiss()
    deletePdf()
  }


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
        leadingIcon={"trash-can-outline"}
        title={translate("EditDocument_menu_deletePdf")}
        onPress={onDeletePdf}
      />
    </Menu>
  )
}
