import React, { useCallback, useEffect, useState } from "react"
import { useWindowDimensions } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/MaterialIcons"

import { SelectedSurface, FileNameText, FileNameView, PictureButton, PictureImage } from "./style"
import { useTheme } from "../../service/theme"


const PICTURE_ITEM_RATIO = 2 / 3


export interface PictureItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    picturePath: string,
}


export function PictureItem(props: PictureItemProps) {


    const { color } = useTheme()

    const [selected, setSelected] = useState(false)
    const { width } = useWindowDimensions()
    const pictureItemWidth = (width / 2) - 8


    const getPictureName = useCallback(() => {
        const splittedPath = props.picturePath.split("/")
        return splittedPath[splittedPath.length - 1]
    }, [props.picturePath])

    const normalPress = useCallback(() => {
        if (!props.selectionMode) {
            props.click()
        } else if (!selected) {
            props.select()
            setSelected(true)
        } else if (selected) {
            props.deselect()
            setSelected(false)
        }
    }, [props.selectionMode, selected, props.click])

    const longPress = useCallback((nativeEvent) => {
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.selectionMode) {
                props.select()
                setSelected(true)
            }
        }
    }, [props.selectionMode])


    useEffect(() => {
        if (!props.selectionMode && selected) {
            setSelected(false)
        }
    }, [props.selectionMode])


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <PictureButton
                style={{
                    aspectRatio: PICTURE_ITEM_RATIO,
                    maxWidth: pictureItemWidth,
                    maxHeight: (pictureItemWidth / PICTURE_ITEM_RATIO),
                }}
                onPress={normalPress}
            >
                <PictureImage
                    source={{ uri: `file://${props.picturePath}` }}
                    style={{
                        aspectRatio: PICTURE_ITEM_RATIO,
                        maxWidth: pictureItemWidth,
                        maxHeight: (pictureItemWidth / PICTURE_ITEM_RATIO),
                    }}
                />

                <FileNameView>
                    <FileNameText numberOfLines={1}>
                        {getPictureName()}
                    </FileNameText>
                </FileNameView>

                {props.selectionMode && selected && (
                    <>
                        <SelectedSurface />

                        <Icon
                            name={"done"}
                            size={30}
                            color={color.pictureItem_selected_color}
                            style={{ position: "absolute" }}
                        />
                    </>
                )}
            </PictureButton>
        </LongPressGestureHandler>
    )
}
