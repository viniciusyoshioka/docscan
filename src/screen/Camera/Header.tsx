import React from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { Header, BlockLeft, headerIconSize } from "../../component/Header"
import { CameraControlButtonBase } from "../../component/CameraControl"


export interface CameraHeaderProps {
    goBack: () => void,
}


export default function CameraHeader(props: CameraHeaderProps) {
    return (
        <Header style={{position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "transparent"}}>
            <BlockLeft>
                <CameraControlButtonBase onPress={() => props.goBack()}>
                    <Icon 
                        name={"md-arrow-back"} 
                        size={headerIconSize} 
                        color={"rgb(255, 255, 255)"}
                    />
                </CameraControlButtonBase>
            </BlockLeft>
        </Header>  
    )
}
