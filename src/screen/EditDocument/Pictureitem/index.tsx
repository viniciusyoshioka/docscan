import React, { useCallback, useEffect, useState } from "react"
import { useWindowDimensions } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { SelectedSurface, FileNameText, FileNameView, PictureButton, PictureImage } from "./style"
import { useAppTheme } from "../../../services/theme"
import { Icon } from "../../../components"


export function getPictureItemHeight(width: number) {
    return ((width - (2 * 4)) / 2) - (2 * 4)
}


export interface PictureItemProps {
    click: () => void;
    select: () => void;
    deselect: () => void;
    selectionMode: boolean;
    picturePath: string;
}


export const PictureItem = (props: PictureItemProps) => {


    const { color } = useAppTheme()

    const [selected, setSelected] = useState(false)
    const { width } = useWindowDimensions()
    const pictureItemSize = getPictureItemHeight(width)


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
                style={{ maxWidth: pictureItemSize }}
                onPress={normalPress}
            >
                <PictureImage source={{ uri: `file://${props.picturePath}` }} />

                <FileNameView>
                    <FileNameText numberOfLines={1}>
                        {getPictureName()}
                    </FileNameText>
                </FileNameView>

                {props.selectionMode && selected && (
                    <>
                        <SelectedSurface />

                        <Icon
                            iconName={"done"}
                            iconSize={30}
                            iconColor={color.pictureItem_selected_color}
                            iconStyle={{ position: "absolute" }}
                        />
                    </>
                )}
            </PictureButton>
        </LongPressGestureHandler>
    )
}
