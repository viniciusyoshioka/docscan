import { Button, ScrollScreen } from "@elementium/native"
import { FlatList, ListRenderItem, StatusBar, ViewStyle, useWindowDimensions } from "react-native"
import { useSafeAreaFrame } from "react-native-safe-area-context"

import { HEADER_HEIGHT } from "../../components"
import { translate } from "../../locales"
import { CameraRatio, settingsCameraRatioOptions, useSettings } from "../../services/settings"
import { useCameraControlDimensions } from "./CameraControl"
import { CameraButtonWrapper, CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0


export interface RatioNotSupportedProps {
    isVisible: boolean;
}


export function RatioNotSupported(props: RatioNotSupportedProps) {


    const { height } = useWindowDimensions()
    const safeAreaFrame = useSafeAreaFrame()

    const cameraControlDimensions = useCameraControlDimensions()
    const { size: cameraControlSize } = cameraControlDimensions

    const heightToDiscount = Math.round(safeAreaFrame.y) === Math.round(STATUS_BAR_HEIGHT) ? 0 : safeAreaFrame.y
    const scrollScreenStyle: ViewStyle = {
        marginTop: HEADER_HEIGHT,
        marginBottom: cameraControlSize.HEIGHT_WITHOUT_CAMERA,
    }
    const scrollScreenContentContainerStyle: ViewStyle = {
        minHeight: height - HEADER_HEIGHT - cameraControlSize.HEIGHT_WITHOUT_CAMERA - heightToDiscount,
    }

    const { settings, setSettings } = useSettings()


    function changeRatioSettings(ratio: CameraRatio) {
        setSettings({
            ...settings,
            camera: {
                ...settings.camera,
                ratio: ratio,
            },
        })
    }

    const renderItem: ListRenderItem<CameraRatio> = ({ item }) => (
        <Button text={item} variant={"outline"} onPress={() => changeRatioSettings(item)} />
    )


    if (!props.isVisible) return null


    return (
        <ScrollScreen
            style={scrollScreenStyle}
            contentContainerStyle={scrollScreenContentContainerStyle}
        >
            <CameraTextWrapper>
                <CameraMessageTitle variant={"title"} size={"large"}>
                    {translate("Camera_ratioNotSupported_title")}
                </CameraMessageTitle>

                <CameraMessageText variant={"body"} size={"large"}>
                    {translate("Camera_ratioNotSupported_text")}
                </CameraMessageText>
            </CameraTextWrapper>

            <CameraButtonWrapper>
                <FlatList
                    data={settingsCameraRatioOptions}
                    renderItem={renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ width: "100%" }}
                    contentContainerStyle={{ gap: 8 }}
                />
            </CameraButtonWrapper>
        </ScrollScreen>
    )
}
