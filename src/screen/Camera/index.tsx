import React, { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { Alert } from "react-native"
import { RNCamera } from "react-native-camera"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"

import { SafeScreen } from "../../component/Screen"
import { CameraHeader } from "./Header"
import { CameraControl } from "./Control"
import { CameraSettings } from "./CameraSettings"
import { fullPathPicture } from "../../service/constant"
import { readSettings } from "../../service/storage"
import { createAllFolder } from "../../service/folder-handler"
import { getDateTime } from "../../service/date"
import { getDocumentName } from "../../service/document-handler"
import { useBackHandler } from "../../service/hook"
import { getCameraPermission } from "../../service/permission"
import { log } from "../../service/log"
import { cameraReducerAction, cameraReducerState } from "../../service/reducer"
import { ScreenParams } from "../../service/screen-params"
import { settingsDefaultCamera } from "../../service/settings"
import { CameraView } from "./CameraView"


const initialCameraSettings: cameraReducerState = {
    flash: settingsDefaultCamera.flash,
    whiteBalance: settingsDefaultCamera.whiteBalance
}

function reducerCameraSettings(state: cameraReducerState, action: cameraReducerAction): cameraReducerState {
    switch (action.type) {
        case "flash":
            return {
                flash: action.payload,
                whiteBalance: state.whiteBalance,
            }
        case "white-balance":
            return {
                flash: state.flash,
                whiteBalance: action.payload,
            }
        case "set":
            return {
                flash: action.payload.flash,
                whiteBalance: action.payload.whiteBalance,
            }
        case "reset":
            return {
                flash: settingsDefaultCamera.flash,
                whiteBalance: settingsDefaultCamera.whiteBalance,
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

    const [pictureList, setPictureList] = useState<Array<string>>(params ? params.pictureList : [])


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
                "Você tem fotos que não foram salvas, deseja voltar?",
                [
                    {text: "Cancelar", onPress: () => {}},
                    {text: "Voltar", onPress: () => navigation.navigate("Home")}
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
                "Você tem fotos que não foram salvas, deseja voltar?",
                [
                    {text: "Cancelar", onPress: () => {}},
                    {text: "Voltar", onPress: () => navigation.navigate("Home")}
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
            navigation.reset({routes: [{
                name: "EditDocument",
                params: {
                    document: params.document,
                    documentName: params.documentName,
                    pictureList: params.pictureList,
                    isChanged: false,
                }
            }]})
            return
        }
    }, [params, pictureList])

    const addPictureFromGalery = useCallback(() => {
        if (params?.screenAction === "replace-picture") {
            navigation.reset({routes: [
                {name: "Home"},
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
                        pictureList: pictureList,
                        isChanged: false,
                    }
                },
                {
                    name: "ImportImageFromGalery",
                    params: {
                        document: params?.document,
                        documentName: params?.documentName,
                        pictureList: pictureList,
                        screenAction: params?.screenAction,
                        replaceIndex: params?.replaceIndex,
                        picturePath: params.picturePath,
                    }
                }
            ]})
            return
        }

        navigation.reset({routes: [
            {name: "Home"},
            {
                name: "ImportImageFromGalery",
                params: {
                    document: params?.document,
                    documentName: params?.documentName,
                    pictureList: pictureList,
                    screenAction: params?.screenAction,
                    replaceIndex: params?.replaceIndex,
                }
            }
        ]})
    }, [params, pictureList])

    const takePicture = useCallback(async () => {
        createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPicture}/${date}.jpg`
        const options = {
            quality: 0.2,
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
        navigation.reset({routes: [{
            name: "EditDocument",
            params: {
                document: params?.document,
                documentName: params?.documentName ? params?.documentName : getDocumentName(),
                pictureList: pictureList,
                isChanged: true,
            }
        }]})
    }, [params, pictureList])


    useEffect(() => {
        async function getCameraSettings() {
            const cameraSettings = await readSettings()
            dispatchCameraSettings({
                type: "set", 
                payload: {
                    flash: cameraSettings.camera.flash,
                    whiteBalance: cameraSettings.camera.whiteBalance,
                }
            })
        }

        getCameraSettings()
    }, [])

    useEffect(() => {
        if (params) {
            setPictureList(params.pictureList)
        }
    }, [params])


    return (
        <SafeScreen>
            <CameraSettings
                visible={cameraSettingsVisible}
                setVisible={setCameraSettingsVisible}
                cameraAttributes={{
                    flash: stateCameraSettings.flash,
                    whiteBalance: stateCameraSettings.whiteBalance
                }}
                setCameraAttributes={dispatchCameraSettings}
            />

            <CameraView
                ref={cameraRef}
                flash={stateCameraSettings.flash}
                whiteBalance={stateCameraSettings.whiteBalance}
            />

            <CameraHeader 
                goBack={goBack} 
                openSettings={() => setCameraSettingsVisible(true)}
            />

            <CameraControl
                pictureListLength={pictureList.length}
                screenAction={params?.screenAction}
                addPictureFromGalery={addPictureFromGalery}
                takePicture={takePicture}
                editDocument={editDocument}
            />
        </SafeScreen>
    )
}
