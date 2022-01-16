import React from "react"

import { ControlButton } from "./ControlButton"
import { ControlAction, ControlView } from "./style"


export interface CameraControlProps {
    screenAction?: "replace-picture";
    pictureListLength: number;
    addPictureFromGallery: () => void;
    takePicture: () => void;
    editDocument: () => void;
    isLayoutPositionAbsolute: boolean;
}


export function CameraControl(props: CameraControlProps) {
    return (
        <ControlView isLayoutPositionAbsolute={props.isLayoutPositionAbsolute}>
            <ControlButton
                icon={"collections"}
                onPress={props.addPictureFromGallery}
            />


            <ControlAction onPress={props.takePicture} />


            {props?.screenAction !== "replace-picture" && (
                <ControlButton
                    icon={"description"}
                    indexCount={props.pictureListLength.toString()}
                    onPress={props.editDocument}
                />
            )}

            {props?.screenAction === "replace-picture" && (
                <ControlButton />
            )}
        </ControlView>
    )
}
