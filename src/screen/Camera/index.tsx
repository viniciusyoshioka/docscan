import React, { useEffect, useMemo, useRef, useState } from "react"
import { Alert, StatusBar } from "react-native"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler"
import { OrientationType } from "react-native-orientation-locker"
import { useSharedValue } from "react-native-reanimated"
import { Camera as RNCamera, useCameraDevices } from "react-native-vision-camera"

import { Button, Icon, Screen } from "../../components"
import { useBackHandler, useDeviceOrientation, useIsForeground } from "../../hooks"
import { useCameraSettings } from "../../services/camera"
import { getDocumentPicturePath, getFullFileName, useDocumentData } from "../../services/document"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log } from "../../services/log"
import { getCameraPermission } from "../../services/permission"
import { useColorTheme } from "../../services/theme"
import { CameraOrientationType, DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { CameraControl, CameraControlRef } from "./CameraControl"
import { CameraSettings } from "./CameraSettings"
import { FocusIndicator } from "./FocusIndicator"
import { CameraHeader } from "./Header"
import { CameraWrapper, NoCameraAvailableText } from "./style"


export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()
    const isFocused = useIsFocused()

    const cameraRef = useRef<RNCamera>(null)
    const cameraControlRef = useRef<CameraControlRef>(null)

    const { cameraSettingsState } = useCameraSettings()
    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const isForeground = useIsForeground()
    const { color, opacity } = useColorTheme()
    const deviceOrientation = useDeviceOrientation()

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined)
    const [cameraOrientation, setCameraOrientation] = useState(getCameraOrientation)
    const cameraDevices = useCameraDevices()
    const cameraDevice = cameraDevices[cameraSettingsState.cameraType]
    const isFlippable = useMemo(() => {
        return cameraDevices.back !== undefined && cameraDevices.front !== undefined
    }, [cameraDevices])
    const [hasChanges, setHasChanges] = useState(false)
    const [isCameraSettingsVisible, setIsCameraSettingsVisible] = useState(false)
    const [isFocusEnable, setIsFocusEnable] = useState(true)
    const [isCameraActive, setIsCameraActive] = useState(isFocused && isForeground && (hasCameraPermission === true))
    const [isFocusing, setIsFocusing] = useState(false)
    const focusPosX = useSharedValue(0)
    const focusPosY = useSharedValue(0)


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

        const filePathToDelete = documentDataState.id
            ? documentDataState.pictureList
                .filter((item: DocumentPicture) => {
                    if (!item.id) {
                        return true
                    }
                    return false
                })
                .map((item: DocumentPicture) => {
                    return item.filePath
                })
            : documentDataState.pictureList
                .map((item: DocumentPicture) => {
                    return item.filePath
                })

        deletePicturesService(filePathToDelete)
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
                payload: [{
                    id: undefined,
                    filePath: picturePath,
                    fileName: pictureName,
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
                log.warn(`Error focusing camera ${error}`)
            }

            setIsFocusEnable(true)
            setIsFocusing(false)
        }
    }

    async function requestAndSetCameraPermission() {
        const hasPermission = await getCameraPermission()
        if (!hasPermission) {
            Alert.alert(
                "Permissão negada",
                "Vá em configurações e permita o uso da câmera para este aplicativo"
            )
        }
        setHasCameraPermission(hasPermission)
    }


    useEffect(() => {
        requestAndSetCameraPermission()
    }, [])

    useEffect(() => {
        setIsCameraActive(isFocused && isForeground && (hasCameraPermission === true))
    }, [hasCameraPermission])

    useEffect(() => {
        const newCameraOrientation = getCameraOrientation()
        if (cameraOrientation !== newCameraOrientation) {
            setCameraOrientation(newCameraOrientation)
        }
    }, [deviceOrientation])

    useEffect(() => {
        if (!isCameraActive) {
            cameraControlRef.current?.disableAction()
            return
        }
        cameraControlRef.current?.enableAction()
    }, [isCameraActive])

    useEffect(() => {
        if (isCameraSettingsVisible) {
            setIsFocusEnable(false)
            return
        }
        setIsFocusEnable(true)
    }, [isCameraSettingsVisible])


    return (
        <Screen style={{ backgroundColor: "black" }}>
            <StatusBar hidden={true} />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setIsCameraSettingsVisible(true)}
                isLayoutPositionAbsolute={false}
            />

            {(hasCameraPermission === undefined) && (
                <CameraWrapper />
            )}

            {(hasCameraPermission === false) && (
                <CameraWrapper>
                    <NoCameraAvailableText>
                        Sem permissão
                    </NoCameraAvailableText>

                    <Button
                        text={"Conceder permissão"}
                        onPress={requestAndSetCameraPermission}
                        style={{ marginTop: 16 }}
                    />
                </CameraWrapper>
            )}

            {(hasCameraPermission && !cameraDevice) && (
                <CameraWrapper>
                    <Icon
                        iconName={"no-photography"}
                        iconSize={56}
                        iconColor={color.screen_color}
                        iconStyle={{ opacity: opacity.mediumEmphasis }}
                    />

                    <NoCameraAvailableText>
                        Câmera indisponível
                    </NoCameraAvailableText>
                </CameraWrapper>
            )}

            {(hasCameraPermission && cameraDevice) && (
                <CameraWrapper>
                    <TapGestureHandler minPointers={1} onHandlerStateChange={onTapStateChange}>
                        <RNCamera
                            ref={cameraRef}
                            isActive={isCameraActive}
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
                isLayoutPositionAbsolute={false}
            />

            <CameraSettings
                visible={isCameraSettingsVisible}
                setVisible={setIsCameraSettingsVisible}
                isFlippable={isFlippable}
            />
        </Screen>
    )
}
