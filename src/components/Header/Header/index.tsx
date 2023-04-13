import React, { Children, cloneElement, ReactNode } from "react"
import { StyleProp, ViewProps, ViewStyle } from "react-native"

import { HeaderButton, HeaderTitle } from ".."
import { HeaderBase } from "./style"


export { HEADER_HEIGHT } from "./style"


export interface HeaderProps extends ViewProps {
    children: ReactNode;
}


export const Header = (props: HeaderProps) => (
    <HeaderBase {...props}>
        {Children.toArray(props.children)
            .filter(child => child != null && typeof child !== "boolean")
            .map((child, index) => {
                // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
                if (!React.isValidElement(child) || ![HeaderTitle, HeaderButton].includes(child.type)) {
                    return child
                }

                const props: { style?: StyleProp<ViewStyle> } = {}

                if (child.type === HeaderTitle) {
                    props.style = [
                        { marginLeft: 8 },
                        child.props.style,
                    ]
                }
                return cloneElement(child, props)
            })}
    </HeaderBase>
)
