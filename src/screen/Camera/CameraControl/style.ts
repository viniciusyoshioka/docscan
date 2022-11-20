import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"


export const CONTROL_ACTION_HEIGHT = 56

export const ControlAction = styled(TouchableOpacity)`
    width: ${CONTROL_ACTION_HEIGHT}px;
    height: ${CONTROL_ACTION_HEIGHT}px;
    border-radius: ${CONTROL_ACTION_HEIGHT}px;
    background-color: ${props => props.disabled ? "rgb(200, 200, 200)" : "rgb(255, 255, 255)"};
    opacity: ${props => props.disabled ? 0.7 : 1};
`


export const CONTROL_VIEW_PADDING_VERTIVAL = 16
export const CONTROL_VIEW_MIN_HEIGHT = 56

export const ControlView = styled.View`
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
    background-color: rgba(0, 0, 0, 0.3);
`


export const CONTROL_BUTTON_HEIGHT = 48

export const ButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: ${CONTROL_BUTTON_HEIGHT}px;
    height: ${CONTROL_BUTTON_HEIGHT}px;
`


export const IndexView = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`


export const IndexText = styled.Text`
    margin-left: 6px;
    color: rgb(255, 255, 255);
`
