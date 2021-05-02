import styled from "styled-components/native"

import { CameraControlButton, CameraControlButtonBase, CameraControlViewButtonIndex, CameraControlButtonProps } from "./ButtonControl"
import { cameraControlIconColor, CameraControlIconProps, cameraControlIconSize } from "./Icon"
import { IndexControl, IndexControlBase, IndexControlProps } from "./IndexControl"
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
export { CameraControlButton, CameraControlButtonBase, CameraControlViewButtonIndex }

export type { CameraControlIconProps }
export { cameraControlIconColor, cameraControlIconSize }

export type { IndexControlProps }
export { IndexControl, IndexControlBase }
