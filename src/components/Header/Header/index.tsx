import React, { Children, cloneElement } from "react"
import { StyleProp, ViewProps, ViewStyle } from "react-native"

import { HeaderButton } from "../Button"
import { HeaderTitle } from "../Title"
import { HeaderBase } from "./style"


export { HEADER_HEIGHT } from "./style"


export interface HeaderProps extends ViewProps {}


export function Header(props: HeaderProps) {
    return (
        <HeaderBase {...props}>
            {Children.toArray(props.children)
                .filter(child => child != null && typeof child !== "boolean")
                .map((child, index) => {
                    const isValidElement = React.isValidElement(child)

                    const isHeaderButton = isValidElement && child.type === HeaderButton
                    if (isHeaderButton && index === 0) {
                        const styleProps: StyleProp<ViewStyle> = { marginLeft: 4 }

                        const childProps = child.props as { style?: StyleProp<ViewStyle> }
                        const componentProps = {
                            ...childProps,
                            style: [styleProps, childProps.style],
                        }
                        return cloneElement(child, componentProps)
                    }

                    const isHeaderTitle = isValidElement && child.type === HeaderTitle
                    if (isHeaderTitle) {
                        const styleProps: StyleProp<ViewStyle> = {
                            marginLeft: (index === 0) ? 16 : 4,
                        }

                        const childProps = child.props as { style?: StyleProp<ViewStyle> }
                        const componentProps = {
                            ...childProps,
                            style: [styleProps, childProps.style],
                        }
                        return cloneElement(child, componentProps)
                    }

                    return child
                })}
        </HeaderBase>
    )
}
