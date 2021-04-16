import React, { Component } from "react"
import { findNodeHandle, NativeModules, requireNativeComponent, StyleProp, ViewStyle } from "react-native"


const RNImageCrop = requireNativeComponent("RNImageCrop")
const RNImageCropModule = NativeModules.ImageCropModule


export interface ImageCropProps {
    style?: StyleProp<ViewStyle>,
    sourceUrl: string,
    keepAspectRatio?: boolean,
    aspectRatio?: {
        width: number;
        height: number
    },
}

export interface saveImageOptions {
    path?: string,
    quality?: number,
    preserveTransparency?: boolean,
}

const defaultSaveImageOptions: saveImageOptions = {
    path: "",
    quality: 100,
    preserveTransparency: true
}


export default class ImageCrop extends Component<ImageCropProps> {


    constructor(props: ImageCropProps) {
        super(props)
    }


    public static defaultProps = {
        keepAspectRatio: false,
    }


    _ref: any = null
    _imageCropHandle: any = null


    _setRef = (ref: any) => {
        if (ref) {
            this._ref = ref
            this._imageCropHandle = findNodeHandle(ref)
        } else {
            this._ref = null
            this._imageCropHandle = null
        }
    }


    saveImage = async (options: saveImageOptions = defaultSaveImageOptions): Promise<string> => {
        if (!this._imageCropHandle) {
            throw 'ImageCrop is null'
        }
        return await RNImageCropModule.saveImage(options, this._imageCropHandle)
    }

    rotateImage = (clockwise: boolean = true): void => {
        if (!this._imageCropHandle) {
            throw 'ImageCrop is null'
        }
        RNImageCropModule.rotateImage(clockwise, this._imageCropHandle)
    }


    render() {
        const { style, sourceUrl, keepAspectRatio, aspectRatio } = this.props

        return (
            <RNImageCrop
                ref={this._setRef}
                style={style}
                sourceUrl={sourceUrl}
                keepAspectRatio={keepAspectRatio}
                cropAspectRatio={aspectRatio}
            />
        )
    }
}
