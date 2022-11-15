import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"


export const ControlAction = styled(TouchableOpacity)`
    width: 56px;
    height: 56px;
    border-radius: 56px;
    background-color: ${props => props.disabled ? "rgb(200, 200, 200)" : "rgb(255, 255, 255)"};
    opacity: ${props => props.disabled ? 0.7 : 1};
`


export const ControlView = styled.View`
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    width: 100%;
    min-height: 56px;
    padding-vertical: 16px;
    background-color: rgba(0, 0, 0, 0.3);
`


export const ButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
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
