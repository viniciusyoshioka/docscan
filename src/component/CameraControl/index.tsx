import styled from "styled-components/native"

import { CameraControlButton, CameraControlButtonBase, CameraControlViewButtonIndex, CameraControlButtonProps } from "./ButtonControl"
import { cameraControlIconColor, CameraControlIconProps, cameraControlIconSize } from "./Icon"
import { IndexControl, IndexControlBase, IndexControlProps } from "./IndexControl"


export const CameraControlView = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 5px;
`


export type { CameraControlButtonProps }
export { CameraControlButton, CameraControlButtonBase, CameraControlViewButtonIndex }

export type { CameraControlIconProps }
export { cameraControlIconColor, cameraControlIconSize }

export type { IndexControlProps }
export { IndexControl, IndexControlBase }
