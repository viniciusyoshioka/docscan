import { useRoute } from "@react-navigation/native"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDocumentModel } from "../../../database"
import { useDeviceOrientation } from "../../../hooks"
import { RouteParamProps } from "../../../router"
import { CONTROL_ACTION_SIZE, ControlAction } from "./ControlAction"
import { CONTROL_BUTTON_HEIGHT, ControlButton } from "./ControlButton"
import { CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA, CONTROL_VIEW_MIN_HEIGHT, CONTROL_VIEW_PADDING_VERTICAL, ControlView } from "./ControlView"


export const CAMERA_CONTROL_HEIGHT_WITH_CAMERA = Math.max(
    CONTROL_VIEW_MIN_HEIGHT,
    CONTROL_ACTION_SIZE + (2 * CONTROL_VIEW_PADDING_VERTICAL),
    CONTROL_BUTTON_HEIGHT + (2 * CONTROL_VIEW_PADDING_VERTICAL)
)


export const CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA = CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA


export interface CameraControlProps {
    isShowingCamera: boolean;
    addPictureFromGallery: () => void;
    takePicture: () => void;
    editDocument: () => void;
}


export interface CameraControlRef {
    disableAction: () => void;
    enableAction: () => void;
}


export const CameraControl = forwardRef((props: CameraControlProps, ref: ForwardedRef<CameraControlRef>) => {


    const { params } = useRoute<RouteParamProps<"Camera">>()

    const deviceOrientation = useDeviceOrientation()

    const { documentModel } = useDocumentModel()

    const [isActionEnabled, setIsActionEnabled] = useState(false)
    const rotationDegree = useSharedValue(0)
    const picturesCount = (documentModel?.pictures.length ?? 0).toString()


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


            {params?.screenAction !== "replace-picture" && (
                <Reanimated.View style={orientationStyle}>
                    <ControlButton
                        iconName={"description"}
                        indexCount={picturesCount}
                        onPress={props.editDocument}
                        isShowingCamera={props.isShowingCamera}
                    />
                </Reanimated.View>
            )}

            {params?.screenAction === "replace-picture" && (
                <ControlButton />
            )}
        </ControlView>
    )
})
