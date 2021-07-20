import React, { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { Alert } from "react-native"
import { RNCamera } from "react-native-camera"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"

import { CameraHeader } from "./Header"
import { CameraControl } from "./Control"
import { CameraSettings } from "./CameraSettings"
import { SafeScreen } from "../../component"
import { fullPathPicture } from "../../service/constant"
import { getDateTime } from "../../service/date"
import { getDocumentName } from "../../service/document-handler"
import { createAllFolder } from "../../service/folder-handler"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { cameraIdType } from "../../service/object-types"
import { getCameraPermission } from "../../service/permission"
import { cameraReducerAction, cameraReducerState } from "../../service/reducer"
import { ScreenParams } from "../../service/screen-params"
import { settingsDefaultCamera } from "../../service/settings"
import { readSettings } from "../../service/storage"


const initialCameraSettings: cameraReducerState = {
    flash: settingsDefaultCamera.flash,
    whiteBalance: settingsDefaultCamera.whiteBalance,
    cameraType: settingsDefaultCamera.cameraType,
    cameraId: settingsDefaultCamera.cameraId,
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
                flash: settingsDefaultCamera.flash,
                whiteBalance: settingsDefaultCamera.whiteBalance,
                cameraType: settingsDefaultCamera.cameraType,
                cameraId: settingsDefaultCamera.cameraId,
            }
        default:
            throw new Error("Unknown action type")
    }
}


export function Camera() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ScreenParams, "Camera">>()

    const cameraRef = useRef<RNCamera>(null)
    const [stateCameraSettings, dispatchCameraSettings] = useReducer(reducerCameraSettings, initialCameraSettings)
    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)

    const [isMultipleCameraAvailable, setIsMultipleCameraAvailable] = useState(false)
    const [currentCameraIndex, setCurrentCameraIndex] = useState<number | null>(null)
    const [cameraList, setCameraList] = useState<Array<cameraIdType> | null>(null)

    const [pictureList, setPictureList] = useState<Array<string>>([])


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
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
                picturePath: params.picturePath,
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
    }, [params, pictureList])

    const addPictureFromGalery = useCallback(() => {
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
                            picturePath: params.picturePath,
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
                            picturePath: params.picturePath,
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
    }, [params, pictureList])

    const takePicture = useCallback(async () => {
        createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPicture}/${date}.jpg`
        const options = {
            quality: 1,
            path: picturePath
        }

        const hasCameraPermission = await getCameraPermission()
        if (!hasCameraPermission) {
            log("INFO", "Camera takePicture - Não tem permissão para tirar foto")
            Alert.alert(
                "Erro",
                "Sem permissão para usar a câmera"
            )
            return
        }

        try {
            await cameraRef.current?.takePictureAsync(options)
            if (!params?.screenAction && !params?.screenAction) {
                setPictureList(oldValue => [...oldValue, picturePath])
            } else if (params !== undefined && params.screenAction === "replace-picture" && params.replaceIndex !== undefined) {
                params.pictureList[params.replaceIndex] = picturePath

                navigation.navigate("VisualizePicture", {
                    picturePath: picturePath,
                    pictureIndex: params.replaceIndex,
                    document: params.document,
                    documentName: params.documentName,
                    pictureList: params.pictureList,
                    isChanged: true,
                })
            }
        } catch (error) {
            log("ERROR", `Camera takePicture - Erro ao tirar foto. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao tirar foto, tente novamente"
            )
        }
    }, [params, cameraRef])

    const editDocument = useCallback(() => {
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
    }, [params, pictureList])


    useEffect(() => {
        async function getCameraSettings() {
            const cameraSettings = await readSettings()
            dispatchCameraSettings({
                type: "set",
                payload: {
                    flash: cameraSettings.camera.flash,
                    whiteBalance: cameraSettings.camera.whiteBalance,
                    cameraType: cameraSettings.camera.cameraType,
                    cameraId: cameraSettings.camera.cameraId,
                }
            })
        }

        getCameraSettings()
    }, [])

    useEffect(() => {
        async function getCameraList() {
            let readCameraList: Array<cameraIdType> = [{ id: "0", type: 0 }]

            try {
                readCameraList = await cameraRef.current?.getCameraIdsAsync()
            } catch (error) {
                log("ERROR", `Camera useEffect getCameraIds - Erro ao pegar câmeras do dispositivo para trocas entre os tipos diferentes de camera. Mensagem: "${error}"`)
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

            cameraIdList.forEach((item: cameraIdType, index: number) => {
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
                cameraId={stateCameraSettings.cameraType === "back" ? stateCameraSettings.cameraId : null}
            />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setCameraSettingsVisible(true)}
            />

            <CameraControl
                pictureListLength={(params ? params.pictureList.length : 0) + pictureList.length}
                screenAction={params?.screenAction}
                addPictureFromGalery={addPictureFromGalery}
                takePicture={takePicture}
                editDocument={editDocument}
            />
        </SafeScreen>
    )
}
