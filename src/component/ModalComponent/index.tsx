import styled from "styled-components/native"

import { ModalButton, ModalButtonBase, ModalButtonProps, ModalButtonTextBase } from "./ModalButton"
import { styledProps } from "../../service/theme"


export const ModalView = styled.View``


export const ModalTitle = styled.Text`
    margin-horizontal: 16px;
    margin-vertical: 12px;
    font-size: 18px;
    color: ${(props: styledProps) => props.theme.color.modal_color};
`


export const ModalViewContent = styled.View`
    align-items: center;
    margin-horizontal: 16px;
`


export const ModalViewButton = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 8px;
`


export type { ModalButtonProps }
export { ModalButton, ModalButtonBase, ModalButtonTextBase }
