import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Alert, View } from "react-native"
import RNFS from "react-native-fs"
import { Button, Dialog, RadioButton, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { useDocumentModel } from "@database"
import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { log, stringfyError } from "@services/log"
import { PdfCreator } from "@services/pdf-creator"
import { getWritePermission } from "@services/permission"
import { useAppTheme } from "@theme"
import { stylesheet } from "./style"


type DocumentPdfCompressionLevel = "low" | "high" | "custom"


export function ConvertPdfOption() {


  const navigation = useNavigation<NavigationProps<"ConvertPdfOption">>()
  const { styles } = useStyles(stylesheet)

  const { documentModel } = useDocumentModel()
  const document = documentModel?.document ?? null
  const pictures = documentModel?.pictures ?? []

  const { colors } = useAppTheme()

  const [compressionVisualValue, setCompressionVisualValue] = useState(60)
  const [compressionValue, setCompressionValue] = useState(60)
  const [compressionLevel, setCompressionLevel] = useState<DocumentPdfCompressionLevel>(
    "high"
  )
  const isSliderDisabled = compressionLevel !== "custom"


  useBackHandler(() => goBack())


  function goBack() {
    navigation.goBack()
    return true
  }


  async function convertToPdf() {
    if (!document) {
      log.warn("There is no document to be converted to PDF")
      Alert.alert(
        translate("warn"),
        translate("ConvertPdfOption_alert_noDocumentOpened_text")
      )
      return
    }

    if (pictures.length === 0) {
      log.warn("There is no pictures in the document to be converted to PDF")
      Alert.alert(
        translate("warn"),
        translate("ConvertPdfOption_alert_documentWithoutPictures_text")
      )
      return
    }

    const hasPermission = await getWritePermission()
    if (!hasPermission) {
      log.warn("Can not convert document to PDF because the permission was not granted")
      Alert.alert(
        translate("warn"),
        translate("ConvertPdfOption_alert_noPermissionToConvertToPdf_text")
      )
      return
    }

    const documentPath = DocumentService.getPdfPath(document.name)

    const pdfFileExists = await RNFS.exists(documentPath)
    if (pdfFileExists) {
      try {
        await RNFS.unlink(documentPath)
      } catch (error) {
        log.error(`Error deleting PDF file with the same name of the document to be converted: "${stringfyError(error)}"`)
      }
    }

    const pictureList: string[] = pictures.map(item => (
      DocumentService.getPicturePath(item.fileName)
    ))

    await createAllFolders()
    PdfCreator.createPdf(pictureList, documentPath, {
      imageCompressQuality: 100 - compressionValue,
      temporaryPath: Constants.fullPathTemporaryCompressedPicture,
    })
  }


  function onOptionChange(newValue: DocumentPdfCompressionLevel) {
    switch (newValue as DocumentPdfCompressionLevel) {
      case "high":
        setCompressionVisualValue(60)
        setCompressionValue(60)
        break
      case "low":
        setCompressionVisualValue(20)
        setCompressionValue(20)
        break
      case "custom":
      default:
        setCompressionVisualValue(0)
        setCompressionValue(0)
        break
    }
    setCompressionLevel(newValue)
  }


  return (
    <Dialog visible onDismiss={goBack}>
      <Dialog.Title>
        {translate("ConvertPdfOption_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyMedium"} style={{ marginBottom: 16 }}>
          {translate("ConvertPdfOption_description")}
        </Text>

        <RadioButton.Group
          value={compressionLevel}
          onValueChange={value => onOptionChange(value as DocumentPdfCompressionLevel)}
        >
          <RadioButton.Item
            label={translate("ConvertPdfOption_highCompression")}
            value={"high"}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ConvertPdfOption_lowCompression")}
            value={"low"}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ConvertPdfOption_customCompression")}
            value={"custom"}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>

        <View style={styles.viewSlider}>
          <Text
            disabled={isSliderDisabled}
            style={styles.compressionText(isSliderDisabled)}
            children={`${compressionVisualValue}%`}
          />

          <Slider
            disabled={isSliderDisabled}
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={compressionValue}
            onSlidingComplete={value => setCompressionValue(value)}
            onValueChange={value => setCompressionVisualValue(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.onBackground}
            thumbTintColor={(
              compressionLevel === "custom" ? colors.primary : colors.onSurface
            )}
          />
        </View>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          children={translate("cancel")}
          onPress={goBack}
        />

        <Button
          children={translate("ok")}
          onPress={() => {
            convertToPdf()
            goBack()
          }}
        />
      </Dialog.Actions>
    </Dialog>
  )
}
