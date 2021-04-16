import React, { createRef, PureComponent } from "react"
import { findNodeHandle, NativeSyntheticEvent, requireNativeComponent, StyleProp, UIManager, ViewStyle } from "react-native"


const RNImageCrop = requireNativeComponent("RNImageCrop")


interface Response {
    uri: string,
    width: number,
    height: number,
}


interface ImageCropProps {
    sourceUrl: string,
    style?: StyleProp<ViewStyle>,
    onImageCrop?: (res: Response) => void,
    keepAspectRatio?: boolean,
    aspectRatio?: {
        width: number;
        height: number
    },
}


interface saveImageOptions {
    quality: number,
    preserveTransparency: boolean,
}

const defaultSaveImageOptions: saveImageOptions = {
    quality: 100,
    preserveTransparency: true
}


export default class ImageCrop extends PureComponent<ImageCropProps> {


    public static defaultProps = {
        keepAspectRatio: false,
    }


    private viewRef = createRef<any>()


    public saveImage = (path: string, options: saveImageOptions = defaultSaveImageOptions) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.viewRef.current),
            UIManager.getViewManagerConfig("RNImageCrop").Commands.saveImage,
            [path, options]
        )
    }

    public rotateImage = (clockwise: boolean = true) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.viewRef.current),
            UIManager.getViewManagerConfig("RNImageCrop").Commands.rotateImage,
            [clockwise]
        )
    }


    public render() {
        const { sourceUrl, style, onImageCrop, keepAspectRatio, aspectRatio } = this.props

        return (
            <RNImageCrop
                ref={this.viewRef}
                sourceUrl={sourceUrl}
                style={style}
                onImageSaved={(event: NativeSyntheticEvent<Response>) => {
                    onImageCrop!(event.nativeEvent)
                }}
                keepAspectRatio={keepAspectRatio}
                cropAspectRatio={aspectRatio}
            />
        )
    }
}
