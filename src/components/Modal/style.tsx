import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const ModalView = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`


export const ModalContent = styled.TouchableOpacity`
    width: 80%;
    border-radius: 6px;
    background-color: ${(props: StyledProps) => props.theme.color.modal_background};
    elevation: 6;
`
