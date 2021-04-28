import React, { Component } from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { Header, BlockLeft, BlockRight, headerIconSize } from "../../component/Header"
import { cameraControlIconSize, CameraControlButtonBase } from "../../component/CameraControl"


export interface CameraHeaderProps {
    goBack: () => void,
    openSettings: () => void,
}


export class CameraHeader extends Component<CameraHeaderProps> {


    constructor(props: CameraHeaderProps) {
        super(props)
    }


    shouldComponentUpdate() {
        return false
    }


    render() {
        return (
            <Header style={{position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "transparent"}}>
                <BlockLeft>
                    <CameraControlButtonBase onPress={this.props.goBack}>
                        <Icon 
                            name={"md-arrow-back"} 
                            size={headerIconSize} 
                            color={"rgb(255, 255, 255)"}
                        />
                    </CameraControlButtonBase>
                </BlockLeft>

                <BlockRight>
                    <CameraControlButtonBase onPress={this.props.openSettings}>
                        <Icon 
                            name={"md-settings-outline"} 
                            size={cameraControlIconSize} 
                            color={"rgb(255, 255, 255)"}
                        />
                    </CameraControlButtonBase>
                </BlockRight>
            </Header>  
        )
    }
}
