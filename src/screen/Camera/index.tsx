import React, { useEffect, useReducer, useRef, useState } from "react"
import { Alert, StatusBar } from "react-native"
import { HardwareCamera, RNCamera } from "react-native-camera"
import { useNavigation, useRoute } from "@react-navigation/core"

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
import { cameraReducerAction, cameraReducerState } from "../../types/camera-reducer"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../../service/settings"
import { SettingsDatabase } from "../../database"
import { getDocumentName } from "../../service/document"
import { NavigationParamProps, RouteParamProps } from "../../types/screen-params"


const initialCameraSettings: cameraReducerState = {
    flash: cameraFlashDefault,
    whiteBalance: cameraWhiteBalanceDefault,
    cameraType: cameraTypeDefault,
    cameraId: cameraIdDefault,
}

function reducerCameraSettings(state: cameraReducerState, action: cameraReducerAction): cameraReducerState {
    switch (action.type) {
        case "flash":
            return {
                flash: action.payload,
                whiteBalance: state.whiteBalance,
                cameraType: state.cameraType,
                cameraId: state.cameraId,
            }
        case "white-balance":
            return {
                flash: state.flash,
                whiteBalance: action.payload,
                cameraType: state.cameraType,
                cameraId: state.cameraId,
            }
        case "camera-type":
            return {
                flash: state.flash,
                whiteBalance: state.whiteBalance,
                cameraType: action.payload,
                cameraId: state.cameraId,
            }
        case "camera-id":
            return {
                flash: state.flash,
                whiteBalance: state.whiteBalance,
                cameraType: state.cameraType,
                cameraId: action.payload,
            }
        case "set":
            return {
                flash: action.payload.flash,
                whiteBalance: action.payload.whiteBalance,
                cameraType: action.payload.cameraType,
                cameraId: action.payload.cameraId,
            }
        case "reset":
            return {
                flash: cameraFlashDefault,
                whiteBalance: cameraWhiteBalanceDefault,
                cameraType: cameraTypeDefault,
                cameraId: cameraIdDefault,
            }
        default:
            throw new Error("Unknown action type")
    }
}


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

    const [pictureList, setPictureList] = useState<Array<string>>([])


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (!params && pictureList.length === 0) {
            navigation.navigate("Home")
            return
        }

        if (!params && pictureList.length > 0) {
            Alert.alert(
                "Aviso",
                "Você tem fotos que não foram salvas, ao voltar elas serão perdidas",
                [
                    { text: "Cancelar", onPress: () => { } },
                    { text: "Voltar", onPress: () => navigation.navigate("Home") }
                ]
            )
            return
        }

        if (!params?.document && !params?.documentName && params?.pictureList.length === 0) {
            navigation.navigate("Home")
            return
        }

        if (!params?.document && !params?.documentName && params?.pictureList && params.pictureList.length > 0) {
            Alert.alert(
                "Aviso",
                "Você tem fotos que não foram salvas, ao voltar elas serão perdidas",
                [
                    { text: "Cancelar", onPress: () => { } },
                    { text: "Voltar", onPress: () => navigation.navigate("Home") }
                ]
            )
            return
        }

        if (params?.screenAction === "replace-picture") {
            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
                document: params.document,
                documentName: params.documentName,
                pictureList: params.pictureList,
                isChanged: false,
            })
            return
        }

        if (params?.documentName) {
            navigation.reset({
                routes: [{
                    name: "EditDocument",
                    params: {
                        document: params.document,
                        documentName: params.documentName,
                        pictureList: params.pictureList,
                        isChanged: false,
                    }
                }]
            })
            return
        }
    }

    function addPictureFromGalery() {
        if (params?.screenAction === "replace-picture") {
            navigation.reset({
                routes: [
                    { name: "Home" },
                    {
                        name: "EditDocument",
                        params: {
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: params.pictureList,
                        }
                    },
                    {
                        name: "VisualizePicture",
                        params: {
                            pictureIndex: params.replaceIndex,
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: [...params.pictureList, ...pictureList],
                            isChanged: false,
                        }
                    },
                    {
                        name: "ImportImageFromGalery",
                        params: {
                            document: params?.document,
                            documentName: params?.documentName,
                            pictureList: [...params.pictureList, ...pictureList],
                            screenAction: params?.screenAction,
                            replaceIndex: params?.replaceIndex,
                        }
                    }
                ]
            })
            return
        }

        navigation.reset({
            routes: [
                { name: "Home" },
                {
                    name: "ImportImageFromGalery",
                    params: {
                        document: params?.document,
                        documentName: params?.documentName,
                        pictureList: params ? [...params?.pictureList, ...pictureList] : pictureList,
                        screenAction: params?.screenAction,
                        replaceIndex: params?.replaceIndex,
                    }
                }
            ]
        })
    }

    async function takePicture() {
        createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPicture}/${date}.jpg`
        const options = {
            quality: 1,
            path: picturePath
        }

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

            if (!params?.screenAction && !params?.screenAction) {
                setPictureList(oldValue => [...oldValue, picturePath])
            } else if (params !== undefined && params.screenAction === "replace-picture" && params.replaceIndex !== undefined) {
                params.pictureList[params.replaceIndex] = picturePath

                navigation.navigate("VisualizePicture", {
                    pictureIndex: params.replaceIndex,
                    document: params.document,
                    documentName: params.documentName,
                    pictureList: params.pictureList,
                    isChanged: true,
                })
            }
        } catch (error) {
            log.error(`Camera takePicture - Erro ao tirar foto. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao tirar foto, tente novamente"
            )
        }
    }

    function editDocument() {
        navigation.reset({
            routes: [{
                name: "EditDocument",
                params: {
                    document: params?.document,
                    documentName: params?.documentName ? params?.documentName : getDocumentName(),
                    pictureList: params ? [...params?.pictureList, ...pictureList] : pictureList,
                    isChanged: true,
                }
            }]
        })
    }


    useEffect(() => {
        SettingsDatabase.getSettings()
            .then((cameraSettings) => {
                dispatchCameraSettings({
                    type: "set",
                    payload: {
                        flash: cameraSettings.cameraFlash,
                        whiteBalance: cameraSettings.cameraWhiteBalance,
                        cameraType: cameraSettings.cameraType,
                        cameraId: cameraSettings.cameraId,
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

            const cameraIdList = readCameraList.filter((item) => {
                if (item.type === 0) {
                    return item
                }
            })

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
                pictureListLength={(params ? params.pictureList.length : 0) + pictureList.length}
                screenAction={params?.screenAction}
                addPictureFromGalery={addPictureFromGalery}
                takePicture={takePicture}
                editDocument={editDocument}
            />
        </SafeScreen>
    )
}
