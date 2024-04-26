import { useState } from "react"
import { Alert, StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { stringifyError } from "@utils"
import { FileNotExistsError, NoReadPermissionError } from "./errors"
import { useVisualizePdf } from "./useVisualizePdf"


export interface EditDocumentMenuProps {
  convertToPdf: () => void
  shareDocument: () => void
  renameDocument: () => void
  deletePdf: () => void
}


export function EditDocumentMenu(props: EditDocumentMenuProps) {


  const log = useLogger()
  const visualizePdf = useVisualizePdf()

  const [isOpen, setIsOpen] = useState(false)


  function MenuAnchor() {
    return (
      <Appbar.Action
        icon={"dots-vertical"}
        onPress={() => setIsOpen(true)}
      />
    )
  }

  async function handleVisualizePdf() {
    try {
      setIsOpen(false)
      await visualizePdf()
    } catch (error) {
      if (error instanceof NoReadPermissionError) {
        log.error(`No read permission to access PDF file: ${stringifyError(error)}`)
        Alert.alert(
          translate("warn"),
          translate("EditDocument_alert_noPermissionToVisualizePdf_text")
        )
      } else if (error instanceof FileNotExistsError) {
        log.error(`PDF file to visualize doesn't exists: ${stringifyError(error)}`)
        Alert.alert(
          translate("warn"),
          translate("EditDocument_alert_pdfFileDoesNotExists_text")
        )
      } else {
        log.error(`Unexpected error visualizing pdf: ${stringifyError(error)}`)
        Alert.alert(
          translate("warn"),
          translate("EditDocument_menu_unexpectedErrorVisualizingPdf_text")
        )
      }
    }
  }


  return (
    <Menu
      anchor={<MenuAnchor />}
      visible={isOpen}
      onDismiss={() => setIsOpen(false)}
      statusBarHeight={StatusBar.currentHeight}
    >
      <Menu.Item
        title={translate("EditDocument_menu_convertToPdf")}
        onPress={() => {
          setIsOpen(false)
          props.convertToPdf()
        }}
      />

      <Menu.Item
        title={translate("EditDocument_menu_sharePdf")}
        onPress={() => {
          setIsOpen(false)
          props.shareDocument()
        }}
      />

      <Menu.Item
        title={translate("EditDocument_menu_visualizePdf")}
        onPress={handleVisualizePdf}
      />

      <Menu.Item
        title={translate("EditDocument_menu_rename")}
        onPress={() => {
          setIsOpen(false)
          props.renameDocument()
        }}
      />

      <Menu.Item
        title={translate("EditDocument_menu_deletePdf")}
        onPress={() => {
          setIsOpen(false)
          props.deletePdf()
        }}
      />
    </Menu>
  )
}
