import React, { useEffect, useState } from "react"
import Slider from "@react-native-community/slider"

import { ModalButton, ModalDescription, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, MyModal, RadioButton } from "../../../components"
import { useColorTheme } from "../../../services/theme"
import { DocumentPdfCompressionLevel } from "../../../types"
import { CompressionText, ViewCompressionText, ViewSlider } from "./style"


export interface ConvertPdfOptionProps extends ModalProps {
    convertToPdf: (quality: number) => void;
}


export function ConvertPdfOption(props: ConvertPdfOptionProps) {


    const { color, opacity } = useColorTheme()

    const [compressionVisualValue, setCompressionVisualValue] = useState(40)
    const [compressionValue, setCompressionValue] = useState(40)
    const [compressionLevel, setCompressionLevel] = useState<DocumentPdfCompressionLevel>("high")


    useEffect(() => {
        setCompressionVisualValue(40)
        setCompressionValue(40)
        setCompressionLevel("high")
    }, [props.visible])


    return (
        <MyModal {...props}>
            <>
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

                    {(compressionLevel === "custom") && (
                        <ViewSlider>
                            <ViewCompressionText>
                                <CompressionText>
                                    {compressionVisualValue}%
                                </CompressionText>
                            </ViewCompressionText>

                            <Slider
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
                    )}
                </ModalViewContent>

                <ModalViewButton>
                    <ModalButton
                        text={"Cancelar"}
                        onPress={() => props.setVisible(false)}
                    />

                    <ModalButton
                        text={"Ok"}
                        onPress={() => {
                            props.convertToPdf(compressionValue)
                            props.setVisible(false)
                        }}
                    />
                </ModalViewButton>
            </>
        </MyModal>
    )
}
