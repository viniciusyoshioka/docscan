/* eslint-disable react/prop-types */
import React, { forwardRef, memo, Ref } from "react"
import { useIsFocused } from "@react-navigation/core"
import { RNCamera } from "react-native-camera"

import { flashType, whiteBalanceType } from "../../service/settings"
import { View } from "react-native"


export interface CameraViewProps {
    flash: flashType,
    whiteBalance: whiteBalanceType
}


export const CameraView = memo(forwardRef((props: CameraViewProps, ref: Ref<RNCamera>) => {


    const isFocused = useIsFocused()


    if (!isFocused) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "rgb(0, 0, 0)"
            }} />
        )
    }


    return (
        <RNCamera
            style={{flex: 1, overflow: "hidden"}}
            ref={ref}
            captureAudio={false}
            playSoundOnCapture={false}
            type={"back"}
            useNativeZoom={true}
            flashMode={props.flash}
            whiteBalance={props.whiteBalance}
        />
    )
}))
