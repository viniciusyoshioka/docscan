import React, { ReactNode } from "react"
import { ImageSourcePropType, ViewProps } from "react-native"

import { EmptyListImage, EmptyListText, EmptyListView } from "./style"


export interface EmptyListProps extends ViewProps {
    source?: ImageSourcePropType,
    message?: string,
    children?: ReactNode,
}


export function EmptyList(props: EmptyListProps) {
    return (
        <EmptyListView {...props}>
            {props.source && (
                <EmptyListImage source={props.source} />
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
