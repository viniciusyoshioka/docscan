import styled from "styled-components/native"

import { ModalButton, ModalButtonBase, ModalButtonProps, ModalButtonTextBase } from "./ModalButton"
import { styledProps } from "../../service/theme"


export const ModalView = styled.View`
    display: flex;
    padding: 5px 7px 5px 7px;
`


export const ModalTitle = styled.Text`
    font-size: 17px;
    color: ${(props: styledProps) => props.theme.color.color};
`


export const ModalViewContent = styled.View`
    display: flex;
    align-items: center;
    margin: 5px 0px 5px 0px;
`


export const ModalViewButton = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`


export type { ModalButtonProps }
export { ModalButton, ModalButtonBase, ModalButtonTextBase }
