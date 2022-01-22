import React, { useEffect, useMemo, useRef, useState } from "react"
import { Alert, StatusBar } from "react-native"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core"
import { Camera as RNCamera, useCameraDevices } from "react-native-vision-camera"
import RNFS from "react-native-fs"
import Icon from "react-native-vector-icons/MaterialIcons"
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler"
import { OrientationType } from "react-native-orientation-locker"

import { SafeScreen } from "../../components"
import { useCameraSettings } from "../../services/camera"
import { fullPathPicture } from "../../services/constant"
import { getDateTime } from "../../services/date"
import { useDocumentData } from "../../services/document"
import { createAllFolderAsync } from "../../services/folder-handler"
import { useBackHandler, useDeviceOrientationChange, useIsForeground } from "../../hooks"
import { log } from "../../services/log"
import { getCameraPermission } from "../../services/permission"
import { CameraOrientationType, NavigationParamProps, RouteParamProps } from "../../types"
import { CameraSettings } from "./CameraSettings"
// import { CameraControl, CameraControlHandle } from "./Control"
import { CameraControl } from "./CameraControl"
import { CameraHeader } from "./Header"
import { CameraWrapper, NoCameraAvailableText } from "./style"
import { useColorTheme } from "../../services/theme"


export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()
    const isFocused = useIsFocused()

    const cameraRef = useRef<RNCamera>(null)
    // const cameraControlRef = useRef<CameraControlHandle>(null)

    const { cameraSettingsState } = useCameraSettings()
    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const isForeground = useIsForeground()
    const { color, opacity } = useColorTheme()
    const deviceOrientation = useDeviceOrientationChange()

    const [cameraOrientation, setCameraOrientation] = useState(getCameraOrientation)
    const cameraDevices = useCameraDevices()
    const cameraDevice = cameraDevices[cameraSettingsState.cameraType]
    const isFlippable = useMemo(() => {
        return cameraDevices.back !== undefined && cameraDevices.front !== undefined
    }, [cameraDevices])
    const [hasChanges, setHasChanges] = useState(false)
    const [isCameraSettingsVisible, setIsCameraSettingsVisible] = useState(false)
    const [isFocusEnable, setIsFocusEnable] = useState(true)


    useBackHandler(() => {
        goBack()
        return true
    })


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

        for (let i = 0; i < documentDataState.pictureList.length; i++) {
            if (!documentDataState.id || !documentDataState.pictureList[i].id) {
                try {
                    await RNFS.unlink(documentDataState.pictureList[i].filepath)
                } catch (error) {
                    log.warn(`Error deleting unsaved picture before leaving Camera screen: "${error}"`)
                }
            }
        }
        dispatchDocumentData({ type: "close-document" })
        navigation.navigate("Home")
    }

    function saveChangesAndGoBack() {
        dispatchDocumentData({ type: "save-and-close-document" })
        navigation.reset({ routes: [{ name: "Home" }] })
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
                "Aviso",
                "Você tem fotos que não foram salvas, ao voltar elas serão perdidas",
                [
                    { text: "Cancelar", onPress: () => { } },
                    { text: "Não salvar", onPress: async () => await deleteUnsavedPictures() },
                    { text: "Salvar", onPress: () => saveChangesAndGoBack() }
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
        const hasCameraPermission = await getCameraPermission()
        if (!hasCameraPermission) {
            log.warn("Camera takePicture - Não tem permissão para tirar foto")
            Alert.alert(
                "Erro",
                "Sem permissão para usar a câmera"
            )
            return
        }

        try {
            if (!cameraRef.current) {
                throw new Error("Camera ref is undefined")
            }

            await createAllFolderAsync()

            const date = getDateTime("-", "-", true)
            const picturePath = `${fullPathPicture}/${date}.jpg`

            // cameraControlRef.current?.setTakePictureButtonEnable(false)

            const response = await cameraRef.current.takePhoto({
                flash: cameraSettingsState.flash,
            })
            await RNFS.moveFile(response.path, picturePath)

            // new Promise(() => {
            //     const unlockTakePictureButton = setInterval(() => {
            //         cameraControlRef.current?.setTakePictureButtonEnable(true)
            //         clearInterval(unlockTakePictureButton)
            //     }, 100)
            // })

            if (params?.screenAction === "replace-picture") {
                dispatchDocumentData({
                    type: "replace-picture",
                    payload: {
                        indexToReplace: params.replaceIndex,
                        newPicture: picturePath
                    }
                })

                navigation.navigate("VisualizePicture", {
                    pictureIndex: params.replaceIndex,
                })
                return
            }

            dispatchDocumentData({
                type: "add-picture",
                payload: [{
                    id: undefined,
                    filepath: picturePath,
                    position: documentDataState?.pictureList.length || 0,
                }]
            })
            setHasChanges(true)
        } catch (error) {
            log.error(`Camera takePicture - Erro ao tirar foto. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao tirar foto, tente novamente"
            )
        }
    }

    function editDocument() {
        dispatchDocumentData({ type: "create-new-if-empty" })

        navigation.reset({
            routes: [{ name: "EditDocument" }]
        })
    }

    async function onTapStateChange(event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) {
        if (!cameraDevice?.supportsFocus || !isFocusEnable) {
            return
        }

        if (event.nativeEvent.state === State.ACTIVE) {
            setIsFocusEnable(false)

            try {
                await cameraRef.current?.focus({
                    x: parseInt(event.nativeEvent.x.toFixed()),
                    y: parseInt(event.nativeEvent.y.toFixed())
                })
            } catch (error) {
                log.warn(`Error focusing camera ${error}`)
            }

            new Promise<void>((resolve, _) => {
                const interval = setInterval(() => {
                    setIsFocusEnable(true)
                    clearInterval(interval)
                    resolve()
                }, 1000)
            })
        }
    }


    useEffect(() => {
        const newCameraOrientation = getCameraOrientation()
        if (cameraOrientation !== newCameraOrientation) {
            setCameraOrientation(newCameraOrientation)
        }
    }, [deviceOrientation])


    return (
        <SafeScreen style={{ backgroundColor: "black" }}>
            <StatusBar hidden={true} />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setIsCameraSettingsVisible(true)}
                isLayoutPositionAbsolute={false}
            />

            {!cameraDevice && (
                <CameraWrapper>
                    <Icon
                        name={"no-photography"}
                        size={56}
                        color={color.screen_color}
                        style={{ opacity: opacity.mediumEmphasis }}
                    />

                    <NoCameraAvailableText>
                        Câmera indisponível
                    </NoCameraAvailableText>
                </CameraWrapper>
            )}

            {cameraDevice && (
                <CameraWrapper>
                    <TapGestureHandler minPointers={1} onHandlerStateChange={onTapStateChange}>
                        <RNCamera
                            ref={cameraRef}
                            isActive={isFocused && isForeground}
                            device={cameraDevice}
                            photo={true}
                            audio={false}
                            enableZoomGesture={true}
                            orientation={cameraOrientation}
                            style={{ width: "100%", aspectRatio: 3 / 4 }}
                        />
                    </TapGestureHandler>
                </CameraWrapper>
            )}

            <CameraControl
                // ref={cameraControlRef}
                pictureListLength={documentDataState?.pictureList.length || 0}
                screenAction={params?.screenAction}
                addPictureFromGallery={addPictureFromGallery}
                takePicture={takePicture}
                editDocument={editDocument}
                isLayoutPositionAbsolute={false}
            />

            <CameraSettings
                visible={isCameraSettingsVisible}
                setVisible={setIsCameraSettingsVisible}
                isFlippable={isFlippable}
            />
        </SafeScreen>
    )
}
