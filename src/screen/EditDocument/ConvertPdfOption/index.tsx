import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Alert, View } from "react-native"
import RNFS from "react-native-fs"
import { Button, Dialog, RadioButton, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { useDocumentModel } from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { PdfCreator } from "@services/pdf-creator"
import { getWritePermission } from "@services/permission"
import { useAppTheme } from "@theme"
import { stringifyError } from "@utils"
import { stylesheet } from "./style"


type CompressionLevel = "low" | "high" | "custom"

const LOW_COMPRESSION = 20
const HIGHT_COMPRESSION = 60
const DEFAULT_COMPRESSION = HIGHT_COMPRESSION
const DEFAULT_COMPRESSION_LEVEL: CompressionLevel = "high"


export function ConvertPdfOption() {


  const navigation = useNavigation<NavigationProps<"ConvertPdfOption">>()
  const { styles } = useStyles(stylesheet)
  const log = useLogger()

  const { documentModel } = useDocumentModel()
  const document = documentModel?.document ?? null
  const pictures = documentModel?.pictures ?? []

  const { colors } = useAppTheme()

  const [sliderValue, setSliderValue] = useState(DEFAULT_COMPRESSION)
  const [compression, setCompression] = useState(DEFAULT_COMPRESSION)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>(
    DEFAULT_COMPRESSION_LEVEL
  )
  const isSliderDisabled = compressionLevel !== "custom"


  useBackHandler(goBack)


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
        log.error(`Error deleting PDF file with the same name of the document to be converted: "${stringifyError(error)}"`)
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


  function onOptionChange(newValue: CompressionLevel) {
    let newCompression = 0

    if (newValue === "low") {
      newCompression = LOW_COMPRESSION
    } else if (newValue === "high") {
      newCompression = HIGHT_COMPRESSION
    }

    setSliderValue(newCompression)
    setCompression(newCompression)
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
          onValueChange={value => onOptionChange(value as CompressionLevel)}
        >
          <RadioButton.Item
            label={translate("ConvertPdfOption_highCompression")}
            value={"high" as CompressionLevel}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ConvertPdfOption_lowCompression")}
            value={"low" as CompressionLevel}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ConvertPdfOption_customCompression")}
            value={"custom" as CompressionLevel}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>

        <View style={styles.viewSlider}>
          <Text
            disabled={isSliderDisabled}
            style={styles.compressionText(isSliderDisabled)}
            children={`${sliderValue}%`}
          />

          <Slider
            disabled={isSliderDisabled}
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={compression}
            onSlidingComplete={value => setCompression(value)}
            onValueChange={value => setSliderValue(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.onBackground}
            thumbTintColor={(compressionLevel === "custom"
              ? colors.primary
              : colors.onSurface
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
