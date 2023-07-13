import { ComponentClass, ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Image, StyleProp, View, ViewStyle } from "react-native"
import FastImage, { FastImageProps } from "react-native-fast-image"
import RNFS from "react-native-fs"
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { ImageTools } from "../../../services/image-tools"
import { LoadingOverlay } from "./LoadingOverlay"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)

const perpendicularAngles = [0, 90, 180, 270, 360]


export interface ImageRotationProps {
    source: string;
    style?: StyleProp<ViewStyle>;
    onError?: (error?: unknown) => void;
}


export interface ImageRotationRef {
    rotateLeft: () => void;
    rotateRight: () => void;
    save: (pathToSave: string) => Promise<void>;
}


export const ImageRotation = forwardRef((props: ImageRotationProps, ref: ForwardedRef<ImageRotationRef>) => {


    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)
    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const isSaving = useSharedValue(false)
    const degree = useSharedValue(0)
    const scale = useSharedValue(1)

    const overlayLeft = useSharedValue(0)
    const overlayTop = useSharedValue(0)
    const overlayWidth = useSharedValue(0)
    const overlayHeight = useSharedValue(0)


    useImperativeHandle(ref, () => ({
        rotateLeft: () => rotate(-90),
        rotateRight: () => rotate(90),
        save: saveImage,
    }))


    function rotate(degreeToRotate: number) {
        const newDegree = degree.value + degreeToRotate
        let newScale = 1
        let newImageWidth = imageWidth
        let newImageHeight = imageHeight

        if (!perpendicularAngles.includes(Math.abs(newDegree))) {
            return
        }

        if (scale.value === 1) {
            const rotatedImageWidth = imageHeight
            const rotatedImageHeight = imageWidth

            newScale = windowWidth / rotatedImageWidth
            newImageWidth = rotatedImageWidth * newScale
            newImageHeight = rotatedImageHeight * newScale
            if (newImageHeight > windowHeight) {
                newScale = windowHeight / rotatedImageHeight
                newImageWidth = rotatedImageWidth * newScale
                newImageHeight = rotatedImageHeight * newScale
            }
        }

        overlayLeft.value = (windowWidth - newImageWidth) / 2
        overlayTop.value = (windowHeight - newImageHeight) / 2
        overlayWidth.value = newImageWidth
        overlayHeight.value = newImageHeight

        degree.value = withTiming(newDegree, { duration: 150 })
        scale.value = withTiming(newScale, { duration: 150 })
    }

    async function saveImage(pathToSave: string) {
        isSaving.value = true

        const imageUri = props.source.startsWith("file://")
            ? props.source.replace("file://", "")
            : props.source

        if (degree.value % 360 === 0) {
            await RNFS.copyFile(imageUri, pathToSave)
            isSaving.value = false
            return
        }

        await ImageTools.rotateDegree(imageUri, {
            angle: degree.value,
            pathToSave: pathToSave,
        })

        isSaving.value = false
    }


    const imageStyle = useAnimatedStyle(() => ({
        flex: 1,
        transform: [
            { rotate: `${degree.value}deg` },
            { scale: scale.value },
        ]
    }))

    const overlayStyle = useAnimatedStyle(() => ({
        left: overlayLeft.value,
        top: overlayTop.value,
        width: overlayWidth.value,
        height: overlayHeight.value,
        opacity: isSaving.value ? 1 : 0,
    }))


    useEffect(() => {
        function onSuccess(widthSize: number, heightSize: number) {
            const imageRatio = widthSize / heightSize

            let newImageWidth = windowWidth
            let newImageHeight = windowWidth / imageRatio
            if (newImageHeight > windowHeight) {
                newImageWidth = windowHeight * imageRatio
                newImageHeight = windowHeight
            }

            setImageWidth(newImageWidth)
            setImageHeight(newImageHeight)
        }

        if (windowWidth !== 0 && windowHeight !== 0) {
            Image.getSize(props.source, onSuccess, props.onError)
        }
    }, [windowWidth, windowHeight])


    return (
        <View style={[ { overflow: "hidden" }, props.style]}>
            <AnimatedFastImage
                source={{ uri: props.source }}
                resizeMode={"contain"}
                onLayout={event => {
                    setWindowWidth(event.nativeEvent.layout.width)
                    setWindowHeight(event.nativeEvent.layout.height)
                }}
                style={imageStyle}
            />

            <LoadingOverlay style={overlayStyle} />
        </View>
    )
})
