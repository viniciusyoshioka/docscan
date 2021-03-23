import styled from "styled-components/native"

import { CameraControlButton, CameraControlButtonBase, CameraControlButtonProps } from "./ButtonControl"
import { CameraControlIconProps, cameraControlIconSize } from "./Icon"
import { styledProps } from "../../service/theme"


export const CameraControlView = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 5px;
    background-color: ${(props: styledProps) => props.theme.color.background};
`


export type { CameraControlButtonProps }
export { CameraControlButton, CameraControlButtonBase }
export type { CameraControlIconProps }
export { cameraControlIconSize }
