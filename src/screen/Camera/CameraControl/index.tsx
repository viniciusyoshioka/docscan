import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "../../../hooks"
import { ControlButton } from "./ControlButton"
import { ControlAction, ControlView, CONTROL_ACTION_HEIGHT, CONTROL_BUTTON_HEIGHT, CONTROL_VIEW_MIN_HEIGHT, CONTROL_VIEW_PADDING_VERTIVAL } from "./style"


export const CAMERA_CONTROL_HEIGHT = Math.max(
    CONTROL_VIEW_MIN_HEIGHT,
    CONTROL_ACTION_HEIGHT + (2 * CONTROL_VIEW_PADDING_VERTIVAL),
    CONTROL_BUTTON_HEIGHT + (2 * CONTROL_VIEW_PADDING_VERTIVAL)
)


export interface CameraControlProps {
    screenAction?: "replace-picture";
    pictureListLength: number;
    addPictureFromGallery: () => void;
    takePicture: () => void;
    editDocument: () => void;
}


export interface CameraControlRef {
    disableAction: () => void;
    enableAction: () => void;
}


export const CameraControl = forwardRef((props: CameraControlProps, ref: ForwardedRef<CameraControlRef>) => {


    const deviceOrientation = useDeviceOrientation()

    const [isActionEnabled, setIsActionEnabled] = useState(false)
    const rotationDegree = useSharedValue(0)


    useImperativeHandle(ref, () => ({
        disableAction: () => setIsActionEnabled(false),
        enableAction: () => setIsActionEnabled(true),
    }))


    useEffect(() => {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 0
                }
                break
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 180
                }
                break
            case OrientationType["LANDSCAPE-LEFT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 90
                }
                break
            case OrientationType["LANDSCAPE-RIGHT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 270
                }
                break
        }
    }, [deviceOrientation])

    const animatedRotation = useDerivedValue(() => withTiming(rotationDegree.value, {
        duration: 200,
    }))

    const orientationStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${animatedRotation.value}deg` },
        ],
    }))


    return (
        <ControlView>
            <Reanimated.View style={orientationStyle}>
                <ControlButton
                    icon={"collections"}
                    onPress={props.addPictureFromGallery}
                />
            </Reanimated.View>


            <ControlAction
                disabled={!isActionEnabled}
                onPress={props.takePicture}
            />


            {props?.screenAction !== "replace-picture" && (
                <Reanimated.View style={orientationStyle}>
                    <ControlButton
                        icon={"description"}
                        indexCount={props.pictureListLength.toString()}
                        onPress={props.editDocument}
                    />
                </Reanimated.View>
            )}

            {props?.screenAction === "replace-picture" && (
                <ControlButton />
            )}
        </ControlView>
    )
})
