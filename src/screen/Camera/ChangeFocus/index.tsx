import React from "react"
import Slider from "@react-native-community/slider"

import { FocusText, FocusTextTitle, HView } from "./style"
import { Modal, ModalProps } from "../../../component/Modal"


export interface ChangeFocusProps extends ModalProps {
    value: number
    onSliderValueChange: (value: number) => void,
    onSliderReleased: (value: number) => void
}


export default function ChangeFocus(props: ChangeFocusProps) {
    return (
        <Modal {...props}>
            <>
                <HView>
                    <FocusTextTitle>
                        Profundidade do Foco
                    </FocusTextTitle>
                </HView>

                <HView>
                    <FocusText>0</FocusText>

                    <Slider 
                        style={{width: 220}}
                        minimumTrackTintColor={"rgb(255, 255, 255)"}
                        thumbTintColor={"rgb(255, 255, 255)"}
                        maximumTrackTintColor={"rgb(255, 255, 255)"}
                        value={props.value}
                        minimumValue={0}
                        maximumValue={1}
                        onValueChange={props.onSliderValueChange}
                        onSlidingComplete={props.onSliderReleased}
                    />

                    <FocusText>1</FocusText>
                </HView>
            </>
        </Modal>
    )    
}
