import React from "react"

import { CameraControlAction, CameraControlButton, CameraControlView } from "../../components"


export interface CameraControlProps {
    screenAction?: "replace-picture";
    pictureListLength: number;
    addPictureFromGallery: () => void;
    takePicture: () => void;
    editDocument: () => void;
}


export function CameraControl(props: CameraControlProps) {
    return (
        <CameraControlView>
            <CameraControlButton
                icon={"collections"}
                onPress={props.addPictureFromGallery}
            />


            <CameraControlAction onPress={props.takePicture} />


            {props?.screenAction !== "replace-picture" && (
                <CameraControlButton
                    icon={"description"}
                    indexCount={props.pictureListLength.toString()}
                    onPress={props.editDocument}
                />
            )}

            {props?.screenAction === "replace-picture" && (
                <CameraControlButton />
            )}
        </CameraControlView>
    )
}
