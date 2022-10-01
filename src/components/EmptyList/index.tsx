import { ReactNode } from "react"
import { ImageSourcePropType, ViewProps } from "react-native"

import { Icon, OptionalIconProps } from ".."
import { EmptyListImage, EmptyListText, EmptyListView } from "./style"


export interface EmptyListProps extends ViewProps, OptionalIconProps {
    imageSource?: ImageSourcePropType;
    message?: string;
    children?: ReactNode;
}


export function EmptyList(props: EmptyListProps) {
    return (
        <EmptyListView {...props}>
            {props.iconName && (
                <Icon
                    iconName={props.iconName}
                    iconGroup={props.iconGroup}
                    iconSize={props.iconSize}
                    iconColor={props.iconColor}
                    iconStyle={props.iconStyle}
                />
            )}

            {props.imageSource && (
                <EmptyListImage source={props.imageSource} />
            )}

            {props.message && (
                <EmptyListText>
                    {props.message}
                </EmptyListText>
            )}

            {props.children}
        </EmptyListView>
    )
}
