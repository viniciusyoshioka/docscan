import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styled from "styled-components/native"


const CameraControlButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
`


const IndexView = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`


const IndexText = styled.Text`
    margin-left: 6px;
    color: rgb(255, 255, 255);
`


export interface CameraControlButtonProps extends TouchableOpacityProps {
    icon?: string,
    size?: number,
    indexCount?: string,
}


export function CameraControlButton(props: CameraControlButtonProps) {
    return (
        <CameraControlButtonBase {...props}>
            <IndexView>
                {props.icon && (
                    <Icon
                        name={props.icon}
                        size={props.size || 24}
                        color={"rgb(255, 255, 255)"}
                    />
                )}

                {props.indexCount && (
                    <IndexText>
                        {props.indexCount}
                    </IndexText>
                )}
            </IndexView>
        </CameraControlButtonBase>
    )
}
