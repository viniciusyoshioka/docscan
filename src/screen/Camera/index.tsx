import { Button, Screen } from "@elementium/native"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core"
import { useMemo, useRef, useState } from "react"
import { Alert, Linking, StatusBar, StyleProp, ViewStyle, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler"
import { Camera as RNCamera } from "react-native-vision-camera"

import { EmptyList } from "../../components"
import { useDocumentModel, useDocumentRealm } from "../../database"
import { useBackHandler, useCameraDevices, useIsForeground } from "../../hooks"
import { translate } from "../../locales"
import { DocumentService } from "../../services/document"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { getCameraRatioNumber, useSettings } from "../../services/settings"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { CAMERA_CONTROL_HEIGHT, CameraControl, CameraControlRef } from "./CameraControl"
import { CameraSettings } from "./CameraSettings"
import { FocusIndicator, FocusIndicatorRef } from "./FocusIndicator"
import { CameraHeader } from "./Header"
import { CameraButtonWrapper, CameraTextWrapper, CameraWrapper, NoCameraAvailableText, NoCameraAvailableTitle } from "./style"
import { useCameraOrientation } from "./useCameraOrientation"
import { useControlActionEnabled } from "./useControlActionEnabled"
import { useDisableFocusOnSettingsOpened } from "./useDisableFocusOnSettingsOpened"
import { useIsCameraActive } from "./useIsCameraActive"
import { useIsCameraFlippable } from "./useIsCameraFlippable"
import { useIsShowingCamera } from "./useIsShowingCamera"
import { useRequestCameraPermission } from "./useRequestCameraPermission"
import { useResetCameraOnChangeRatio } from "./useResetCameraOnChangeRatio"


// TODO goBack() function sometimes go back to Home instead of EditDocument
// TODO add support to multiple back cameras
// TODO add zoom indicator
// TODO fix camera control overlapping camera
export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()
    const isFocused = useIsFocused()

    const { width } = useWindowDimensions()
    const isForeground = useIsForeground()

    const documentRealm = useDocumentRealm()
    const { settings } = useSettings()
    const { documentModel, setDocumentModel } = useDocumentModel()

    const cameraRef = useRef<RNCamera>(null)
    const cameraControlRef = useRef<CameraControlRef>(null)
    const focusIndicatorRef = useRef<FocusIndicatorRef>(null)

    const [isCameraSettingsVisible, setIsCameraSettingsVisible] = useState(false)

    const cameraDevices = useCameraDevices()
    const cameraDevice = cameraDevices ? cameraDevices[settings.camera.type] : undefined
    const cameraOrientation = useCameraOrientation()
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>()
    const isCameraActive = useIsCameraActive({ isFocused, isForeground, hasPermission: hasCameraPermission })
    const isCameraFlippable = useIsCameraFlippable({ cameraDevices })
    const isShowingCamera = useIsShowingCamera({ hasPermission: hasCameraPermission, cameraDevice })
    const [isResetingCamera, setIsResetingCamera] = useState(false)
    const [isFocusEnabled, setIsFocusEnabled] = useState(true)


    const screenStyle: StyleProp<ViewStyle> = useMemo(() => isShowingCamera ? { backgroundColor: "black" } : undefined, [isShowingCamera])


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (isCameraSettingsVisible) {
            setIsCameraSettingsVisible(false)
            return
        }

        if (params?.screenAction === "replace-picture") {
            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
            })
            return
        }

        setDocumentModel({ type: "close", payload: undefined })
        navigation.navigate("Home")
    }

    function addPictureFromGallery() {
        if (params?.screenAction === "replace-picture") {
            navigation.reset({
                routes: [
                    { name: "Home" },
                    { name: "EditDocument" },
                    {
                        name: "VisualizePicture",
                        params: { pictureIndex: params.replaceIndex }
                    },
                    {
                        name: "Gallery",
                        params: {
                            screenAction: params.screenAction,
                            replaceIndex: params.replaceIndex
                        }
                    }
                ]
            })
            return
        }

        navigation.reset({
            routes: [
                { name: "Home" },
                { name: "Gallery" }
            ]
        })
    }

    async function takePicture() {
        await createAllFolderAsync()

        try {
            if (!cameraRef.current) {
                throw new Error("Camera ref is undefined")
            }

            const response = await cameraRef.current.takePhoto({
                flash: settings.camera.flash,
            })

            const picturePath = await DocumentService.getPicturePath(response.path)
            await RNFS.moveFile(response.path, picturePath)

            if (params?.screenAction === "replace-picture") {
                if (!documentModel) throw new Error("Document model is undefined. This should not happen")

                const oldPicturePath = documentModel.pictures[params.replaceIndex].filePath
                setDocumentModel({
                    type: "replacePicture",
                    payload: {
                        realm: documentRealm,
                        indexToReplace: params.replaceIndex,
                        newPicturePath: picturePath,
                    },
                })
                DocumentService.deletePicturesService([oldPicturePath])

                navigation.navigate("VisualizePicture", {
                    pictureIndex: params.replaceIndex,
                })
                return
            }

            setDocumentModel({
                type: "addPictures",
                payload: {
                    realm: documentRealm,
                    picturesToAdd: [picturePath]
                },
            })
        } catch (error) {
            log.error(`Error taking picture: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Camera_alert_unknownErrorTakingPicture_text")
            )
        }
    }

    function editDocument() {
        setDocumentModel({ type: "createNewIfEmpty", payload: undefined })

        navigation.reset({
            routes: [ { name: "EditDocument" } ]
        })
    }

    async function onTapStateChange(event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) {
        if (!cameraDevice?.supportsFocus || !isFocusEnabled) {
            return
        }

        if (event.nativeEvent.state === State.ACTIVE) {
            setIsFocusEnabled(false)

            focusIndicatorRef.current?.setFocusPos({
                x: parseInt(event.nativeEvent.absoluteX.toFixed()),
                y: parseInt(event.nativeEvent.absoluteY.toFixed()),
            })
            focusIndicatorRef.current?.setIsFocusing(true)

            try {
                await cameraRef.current?.focus({
                    x: parseInt(event.nativeEvent.x.toFixed()),
                    y: parseInt(event.nativeEvent.y.toFixed()),
                })
            } catch (error) {
                log.warn(`Error focusing camera ${stringfyError(error)}`)
            }

            setIsFocusEnabled(true)
            focusIndicatorRef.current?.setIsFocusing(false)
        }
    }


    const requestCameraPermission = useRequestCameraPermission(setHasCameraPermission)
    useControlActionEnabled({ isCameraActive, cameraControlRef })
    useDisableFocusOnSettingsOpened({ isSettingsOpened: isCameraSettingsVisible, setIsFocusEnabled })
    useResetCameraOnChangeRatio(setIsResetingCamera)


    return (
        <Screen style={screenStyle}>
            <StatusBar hidden={isShowingCamera} />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setIsCameraSettingsVisible(true)}
                isShowingCamera={isShowingCamera}
            />

            {(hasCameraPermission === undefined || hasCameraPermission === false) && (
                <>
                    <CameraTextWrapper>
                        <NoCameraAvailableTitle variant={"title"} size={"large"}>
                            {translate("Camera_noPermission")}
                        </NoCameraAvailableTitle>

                        <NoCameraAvailableText variant={"body"} size={"large"}>
                            &bull; {translate("Camera_allowCameraWithGrantPermission")}
                        </NoCameraAvailableText>

                        <NoCameraAvailableText variant={"body"} size={"large"}>
                            &bull; {translate("Camera_allowCameraThroughSettings")}
                        </NoCameraAvailableText>

                        <NoCameraAvailableText variant={"body"} size={"large"}>
                            &bull; {translate("Camera_enableCamera")}
                        </NoCameraAvailableText>
                    </CameraTextWrapper>

                    <CameraButtonWrapper style={{ paddingBottom: CAMERA_CONTROL_HEIGHT }}>
                        <Button
                            variant={"outline"}
                            text={translate("Camera_openSettings")}
                            onPress={() => Linking.openSettings()}
                            style={{ width: "100%" }}
                        />

                        <Button
                            text={translate("Camera_grantPermission")}
                            onPress={requestCameraPermission}
                            style={{ width: "100%" }}
                        />
                    </CameraButtonWrapper>
                </>
            )}

            <EmptyList
                iconName={"camera-off-outline"}
                iconGroup={"material-community"}
                iconSize={56}
                message={translate("Camera_cameraNotAvailable")}
                visible={hasCameraPermission && !cameraDevice}
            />

            {(hasCameraPermission && cameraDevice && !isResetingCamera) && (
                <CameraWrapper>
                    <TapGestureHandler
                        minPointers={1}
                        enabled={isCameraActive && isFocusEnabled}
                        onHandlerStateChange={onTapStateChange}
                    >
                        <RNCamera
                            ref={cameraRef}
                            isActive={isCameraActive}
                            device={cameraDevice}
                            photo={true}
                            audio={false}
                            enableZoomGesture={true}
                            orientation={cameraOrientation}
                            style={{
                                width: width,
                                height: width * getCameraRatioNumber(settings.camera.ratio),
                            }}
                        />
                    </TapGestureHandler>
                </CameraWrapper>
            )}

            <FocusIndicator ref={focusIndicatorRef} />

            <CameraControl
                ref={cameraControlRef}
                screenAction={params?.screenAction}
                isShowingCamera={isShowingCamera}
                addPictureFromGallery={addPictureFromGallery}
                takePicture={takePicture}
                editDocument={editDocument}
                pictureListLength={documentModel?.pictures.length ?? 0}
            />

            <CameraSettings
                visible={isCameraSettingsVisible}
                onRequestClose={() => setIsCameraSettingsVisible(false)}
                isFlippable={isCameraFlippable}
            />
        </Screen>
    )
}
