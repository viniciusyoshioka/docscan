import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"


export const CAMERA_SETTINGS_BUTTON_HEIGHT = 80


export const CameraSettingsButtonBase = styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: ${CAMERA_SETTINGS_BUTTON_HEIGHT}px;
    height: ${CAMERA_SETTINGS_BUTTON_HEIGHT}px;
    padding: 8px;
`
