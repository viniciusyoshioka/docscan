import Slider from "@react-native-community/slider"
import React, { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { Modal, ModalButton, ModalDescription, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, RadioButton } from "../../../components"
import { translate } from "../../../locales"
import { useAppTheme } from "../../../services/theme"
import { DocumentPdfCompressionLevel } from "../../../types"
import { CompressionText, ViewSlider } from "./style"


export interface ConvertPdfOptionProps extends ModalProps {
    convertToPdf: (quality: number) => void;
}


export function ConvertPdfOption(props: ConvertPdfOptionProps) {


    const { color, opacity } = useAppTheme()

    const [compressionVisualValue, setCompressionVisualValue] = useState(40)
    const [compressionValue, setCompressionValue] = useState(40)
    const [compressionLevel, setCompressionLevel] = useState<DocumentPdfCompressionLevel>("high")


    useEffect(() => {
        setCompressionVisualValue(40)
        setCompressionValue(40)
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

            <ModalViewContent>
                <RadioButton
                    text={translate("ConvertPdfOption_highCompression")}
                    value={compressionLevel === "high"}
                    onPress={() => {
                        setCompressionLevel("high")
                        setCompressionVisualValue(40)
                        setCompressionValue(40)
                    }}
                />

                <RadioButton
                    text={translate("ConvertPdfOption_lowCompression")}
                    value={compressionLevel === "low"}
                    onPress={() => {
                        setCompressionLevel("low")
                        setCompressionVisualValue(80)
                        setCompressionValue(80)
                    }}
                />

                <RadioButton
                    text={translate("ConvertPdfOption_customCompression")}
                    value={compressionLevel === "custom"}
                    onPress={() => {
                        setCompressionLevel("custom")
                        setCompressionVisualValue(100)
                        setCompressionValue(100)
                    }}
                />

                <ViewSlider>
                    <CompressionText disabled={!(compressionLevel === "custom")}>
                        {compressionVisualValue}%
                    </CompressionText>

                    <Slider
                        disabled={!(compressionLevel === "custom")}
                        style={{ flex: 1, opacity: opacity.highEmphasis }}
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        value={compressionValue}
                        onSlidingComplete={value => setCompressionValue(value)}
                        onValueChange={value => setCompressionVisualValue(value)}
                        minimumTrackTintColor={color.screen_color}
                        maximumTrackTintColor={color.screen_color}
                        thumbTintColor={color.screen_color}
                    />
                </ViewSlider>
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={translate("cancel")}
                    onPress={props.onRequestClose}
                />

                <ModalButton
                    text={translate("ok")}
                    onPress={() => {
                        props.convertToPdf(compressionValue)
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalViewButton>
        </Modal>
    )
}
