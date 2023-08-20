import { Button, ModalActions, ModalContainer, ModalContent, ModalDescription, ModalScrim, ModalTitle, RadioListItem } from "@elementium/native"
import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Alert } from "react-native"
import RNFS from "react-native-fs"

import { useDocumentModel } from "@database"
import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationParamProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { log, stringfyError } from "@services/log"
import { PdfCreator } from "@services/pdf-creator"
import { getWritePermission } from "@services/permission"
import { useAppTheme } from "@theme"
import { CompressionText, ViewSlider } from "./style"


type DocumentPdfCompressionLevel = "low" | "high" | "custom"


export function ConvertPdfOption() {


    const navigation = useNavigation<NavigationParamProps<"ConvertPdfOption">>()

    const { documentModel } = useDocumentModel()
    const document = documentModel?.document ?? null
    const pictures = documentModel?.pictures ?? []

    const { color } = useAppTheme()

    const [compressionVisualValue, setCompressionVisualValue] = useState(60)
    const [compressionValue, setCompressionValue] = useState(60)
    const [compressionLevel, setCompressionLevel] = useState<DocumentPdfCompressionLevel>("high")


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

        const pictureList: string[] = pictures.map(item => DocumentService.getPicturePath(item.fileName))

        await createAllFolders()
        PdfCreator.createPdf(pictureList, documentPath, {
            imageCompressQuality: 100 - compressionValue,
            temporaryPath: Constants.fullPathTemporaryCompressedPicture,
        })
    }


    return (
        <ModalScrim onPress={goBack}>
            <ModalContainer>
                <ModalTitle>
                    {translate("ConvertPdfOption_title")}
                </ModalTitle>

                <ModalDescription>
                    {translate("ConvertPdfOption_description")}
                </ModalDescription>

                <ModalContent>
                    <RadioListItem
                        title={translate("ConvertPdfOption_highCompression")}
                        value={compressionLevel === "high"}
                        onPress={() => {
                            setCompressionLevel("high")
                            setCompressionVisualValue(60)
                            setCompressionValue(60)
                        }}
                        style={{ backgroundColor: "transparent", paddingLeft: 0 }}
                    />

                    <RadioListItem
                        title={translate("ConvertPdfOption_lowCompression")}
                        value={compressionLevel === "low"}
                        onPress={() => {
                            setCompressionLevel("low")
                            setCompressionVisualValue(20)
                            setCompressionValue(20)
                        }}
                        style={{ backgroundColor: "transparent", paddingLeft: 0 }}
                    />

                    <RadioListItem
                        title={translate("ConvertPdfOption_customCompression")}
                        value={compressionLevel === "custom"}
                        onPress={() => {
                            setCompressionLevel("custom")
                            setCompressionVisualValue(0)
                            setCompressionValue(0)
                        }}
                        style={{ backgroundColor: "transparent", paddingLeft: 0 }}
                    />

                    <ViewSlider>
                        <CompressionText disabled={!(compressionLevel === "custom")}>
                            {compressionVisualValue}%
                        </CompressionText>

                        <Slider
                            disabled={compressionLevel !== "custom"}
                            style={{ flex: 1 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={compressionValue}
                            onSlidingComplete={value => setCompressionValue(value)}
                            onValueChange={value => setCompressionVisualValue(value)}
                            minimumTrackTintColor={color.primary}
                            maximumTrackTintColor={color.onBackground}
                            thumbTintColor={compressionLevel === "custom" ? color.primary : color.onSurface}
                        />
                    </ViewSlider>
                </ModalContent>

                <ModalActions>
                    <Button
                        variant={"text"}
                        text={translate("cancel")}
                        onPress={goBack}
                    />

                    <Button
                        variant={"text"}
                        text={translate("ok")}
                        onPress={() => {
                            convertToPdf()
                            goBack()
                        }}
                    />
                </ModalActions>
            </ModalContainer>
        </ModalScrim>
    )
}
