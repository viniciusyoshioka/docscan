import React, { useEffect, useReducer, useRef, useState } from "react"
import { Alert, StatusBar } from "react-native"
import { HardwareCamera, RNCamera } from "react-native-camera"
import { useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"

import { CameraHeader } from "./Header"
// import { CameraControl, CameraControlHandle } from "./Control"
import { CameraControl } from "./Control"
import { CameraSettings } from "./CameraSettings"
import { SafeScreen } from "../../component"
import { fullPathPicture } from "../../service/constant"
import { getDateTime } from "../../service/date"
import { createAllFolder } from "../../service/folder-handler"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { getCameraPermission } from "../../service/permission"
import { SettingsDatabase } from "../../database"
import { useDocumentData } from "../../service/document"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { initialCameraSettings, reducerCameraSettings } from "../../service/camera"


export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()

    const cameraRef = useRef<RNCamera>(null)
    // const cameraControlRef = useRef<CameraControlHandle>(null)
    const [stateCameraSettings, dispatchCameraSettings] = useReducer(reducerCameraSettings, initialCameraSettings)
    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)

    const [isMultipleCameraAvailable, setIsMultipleCameraAvailable] = useState(false)
    const [currentCameraIndex, setCurrentCameraIndex] = useState<number | null>(null)
    const [cameraList, setCameraList] = useState<Array<HardwareCamera> | null>(null)

    const [documentDataState, dispatchDocumentData] = useDocumentData()
    const [hasChanges, setHasChanges] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    async function deleteUnsavedPictures() {
        if (!documentDataState) {
            navigation.navigate("Home")
            return
        }

        for (let i = 0; i < documentDataState.pictureList.length; i++) {
            if (!documentDataState.id || !documentDataState.pictureList[i].id) {
                await RNFS.unlink(documentDataState.pictureList[i].filepath)
            }
        }
        dispatchDocumentData({ type: "close-document" })
        navigation.navigate("Home")
    }

    function saveChangesAndGoBack() {
        dispatchDocumentData({ type: "save-document" })
        dispatchDocumentData({ type: "close-document" })
        navigation.reset({ routes: [{ name: "Home" }] })
    }

    function goBack() {
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
            return
        }

        if (params?.screenAction === "replace-picture") {
            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
            })
        }
    }

    function addPictureFromGalery() {
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
                        name: "ImportImageFromGalery",
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
                { name: "ImportImageFromGalery" }
            ]
        })
    }

    async function takePicture() {
        createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPicture}/${date}.jpg`
        const options = { quality: 1, path: picturePath }

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
            // cameraControlRef.current?.setTakePictureButtonEnable(false)

            await cameraRef.current?.takePictureAsync(options)

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


    useEffect(() => {
        SettingsDatabase.getSettings()
            .then((settings) => {
                dispatchCameraSettings({
                    type: "set",
                    payload: {
                        flash: settings.cameraFlash,
                        whiteBalance: settings.cameraWhiteBalance,
                        cameraType: settings.cameraType,
                        cameraId: settings.cameraId,
                    }
                })
            })
    }, [])

    useEffect(() => {
        async function getCameraList() {
            let readCameraList: Array<HardwareCamera> | undefined = [{ id: "0", type: 0 }]

            try {
                readCameraList = await cameraRef.current?.getCameraIdsAsync()
            } catch (error) {
                log.warn(`Camera useEffect getCameraIds - Erro ao pegar câmeras do dispositivo para trocas entre os tipos diferentes de camera. Mensagem: "${error}"`)
            }

            if (readCameraList === undefined) {
                setCameraList([])
                return
            }

            const cameraIdList = readCameraList.filter(item => item.type === 0)
            if (cameraIdList.length > 1) {
                setIsMultipleCameraAvailable(true)
            }
            setCameraList(cameraIdList)

            cameraIdList.forEach((item: HardwareCamera, index: number) => {
                if (item.id === stateCameraSettings.cameraId) {
                    setCurrentCameraIndex(index)
                    return
                }
            })
        }

        if (cameraList === null && cameraSettingsVisible) {
            getCameraList()
        }
    }, [cameraSettingsVisible])


    return (
        <SafeScreen>
            <StatusBar hidden={true} />

            <CameraSettings
                visible={cameraSettingsVisible}
                setVisible={setCameraSettingsVisible}
                cameraAttributes={{
                    flash: stateCameraSettings.flash,
                    whiteBalance: stateCameraSettings.whiteBalance,
                    cameraType: stateCameraSettings.cameraType,
                    cameraId: stateCameraSettings.cameraId,
                }}
                setCameraAttributes={dispatchCameraSettings}
                cameraList={cameraList || []}
                currentCameraIndex={currentCameraIndex || 0}
                setCurrentCameraIndex={setCurrentCameraIndex}
                isMultipleCameraAvailable={isMultipleCameraAvailable}
            />

            <RNCamera
                style={{ flex: 1, overflow: "hidden" }}
                ref={cameraRef}
                captureAudio={false}
                useNativeZoom={true}
                useCamera2Api={true}
                playSoundOnCapture={true}
                flashMode={stateCameraSettings.flash}
                whiteBalance={stateCameraSettings.whiteBalance}
                type={stateCameraSettings.cameraType}
                cameraId={stateCameraSettings.cameraType === "back" ? stateCameraSettings.cameraId : undefined}
            />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setCameraSettingsVisible(true)}
            />

            <CameraControl
                // ref={cameraControlRef}
                pictureListLength={documentDataState?.pictureList.length || 0}
                screenAction={params?.screenAction}
                addPictureFromGalery={addPictureFromGalery}
                takePicture={takePicture}
                editDocument={editDocument}
            />
        </SafeScreen>
    )
}
