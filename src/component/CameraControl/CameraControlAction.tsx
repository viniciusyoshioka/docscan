import styled from "styled-components/native"


export const CameraControlAction = styled.TouchableOpacity`
    width: 48px;
    height: 48px;
    border-radius: 48px;
    background-color: ${props => props.disabled ? "rgb(200, 200, 200)" : "rgb(255, 255, 255)"};
    opacity: ${props => props.disabled ? 0.7 : 1};
`
