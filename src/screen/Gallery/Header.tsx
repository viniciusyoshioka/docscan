import { AnimatedHeader, AnimatedHeaderRef, HeaderButton, HeaderTitle } from "@elementium/native"
import { ForwardedRef, forwardRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "../../locales"


export interface GalleryHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    importImage: () => void;
    isSelectionMode: boolean;
    selectedImagesAmount: number;
}


export const GalleryHeader = forwardRef((props: GalleryHeaderProps, ref: ForwardedRef<AnimatedHeaderRef>) => {


    const safeAreaInsets = useSafeAreaInsets()


    function getTitle(): string {
        if (props.isSelectionMode) {
            return props.selectedImagesAmount.toString()
        }
        return translate("Gallery_header_title")
    }


    return (
        <AnimatedHeader ref={ref} overrideStatusBar={safeAreaInsets.top !== 0}>
            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            <HeaderTitle title={getTitle()} />

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"done"}
                    onPress={props.importImage}
                />
            )}
        </AnimatedHeader>
    )
})
