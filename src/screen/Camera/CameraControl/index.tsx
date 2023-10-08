import { useRoute } from "@react-navigation/native"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDocumentModel } from "@database"
import { useDeviceOrientation } from "@hooks"
import { RouteParamProps } from "@router"
import { ControlAction } from "./ControlAction"
import { ControlButton } from "./ControlButton"
import { ControlView } from "./ControlView"


export * from "./useCameraControlDimensions"


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
                    icon={"image-multiple-outline"}
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
                        icon={"file-document-outline"}
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
