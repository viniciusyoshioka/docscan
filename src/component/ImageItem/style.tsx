import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const Button = styled(RectButton)`
    aspect-ratio: 1;
`


export const ViewCheckBox = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0px;
    left: 0px;
`


export const CheckboxBackground = styled.View`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 33px;
    height: 33px;
    opacity: 0.7;
    border-bottom-right-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`
