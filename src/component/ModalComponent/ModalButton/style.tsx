import styled from "styled-components/native"

import { styledProps } from "../../../service/theme"


export const ModalButtonBase = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1px;
    min-width: 50px;
    max-height: 30px;
    margin: 0px 3px;
    padding: 3px 5px;
`


export const ModalButtonTextBase = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.color};
`
