import { ActivityIndicator } from "react-native"

import { useAppTheme } from "../../../theme"
import { LoadingIndicatorView } from "./style"


export function LoadingIndicator() {


    const { color } = useAppTheme()


    return (
        <LoadingIndicatorView>
            <ActivityIndicator
                size={"small"}
                color={color.onBackground}
            />
        </LoadingIndicatorView>
    )
}
