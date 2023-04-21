import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "../../../hooks"
import { ControlAction, CONTROL_ACTION_SIZE } from "./ControlAction"
import { ControlButton, CONTROL_BUTTON_HEIGHT } from "./ControlButton"
import { ControlView, CONTROL_VIEW_MIN_HEIGHT, CONTROL_VIEW_PADDING_VERTIVAL } from "./ControlView"


export const CAMERA_CONTROL_HEIGHT = Math.max(
    CONTROL_VIEW_MIN_HEIGHT,
    CONTROL_ACTION_SIZE + (2 * CONTROL_VIEW_PADDING_VERTIVAL),
    CONTROL_BUTTON_HEIGHT + (2 * CONTROL_VIEW_PADDING_VERTIVAL)
)


export interface CameraControlProps {
    screenAction?: "replace-picture";
    isShowingCamera: boolean;
    addPictureFromGallery: () => void;
    takePicture: () => void;
    editDocument: () => void;
    pictureListLength: number;
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
        <ControlView isShowingCamera={props.isShowingCamera}>
            <Reanimated.View style={orientationStyle}>
                <ControlButton
                    iconName={"collections"}
                    onPress={props.addPictureFromGallery}
                    isShowingCamera={props.isShowingCamera}
                />
            </Reanimated.View>


            <ControlAction
                disabled={!isActionEnabled}
                onPress={props.takePicture}
                isShowingCamera={props.isShowingCamera}
            />


            {props?.screenAction !== "replace-picture" && (
                <Reanimated.View style={orientationStyle}>
                    <ControlButton
                        iconName={"description"}
                        indexCount={props.pictureListLength.toString()}
                        onPress={props.editDocument}
                        isShowingCamera={props.isShowingCamera}
                    />
                </Reanimated.View>
            )}

            {props?.screenAction === "replace-picture" && (
                <ControlButton />
            )}
        </ControlView>
    )
})
