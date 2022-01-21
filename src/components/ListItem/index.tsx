import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

import { Icon, OptionalIconProps } from ".."
import { useColorTheme } from "../../services/theme"
import { ListItemBase, TextDescription, TextTitle, ViewIcon, ViewText } from "./style"


export interface ListItemProps extends RectButtonProps, OptionalIconProps {
    title?: string;
    description?: string;
}


export const ListItem = (props: ListItemProps) => {


    const { color, opacity } = useColorTheme()


    return (
        <ListItemBase rippleColor={color.listItem_ripple} {...props}>
            {props.iconName && (
                <ViewIcon>
                    <Icon
                        iconName={props.iconName}
                        iconSize={props.iconSize ?? 24}
                        iconColor={color.listItem_color}
                        iconStyle={{ opacity: opacity.highEmphasis }}
                    />
                </ViewIcon>
            )}

            <ViewText>
                {props.title && (
                    <TextTitle numberOfLines={1}>
                        {props.title}
                    </TextTitle>
                )}

                {props.description && (
                    <TextDescription numberOfLines={1}>
                        {props.description}
                    </TextDescription>
                )}
            </ViewText>
        </ListItemBase>
    )
}
