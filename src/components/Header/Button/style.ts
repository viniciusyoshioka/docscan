import { BorderlessButton } from "react-native-gesture-handler"
import styled from "styled-components/native"


export const HEADER_BUTTON_SIZE = 48
export const HEADER_BUTTON_RADIUS = HEADER_BUTTON_SIZE / 2


export const HeaderButtonBase = styled(BorderlessButton)`
    align-items: center;
    justify-content: center;
    width: ${HEADER_BUTTON_SIZE}px;
    height: ${HEADER_BUTTON_SIZE}px;
`
