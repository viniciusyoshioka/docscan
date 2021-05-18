import React from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { CameraControlButton, CameraControlButtonBase, cameraControlIconSize, CameraControlView, CameraControlViewButtonIndex, IndexControl } from "../../component/CameraControl"


export interface CameraControlProps {
    screenAction?: "replace-picture",
    pictureListLength: number,
    addPictureFromGalery: () => void,
    takePicture: () => void,
    editDocument: () => void,
}


export function CameraControl(props: CameraControlProps) {
    return (
        <CameraControlView style={{position: "absolute", bottom: 0, left: 0, right: 0}}>
            <CameraControlButton
                iconName={"md-image-outline"}
                onPress={props.addPictureFromGalery}
            />


            <CameraControlButtonBase 
                onPress={props.takePicture} 
                style={{backgroundColor: "rgb(255, 255, 255)"}}
            />


            {props?.screenAction !== "replace-picture" && (
                <CameraControlButtonBase onPress={props.editDocument}>
                    <CameraControlViewButtonIndex>
                        <Icon
                            name={"md-document-outline"}
                            size={cameraControlIconSize}
                            color={"rgb(255, 255, 255)"}
                        />

                        <IndexControl>
                            {props.pictureListLength.toString()}
                        </IndexControl>
                    </CameraControlViewButtonIndex>
                </CameraControlButtonBase>
            )}

            {props?.screenAction === "replace-picture" && (
                <CameraControlButtonBase />
            )}
        </CameraControlView>
    )
}
