import { ExtendableOptionalIconProps, Icon } from "@elementium/native"
import { ReactNode } from "react"
import { ImageSourcePropType, ViewProps } from "react-native"

import { EmptyListImage, EmptyListText, EmptyListView } from "./style"


export interface EmptyListProps extends ViewProps, Omit<ExtendableOptionalIconProps, "style"> {

    /**
     * Boolean that controls when the component is shown
     *
     * @default true
     */
    visible?: boolean;

    imageSource?: ImageSourcePropType;
    message?: string;
    children?: ReactNode;
}


export function EmptyList(props: EmptyListProps) {


    if (props.visible === false) {
        return null
    }


    return (
        <EmptyListView {...props}>
            {props.iconName && (
                <Icon
                    name={props.iconName}
                    group={props.iconGroup}
                    size={props.iconSize}
                    color={props.iconColor}
                    style={props.style}
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
