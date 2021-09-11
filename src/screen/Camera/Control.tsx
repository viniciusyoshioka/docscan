import React from "react"
import { OrientationType, useDeviceOrientationChange } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { CameraControlAction, CameraControlButton, CameraControlView } from "../../component"


export interface CameraControlProps {
    screenAction?: "replace-picture";
    pictureListLength: number;
    addPictureFromGalery: () => void;
    takePicture: () => void;
    editDocument: () => void;
}


export function CameraControl(props: CameraControlProps) {


    const rotationDegree = useSharedValue(0)


    useDeviceOrientationChange((newOrientation: OrientationType) => {
        switch (newOrientation) {
            case "PORTRAIT":
                if (rotationDegree.value === 90) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 0
                }
                break
            case "PORTRAIT-UPSIDEDOWN":
                if (rotationDegree.value === 90) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 180
                }
                break
            case "LANDSCAPE-LEFT":
                if (rotationDegree.value === 0) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 90
                }
                break
            case "LANDSCAPE-RIGHT":
                if (rotationDegree.value === 0) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 270
                }
                break
        }
    })

    const animatedRotation = useDerivedValue(() => {
        return withTiming(rotationDegree.value, {
            duration: 300,
        })
    })

    const galleryStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${animatedRotation.value}deg` }
            ]
        }
    })

    const editDocumentStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${animatedRotation.value}deg` }
            ]
        }
    })


    return (
        <CameraControlView>
            <Reanimated.View style={galleryStyle}>
                <CameraControlButton
                    icon={"collections"}
                    onPress={props.addPictureFromGalery}
                />
            </Reanimated.View>


            <CameraControlAction onPress={props.takePicture} />


            {props?.screenAction !== "replace-picture" && (
                <Reanimated.View style={editDocumentStyle}>
                    <CameraControlButton
                        icon={"description"}
                        indexCount={props.pictureListLength.toString()}
                        onPress={props.editDocument}
                    />
                </Reanimated.View>
            )}

            {props?.screenAction === "replace-picture" && (
                <CameraControlButton />
            )}
        </CameraControlView>
    )
}
