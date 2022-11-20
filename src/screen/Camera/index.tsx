import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Alert, Linking, StatusBar, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler"
import { OrientationType } from "react-native-orientation-locker"
import { useSharedValue } from "react-native-reanimated"
import { Camera as RNCamera } from "react-native-vision-camera"

import { Button, EmptyList, Screen } from "../../components"
import { useBackHandler, useCameraDevices, useDeviceOrientation, useIsForeground } from "../../hooks"
import { translate } from "../../locales"
import { useCameraSettings } from "../../services/camera"
import { getDocumentPicturePath, getFullFileName, useDocumentData } from "../../services/document"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { getCameraPermission } from "../../services/permission"
import { getCameraRatioNumber } from "../../services/settings"
import { useAppTheme } from "../../services/theme"
import { CameraOrientationType, DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { CameraControl, CameraControlRef, CAMERA_CONTROL_HEIGHT } from "./CameraControl"
import { CameraSettings } from "./CameraSettings"
import { FocusIndicator } from "./FocusIndicator"
import { CameraHeader } from "./Header"
import { CameraButtonWrapper, CameraTextWrapper, CameraWrapper, NoCameraAvailableText, NoCameraAvailableTitle } from "./style"


export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()
    const isFocused = useIsFocused()

    const { width } = useWindowDimensions()
    const isForeground = useIsForeground()
    const deviceOrientation = useDeviceOrientation()

    const { cameraSettingsState } = useCameraSettings()
    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const { color, appTheme } = useAppTheme()

    const cameraRef = useRef<RNCamera>(null)
    const cameraControlRef = useRef<CameraControlRef>(null)

    const [hasChanges, setHasChanges] = useState(false)
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined)
    const [cameraOrientation, setCameraOrientation] = useState(getCameraOrientation())
    const [isCameraSettingsVisible, setIsCameraSettingsVisible] = useState(false)
    const [showCamera, setShowCamera] = useState(true)
    const [isCameraActive, setIsCameraActive] = useState(isFocused && isForeground && (hasCameraPermission === true))
    const [isFocusEnable, setIsFocusEnable] = useState(true)
    const [isFocusing, setIsFocusing] = useState(false)
    const focusPosX = useSharedValue(0)
    const focusPosY = useSharedValue(0)

    const cameraDevices = useCameraDevices()
    const cameraDevice = cameraDevices ? cameraDevices[cameraSettingsState.cameraType] : undefined
    const isCameraFlippable = useMemo(() =>
        cameraDevices !== undefined && cameraDevices.back !== undefined && cameraDevices.front !== undefined
    , [cameraDevices])


    useBackHandler(() => {
        goBack()
        return true
    })


    async function requestAndSetCameraPermission() {
        const hasPermission = await getCameraPermission()
        setHasCameraPermission(hasPermission)
    }

    function getCameraOrientation(): CameraOrientationType {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                return "portrait"
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                return "portraitUpsideDown"
            case OrientationType["LANDSCAPE-LEFT"]:
                // Thoose landscape are the oposite because
                // the libraries uses diferent reference point
                return "landscapeRight"
            case OrientationType["LANDSCAPE-RIGHT"]:
                // Thoose landscape are the oposite because
                // the libraries uses diferent reference point
                return "landscapeLeft"
            default:
                return cameraOrientation
        }
    }

    async function deleteUnsavedPictures() {
        if (!documentDataState) {
            navigation.navigate("Home")
            return
        }

        const filePathToDelete = documentDataState.id
            ? documentDataState.pictureList
                .filter((item: DocumentPicture) => {
                    if (!item.id) {
                        return true
                    }
                    return false
                })
                .map((item: DocumentPicture) => item.filePath)
            : documentDataState.pictureList
                .map((item: DocumentPicture) => item.filePath)

        deletePicturesService(filePathToDelete)
        dispatchDocumentData({ type: "close-document" })
        navigation.navigate("Home")
    }

    function saveChangesAndGoBack() {
        dispatchDocumentData({ type: "save-and-close-document" })
        navigation.reset({ routes: [ { name: "Home" } ] })
    }

    function goBack() {
        if (params?.screenAction === "replace-picture") {
            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
            })
            return
        }

        if (!documentDataState || !hasChanges) {
            navigation.navigate("Home")
            return
        }

        if (!params && hasChanges) {
            Alert.alert(
                translate("warn"),
                translate("camera_alert_unsavedPictures_text"),
                [
                    { text: translate("cancel"), onPress: () => { } },
                    { text: translate("dont_save"), onPress: async () => await deleteUnsavedPictures() },
                    { text: translate("save"), onPress: () => saveChangesAndGoBack() }
                ]
            )
        }
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
                flash: cameraSettingsState.flash,
            })

            const picturePath = await getDocumentPicturePath(response.path)
            const pictureName = getFullFileName(picturePath)
            await RNFS.moveFile(response.path, picturePath)

            if (params?.screenAction === "replace-picture") {
                dispatchDocumentData({
                    type: "replace-picture",
                    payload: {
                        indexToReplace: params.replaceIndex,
                        newPicturePath: picturePath,
                        newPictureName: pictureName
                    }
                })

                navigation.navigate("VisualizePicture", {
                    pictureIndex: params.replaceIndex,
                })
                return
            }

            dispatchDocumentData({
                type: "add-picture",
                payload: [ {
                    id: undefined,
                    filePath: picturePath,
                    fileName: pictureName,
                    position: documentDataState?.pictureList.length || 0,
                } ]
            })
            setHasChanges(true)
        } catch (error) {
            log.error(`Error taking picture: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("camera_alert_unknownErrorTakingPicture_text")
            )
        }
    }

    function editDocument() {
        dispatchDocumentData({ type: "create-new-if-empty" })

        navigation.reset({
            routes: [ { name: "EditDocument" } ]
        })
    }

    async function onTapStateChange(event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) {
        if (!cameraDevice?.supportsFocus || !isFocusEnable) {
            return
        }

        if (event.nativeEvent.state === State.ACTIVE) {
            focusPosX.value = parseInt(event.nativeEvent.absoluteX.toFixed())
            focusPosY.value = parseInt(event.nativeEvent.absoluteY.toFixed())

            setIsFocusEnable(false)
            setIsFocusing(true)

            try {
                await cameraRef.current?.focus({
                    x: parseInt(event.nativeEvent.x.toFixed()),
                    y: parseInt(event.nativeEvent.y.toFixed()),
                })
            } catch (error) {
                log.warn(`Error focusing camera ${stringfyError(error)}`)
            }

            setIsFocusEnable(true)
            setIsFocusing(false)
        }
    }


    useEffect(() => {
        requestAndSetCameraPermission()
    }, [])

    useEffect(() => {
        setIsCameraActive(isFocused && isForeground && (hasCameraPermission === true))
    }, [isFocused, isForeground, hasCameraPermission])

    useEffect(() => {
        if (!isCameraActive) {
            cameraControlRef.current?.disableAction()
            return
        }
        cameraControlRef.current?.enableAction()
    }, [isCameraActive])

    useEffect(() => {
        const newCameraOrientation = getCameraOrientation()
        if (cameraOrientation !== newCameraOrientation) {
            setCameraOrientation(newCameraOrientation)
        }
    }, [deviceOrientation])

    useEffect(() => {
        if (isCameraSettingsVisible) {
            setIsFocusEnable(false)
            return
        }
        setIsFocusEnable(true)
    }, [isCameraSettingsVisible])

    useEffect(() => {
        setShowCamera(false)

        setTimeout(() => {
            setShowCamera(true)
        }, 100)
    }, [cameraSettingsState.cameraRatio])


    return (
        <Screen>
            <StatusBar
                hidden={hasCameraPermission === true && cameraDevice !== undefined}
                backgroundColor={color.screen_background}
                barStyle={appTheme === "dark" ? "light-content" : "dark-content"}
            />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setIsCameraSettingsVisible(true)}
            />

            {(hasCameraPermission === undefined || hasCameraPermission === false) && (
                <>
                    <CameraTextWrapper>
                        <NoCameraAvailableTitle>
                            {translate("camera_noPermission")}
                        </NoCameraAvailableTitle>

                        <NoCameraAvailableText>
                            &bull; {translate("camera_allowCameraWithGrantPermission")}
                        </NoCameraAvailableText>

                        <NoCameraAvailableText>
                            &bull; {translate("camera_allowCameraThroughSettings")}
                        </NoCameraAvailableText>

                        <NoCameraAvailableText>
                            &bull; {translate("camera_enableCamera")}
                        </NoCameraAvailableText>
                    </CameraTextWrapper>

                    <CameraButtonWrapper style={{ bottom: CAMERA_CONTROL_HEIGHT }}>
                        <Button
                            text={translate("camera_openSettings")}
                            onPress={() => Linking.openSettings()}
                            style={{ width: "100%" }}
                        />

                        <Button
                            text={translate("camera_grantPermission")}
                            onPress={requestAndSetCameraPermission}
                            style={{ marginTop: 8, width: "100%" }}
                        />
                    </CameraButtonWrapper>
                </>
            )}

            {(hasCameraPermission && !cameraDevice) && (
                <EmptyList
                    iconName={"no-photography"}
                    iconSize={56}
                    message={translate("camera_cameraNotAvailable")}
                    iconStyle={{ marginBottom: 16 }}
                />
            )}

            {(hasCameraPermission && cameraDevice && showCamera) && (
                <CameraWrapper>
                    <TapGestureHandler
                        minPointers={1}
                        enabled={isCameraActive && isFocusEnable}
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
                                height: width * getCameraRatioNumber(cameraSettingsState.cameraRatio),
                            }}
                        />
                    </TapGestureHandler>
                </CameraWrapper>
            )}

            <FocusIndicator
                isFocusing={isFocusing}
                focusPosX={focusPosX.value}
                focusPosY={focusPosY.value}
            />

            <CameraControl
                ref={cameraControlRef}
                pictureListLength={documentDataState?.pictureList.length || 0}
                screenAction={params?.screenAction}
                addPictureFromGallery={addPictureFromGallery}
                takePicture={takePicture}
                editDocument={editDocument}
            />

            <CameraSettings
                visible={isCameraSettingsVisible}
                setVisible={setIsCameraSettingsVisible}
                isFlippable={isCameraFlippable}
            />
        </Screen>
    )
}
