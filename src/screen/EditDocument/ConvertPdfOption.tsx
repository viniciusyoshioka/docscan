import React, { useEffect, useState } from "react"
import Slider from "@react-native-community/slider"
import styled from "styled-components/native"

import { ModalButton, ModalDescription, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, MyModal, RadioButton } from "../../component"
import { styledProps, useTheme } from "../../service/theme"


type compressionLevelType = "low" | "high" | "custom"


const ViewCompressionText = styled.View`
    align-items: flex-start;
    justify-content: center;
    width: 40px;
`


const CompressionText = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.screen_color};
    opacity: ${(props: styledProps) => props.theme.opacity.highEmphasis};
`


const ViewSlider = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 56px;
`


export interface ConvertPdfOptionProps extends ModalProps {
    convertToPdf: (quality: number) => void,
}


export function ConvertPdfOption(props: ConvertPdfOptionProps) {


    const { color, opacity } = useTheme()

    const [compressionVisualValue, setCompressionVisualValue] = useState(40)
    const [compressionValue, setCompressionValue] = useState(40)
    const [compressionLevel, setCompressionLevel] = useState<compressionLevelType>("high")


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
