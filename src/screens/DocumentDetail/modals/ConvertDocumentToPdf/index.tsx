import Slider from '@react-native-community/slider'
import { Button, Dialog, RadioButton, Text } from 'react-native-paper'

import { useBackHandler } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { useAppTheme } from '@theme'
import { CompressionLevel } from './convert-document-to-pdf.constants.ts'
import { useCompressionData, useConvertDocumentToPdf, useGoBack } from './hooks'


export function ConvertDocumentToPdf() {


  const { t } = useLocale()
  const { colors } = useAppTheme()

  const compressionData = useCompressionData()

  const goBack = useGoBack()
  const convertDocumentToPdf = useConvertDocumentToPdf()


  useBackHandler(goBack)


  const highCompressionLabel = t(
    'ConvertDocumentToPdf_highCompression',
    { ns: Namespaces.APP },
  )
  const lowCompressionLabel = t(
    'ConvertDocumentToPdf_lowCompression',
    { ns: Namespaces.APP },
  )
  const customCompressionLabel = t(
    'ConvertDocumentToPdf_customCompression',
    { ns: Namespaces.APP },
  )
  const customCompressionLabelWithPercentage = `${customCompressionLabel} (${compressionData.compressionVisualValue}%)`


  return (
    <Dialog visible onDismiss={goBack}>
      <Dialog.Icon icon={'file-pdf-box'} />

      <Dialog.Title style={{ textAlign: 'center' }}>
        {t('ConvertDocumentToPdf_title', { ns: Namespaces.APP })}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={'bodyMedium'} style={{ marginBottom: 16 }}>
          {t('ConvertDocumentToPdf_description', { ns: Namespaces.APP })}
        </Text>

        <RadioButton.Group
          value={compressionData.compressionLevel}
          onValueChange={compressionData.onCompressionLevelChange}
        >
          <RadioButton.Item
            label={highCompressionLabel}
            value={CompressionLevel.HIGH}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={lowCompressionLabel}
            value={CompressionLevel.LOW}
            style={{ paddingHorizontal: 0 }}
          />

          <RadioButton.Item
            label={customCompressionLabelWithPercentage}
            value={CompressionLevel.CUSTOM}
            style={{ paddingHorizontal: 0 }}
          />
        </RadioButton.Group>

        <Slider
          value={compressionData.compressionValue}
          onSlidingComplete={compressionData.onCompressionValueChange}
          onValueChange={compressionData.onCompressionVisualValueChange}
          minimumValue={0}
          maximumValue={100}
          step={1}
          disabled={compressionData.isCustomCompressionDisabled}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.onBackground}
          thumbTintColor={
            compressionData.isCustomCompression
              ? colors.primary
              : colors.onSurface
          }
          style={{ marginVertical: 16, marginHorizontal: -16 }}
        />
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={goBack}>
          {t('cancel')}
        </Button>

        <Button onPress={convertDocumentToPdf}>
          {t('ok')}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
