import styled from "styled-components/native"

import { CAMERA_SETTINGS_BUTTON_HEIGHT } from "../CameraSettingsButton"


export const ModalView = styled.TouchableOpacity`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0);
`


export const ModalBackground = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
`


export const ModalContent = styled.ScrollView`
    max-height: ${3.3 * CAMERA_SETTINGS_BUTTON_HEIGHT}px;
`
