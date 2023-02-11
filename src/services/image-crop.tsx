/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createRef, PureComponent } from "react"
import { findNodeHandle, NativeSyntheticEvent, requireNativeComponent, UIManager, ViewProps } from "react-native"


export type OnImageSavedResponse = {
    uri: string;
    width: number;
    height: number;
}


export type OnSaveImageErrorResponse = {
    message: string;
}


export interface ImageCropProps extends ViewProps {
    sourceUrl: string;
    keepAspectRatio?: boolean;
    aspectRatio?: {
        width: number;
        height: number;
    };
    onSaveImage?: (response: OnImageSavedResponse) => void;
    onCropError?: (response: string) => void;
}


interface ImageCropViewManagerProps extends ViewProps {
    sourceUrl: string;
    keepAspectRatio?: boolean;
    aspectRatio?: {
        width: number;
        height: number;
    };
    onImageSaved?: (response: NativeSyntheticEvent<OnImageSavedResponse>) => void;
    onSaveImageError?: (response: NativeSyntheticEvent<OnSaveImageErrorResponse>) => void;
}


const ImageCropViewManager = requireNativeComponent<ImageCropViewManagerProps>("ImageCropView")


export class ImageCrop extends PureComponent<ImageCropProps> {


    constructor(props: ImageCropProps) {
        super(props)
    }


    public static defaultProps = {
        keepAspectRatio: false,
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private imageCropRef = createRef<any>()


    saveImage = () => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.imageCropRef.current!),
            UIManager.getViewManagerConfig("ImageCropView").Commands.saveImage,
            []
        )
    }


    render() {
        const { style, sourceUrl, keepAspectRatio, aspectRatio, onSaveImage, onCropError } = this.props

        return (
            <ImageCropViewManager
                ref={this.imageCropRef}
                style={style}
                sourceUrl={sourceUrl}
                keepAspectRatio={keepAspectRatio}
                aspectRatio={aspectRatio}
                onImageSaved={(event: NativeSyntheticEvent<OnImageSavedResponse>) => {
                    onSaveImage!(event.nativeEvent)
                }}
                onSaveImageError={(event: NativeSyntheticEvent<OnSaveImageErrorResponse>) => {
                    onCropError!(event.nativeEvent.message)
                }}
            />
        )
    }
}
