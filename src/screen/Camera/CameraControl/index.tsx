import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"

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


export interface CameraControlRef {
    disableAction: () => void;
    enableAction: () => void;
}


export const CameraControl = forwardRef((props: CameraControlProps, ref: ForwardedRef<CameraControlRef>) => {


    const [isActionEnabled, setIsActionEnabled] = useState(false)


    useImperativeHandle(ref, () => ({
        disableAction: () => setIsActionEnabled(false),
        enableAction: () => setIsActionEnabled(true),
    }))


    return (
        <ControlView isLayoutPositionAbsolute={props.isLayoutPositionAbsolute}>
            <ControlButton
                icon={"collections"}
                onPress={props.addPictureFromGallery}
            />


            <ControlAction
                disabled={!isActionEnabled}
                onPress={props.takePicture}
            />


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
})
