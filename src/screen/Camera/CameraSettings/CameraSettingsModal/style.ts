import styled from "styled-components/native"

import { StyledProps } from "../../../../theme"
import { CAMERA_CONTROL_HEIGHT_WITH_CAMERA } from "../../CameraControl"
import { CAMERA_SETTINGS_BUTTON_HEIGHT } from "../CameraSettingsButton"


export const PseudoModal = styled.TouchableOpacity`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    align-items: center;
    justify-content: flex-end;
    padding: 16px;
    z-index: 1;
`


export const ModalBackground = styled.TouchableOpacity<StyledProps>`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-bottom: ${CAMERA_CONTROL_HEIGHT_WITH_CAMERA}px;
    border-radius: ${props => props.theme.shape.medium}px;
    background-color: rgba(0, 0, 0, 0.5);
`


export const ModalContent = styled.ScrollView`
    max-height: ${1.5 * CAMERA_SETTINGS_BUTTON_HEIGHT}px;
`


export const ModalContentWrapper = styled.TouchableOpacity`
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`
