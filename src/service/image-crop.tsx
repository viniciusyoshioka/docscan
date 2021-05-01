import React, { Component, createRef, ReactElement } from "react"
import { findNodeHandle, NativeSyntheticEvent, requireNativeComponent, StyleProp, UIManager, ViewStyle } from "react-native"


const RNImageCrop = requireNativeComponent("RNImageCrop")


export interface ImageCropProps {
    style?: StyleProp<ViewStyle>,
    sourceUrl: string,
    keepAspectRatio?: boolean,
    aspectRatio?: {
        width: number;
        height: number
    },
    onImageSaved?: (response: imageSavedResponse) => void,
    onSaveImageError?: (response: string) => void,
}

export interface imageSavedResponse {
    uri: string,
    width: number,
    height: number,
}

export interface saveImageErrorResponse {
    message: string,
}


export class ImageCrop extends Component<ImageCropProps> {


    constructor(props: ImageCropProps) {
        super(props)
    }


    public static defaultProps = {
        keepAspectRatio: false,
    }


    cropImageRef = createRef<ImageCrop>()


    saveImage = (quality = 100, preserveTransparency = true): void => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.cropImageRef.current),
            UIManager.getViewManagerConfig("RNImageCrop").Commands.saveImage,
            [quality, preserveTransparency]
        )
    }

    rotateImage = (clockwise = true): void => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.cropImageRef.current),
            UIManager.getViewManagerConfig("RNImageCrop").Commands.rotateImage,
            [clockwise]
        )
    }


    render(): ReactElement {
        const { style, sourceUrl, keepAspectRatio, aspectRatio, onImageSaved, onSaveImageError } = this.props

        return (
            <RNImageCrop
                ref={this.cropImageRef}
                style={style}
                sourceUrl={sourceUrl}
                keepAspectRatio={keepAspectRatio}
                aspectRatio={aspectRatio}
                onImageSaved={(event: NativeSyntheticEvent<imageSavedResponse>) => {
                    if (onImageSaved) {
                        onImageSaved(event.nativeEvent)
                    }
                }}
                onSaveImageError={(event: NativeSyntheticEvent<saveImageErrorResponse>) => {
                    if (onSaveImageError) {
                        onSaveImageError(event.nativeEvent.message)
                    }
                }}
            />
        )
    }
}
