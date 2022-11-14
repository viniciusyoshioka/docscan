import React, { useEffect, useState } from "react"
import Slider from "@react-native-community/slider"

import { Modal, ModalButton, ModalDescription, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, RadioButton } from "../../../components"
import { useAppTheme } from "../../../services/theme"
import { DocumentPdfCompressionLevel } from "../../../types"
import { CompressionText, ViewSlider } from "./style"


export interface ConvertPdfOptionProps extends ModalProps {
    convertToPdf: (quality: number) => void;
}


export const ConvertPdfOption = (props: ConvertPdfOptionProps) => {


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
                Converter para PDF
            </ModalTitle>

            <ModalDescription>
                Escolha a compressão das imagens do documento
            </ModalDescription>

            <ModalViewContent>
                <RadioButton
                    text={"Alta"}
                    value={compressionLevel === "high"}
                    onPress={() => {
                        setCompressionLevel("high")
                        setCompressionVisualValue(40)
                        setCompressionValue(40)
                    }}
                />

                <RadioButton
                    text={"Baixa"}
                    value={compressionLevel === "low"}
                    onPress={() => {
                        setCompressionLevel("low")
                        setCompressionVisualValue(80)
                        setCompressionValue(80)
                    }}
                />

                <RadioButton
                    text={"Personalizada"}
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
                        onSlidingComplete={(value) => setCompressionValue(value)}
                        onValueChange={(value) => setCompressionVisualValue(value)}
                        minimumTrackTintColor={color.screen_color}
                        maximumTrackTintColor={color.screen_color}
                        thumbTintColor={color.screen_color}
                    />
                </ViewSlider>
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={"Cancelar"}
                    onPress={props.onRequestClose}
                />

                <ModalButton
                    text={"Ok"}
                    onPress={() => {
                        props.convertToPdf(compressionValue)
                        if (props.onRequestClose) {
                            props.onRequestClose()
                        }
                    }}
                />
            </ModalViewButton>
        </Modal>
    )
}
