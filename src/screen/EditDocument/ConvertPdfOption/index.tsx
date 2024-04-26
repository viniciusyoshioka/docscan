import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Alert, View } from "react-native"
import { Button, Dialog, RadioButton, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { useBackHandler } from "@hooks"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { useAppTheme } from "@theme"
import { stringifyError } from "@utils"
import { NoPicturesAvaialbleError, NoWritePermissionError } from "./errors"
import { stylesheet } from "./style"
import { useConvertToPdf } from "./useConvertToPdf"


type CompressionLevel = "low" | "high" | "custom"

const LOW_COMPRESSION = 20
const HIGHT_COMPRESSION = 60
const DEFAULT_COMPRESSION = HIGHT_COMPRESSION
const DEFAULT_COMPRESSION_LEVEL: CompressionLevel = "high"


export function ConvertPdfOption() {


  const navigation = useNavigation<NavigationProps<"ConvertPdfOption">>()
  const { styles } = useStyles(stylesheet)

  const log = useLogger()
  const { colors } = useAppTheme()
  const convertToPdf = useConvertToPdf()

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

  async function handleConvertToPdf() {
    try {
      await convertToPdf(compression)
      goBack()
    } catch (error) {
      if (error instanceof NoPicturesAvaialbleError) {
        log.info(`No pictures available to convert to PDF: "${stringifyError(error)}"`)
        Alert.alert(
          translate("warn"),
          translate("ConvertPdfOption_alert_documentWithoutPictures_text")
        )
      } else if (error instanceof NoWritePermissionError) {
        log.error(`No write permission to convert to PDF: "${stringifyError(error)}"`)
        Alert.alert(
          translate("warn"),
          translate("ConvertPdfOption_alert_noPermissionToConvertToPdf_text")
        )
      } else {
        log.error(`Unexpected error converting document to PDF: "${stringifyError(error)}"`)
        Alert.alert(
          translate("warn"),
          translate("ConvertPdfOption_alert_unexpectedErrorConvertingToPdf_text")
        )
      }
    }
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
          onPress={handleConvertToPdf}
        />
      </Dialog.Actions>
    </Dialog>
  )
}
