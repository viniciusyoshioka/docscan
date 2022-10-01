import { ReactNode } from "react"
import { ImageSourcePropType, ViewProps } from "react-native"

import { Icon, OptionalIconProps } from ".."
import { EmptyListImage, EmptyListText, EmptyListView } from "./style"


export interface EmptyListProps extends ViewProps, OptionalIconProps {

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
        return undefined
    }


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
