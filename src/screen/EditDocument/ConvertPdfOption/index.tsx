import { Button, Modal, ModalActions, ModalContent, ModalDescription, ModalProps, ModalTitle, RadioListItem } from "@elementium/native"
import Slider from "@react-native-community/slider"
import { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { translate } from "../../../locales"
import { useAppTheme } from "../../../theme"
import { CompressionText, ViewSlider } from "./style"


export type DocumentPdfCompressionLevel = "low" | "high" | "custom"


export interface ConvertPdfOptionProps extends ModalProps {
    convertToPdf: (quality: number) => void;
}


export function ConvertPdfOption(props: ConvertPdfOptionProps) {


    const { color } = useAppTheme()

    const [compressionVisualValue, setCompressionVisualValue] = useState(60)
    const [compressionValue, setCompressionValue] = useState(60)
    const [compressionLevel, setCompressionLevel] = useState<DocumentPdfCompressionLevel>("high")


    useEffect(() => {
        setCompressionVisualValue(60)
        setCompressionValue(60)
        setCompressionLevel("high")
    }, [props.visible])


    return (
        <Modal {...props}>
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
                    onPress={props.onRequestClose}
                />

                <Button
                    variant={"text"}
                    text={translate("ok")}
                    onPress={() => {
                        props.convertToPdf(100 - compressionValue)
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalActions>
        </Modal>
    )
}
