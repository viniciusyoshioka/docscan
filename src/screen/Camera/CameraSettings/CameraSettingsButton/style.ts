import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"


export const CAMERA_SETTINGS_BUTTON_HEIGHT = 80

export const ButtonBase = styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: ${CAMERA_SETTINGS_BUTTON_HEIGHT}px;
    height: ${CAMERA_SETTINGS_BUTTON_HEIGHT}px;
    padding: 8px;
`


export const ButtonChildrenWrapper = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`


export const ButtonText = styled.Text`
    font-size: 13px;
    text-align: center;
    color: white;
`
