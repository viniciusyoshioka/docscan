import React from "react"

import { CameraControlAction, CameraControlButton, CameraControlView } from "../../component"


export interface CameraControlProps {
    screenAction?: "replace-picture",
    pictureListLength: number,
    addPictureFromGalery: () => void,
    takePicture: () => void,
    editDocument: () => void,
}


export function CameraControl(props: CameraControlProps) {
    return (
        <CameraControlView>
            <CameraControlButton
                icon={"collections"}
                onPress={props.addPictureFromGalery}
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
