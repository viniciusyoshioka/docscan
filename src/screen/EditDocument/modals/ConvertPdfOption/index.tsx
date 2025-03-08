import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Button, Dialog, RadioButton, Text } from "react-native-paper"

import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { useAppTheme } from "@theme"
import { useConvertToPdf } from "./hooks"
import { CompressionLevel } from "./types"
import { compressionValueFromLevel } from "./utils"


const initialCompressionLevel = CompressionLevel.HIGH
const initialCompressionValue = compressionValueFromLevel[initialCompressionLevel]


export function ConvertPdfOption() {


  const navigation = useNavigation<NavigationProps<"ConvertPdfOption">>()

  const { colors } = useAppTheme()

  const [compressionLevel, setCompressionLevel] = useState(initialCompressionLevel)
  const [compressionValue, setCompressionValue] = useState(initialCompressionValue)
  const [compressionVisualValue, setCompressionVisualValue] = useState(initialCompressionValue)
  const isCustomCompression = compressionLevel === CompressionLevel.CUSTOM
  const isSliderDisabled = !isCustomCompression


  const convertToPdf = useConvertToPdf()

  function onOptionChange(value: string) {
    const newCompressionLevel = value as CompressionLevel
    const newCompressionValue = compressionValueFromLevel[newCompressionLevel]

    setCompressionLevel(newCompressionLevel)
    setCompressionValue(newCompressionValue)
    setCompressionVisualValue(newCompressionValue)
  }

  function goBack() {
    navigation.goBack()
    return true
  }

  async function onConvertToPdf() {
    await convertToPdf()
    goBack()
  }


  useBackHandler(goBack)


  return (
    <Dialog visible onDismiss={goBack}>
      <Dialog.Title>
        {translate("ConvertPdfOption_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyMedium"} style={{ marginBottom: 16 }}>
          {translate("ConvertPdfOption_description")}
        </Text>

        <RadioButton.Group value={compressionLevel} onValueChange={onOptionChange}>
          <RadioButton.Item
            label={translate("ConvertPdfOption_highCompression")}
            value={CompressionLevel.HIGH}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={translate("ConvertPdfOption_lowCompression")}
            value={CompressionLevel.LOW}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={`${translate("ConvertPdfOption_customCompression")} (${compressionVisualValue}%)`}
            value={CompressionLevel.CUSTOM}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>

        <Slider
          value={compressionValue}
          onSlidingComplete={value => setCompressionValue(value)}
          onValueChange={value => setCompressionVisualValue(value)}
          minimumValue={0}
          maximumValue={100}
          step={1}
          disabled={isSliderDisabled}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.onBackground}
          thumbTintColor={isCustomCompression ? colors.primary : colors.onSurface}
          style={{ marginVertical: 16, marginHorizontal: -16 }}
        />
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={goBack}>
          {translate("cancel")}
        </Button>

        <Button onPress={onConvertToPdf}>
          {translate("ok")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
