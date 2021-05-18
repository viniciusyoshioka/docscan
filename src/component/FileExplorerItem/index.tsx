import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/Ionicons"

import { useTheme } from "../../service/theme"
import { Button, FullPathText, ItemNameText, ViewIcon, ViewPath } from "./style"


export interface FileExplorerItemProps extends RectButtonProps {
    name: string,
    path: string,
    isFile: boolean,
}


export function FileExplorerItem(props: FileExplorerItemProps) {


    const { color } = useTheme()


    return (
        <Button {...props}>
            <ViewIcon>
                <Icon
                    name={props.isFile ? "md-document-sharp" : "md-folder-sharp"}
                    size={25}
                    color={color.fileExplorerItem_colorFirst}
                />
            </ViewIcon>

            <ViewPath>
                <ItemNameText numberOfLines={1} ellipsizeMode={"tail"}>
                    {props.name}
                </ItemNameText>

                <FullPathText numberOfLines={1} ellipsizeMode={"tail"}>
                    {props.path}
                </FullPathText>
            </ViewPath>
        </Button>
    )
}
