import { Dimensions } from "react-native"
import styled from "styled-components/native"

import { HEADER_HEIGHT } from "../../../components"
import { getCameraSize } from "../utils"


const { width, height } = Dimensions.get("window")
const cameraSize = getCameraSize({ width, height }, "3:4")


export const CONTROL_VIEW_PADDING_VERTIVAL = 16
export const CONTROL_VIEW_MIN_HEIGHT = cameraSize
    ? height - HEADER_HEIGHT - cameraSize.height
    : 2 * CONTROL_VIEW_PADDING_VERTIVAL


export interface ControlViewProps {
    isShowingCamera: boolean;
}


export const ControlView = styled.View<ControlViewProps>`
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    width: 100%;
    min-height: ${CONTROL_VIEW_MIN_HEIGHT}px;
    padding-vertical: ${CONTROL_VIEW_PADDING_VERTIVAL}px;
    background-color: ${props => props.isShowingCamera ? "rgba(0, 0, 0, 0.4)" : "transparent"};
    z-index: 1;
`
