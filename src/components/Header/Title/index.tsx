import { Text, TextProps } from "@elementium/native"
import { StyleSheet } from "react-native"

import { useAppTheme } from "../../../theme"


export interface HeaderTitleProps extends TextProps {}


export function HeaderTitle(props: HeaderTitleProps) {


    const { color } = useAppTheme()


    return (
        <Text
            variant={"title"}
            size={"large"}
            numberOfLines={1}
            {...props}
            style={[styles.title, { color: color.onSurface }, props.style]}
        />
    )
}


const styles = StyleSheet.create({
    title: {
        flex: 1,
    },
})
