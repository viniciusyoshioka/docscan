import React, { Component } from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { CameraControlButtonBase, cameraControlIconSize, CameraControlView, CameraControlViewButtonIndex, IndexControl } from "../../component/CameraControl"


export interface CameraControlProps {
    screenAction?: "replace-picture",
    pictureListLength: number,
    addPictureFromGalery: () => void,
    takePicture: () => void,
    editDocument: () => void,
}


export class CameraControl extends Component<CameraControlProps> {


    constructor(props: CameraControlProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: CameraControlProps) {
        if (this.props.pictureListLength !== nextProps.pictureListLength) {
            return true
        } else if (this.props.screenAction !== nextProps.screenAction) {
            return true
        } else if (this.props.takePicture !== nextProps.takePicture) {
            return true
        }
        return false
    }


    render() {
        return (
            <CameraControlView style={{position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "transparent"}}>
                <CameraControlButtonBase onPress={this.props.addPictureFromGalery}>
                    <Icon 
                        name={"md-image-outline"} 
                        size={cameraControlIconSize} 
                        color={"rgb(255, 255, 255)"}
                    />
                </CameraControlButtonBase>


                <CameraControlButtonBase 
                    onPress={this.props.takePicture} 
                    style={{backgroundColor: "rgb(255, 255, 255)"}}
                />


                {this.props?.screenAction !== "replace-picture" && (
                    <CameraControlButtonBase onPress={this.props.editDocument}>
                        <CameraControlViewButtonIndex>
                            <Icon 
                                name={"md-document-outline"} 
                                size={cameraControlIconSize} 
                                color={"rgb(255, 255, 255)"}
                            />

                            <IndexControl>
                                {this.props.pictureListLength.toString()}
                            </IndexControl>
                        </CameraControlViewButtonIndex>
                    </CameraControlButtonBase>
                )}

                {this.props?.screenAction === "replace-picture" && (
                    <CameraControlButtonBase />
                )}
            </CameraControlView>
        )
    }
}
