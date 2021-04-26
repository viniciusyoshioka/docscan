import React, { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { Alert } from "react-native"
import { RNCamera } from "react-native-camera"
import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import Orientation from "react-native-orientation-locker"
import Icon from "react-native-vector-icons/Ionicons"

import { SafeScreen } from "../../component/Screen"
import CameraHeader from "./Header"
import CameraSettings from "./CameraSettings"
import { fullPathPictureOriginal, settingsDefaultCamera } from "../../service/constant"
import { readSettings } from "../../service/storage"
import { CameraControlButtonBase, CameraControlViewButtonIndex, cameraControlIconSize, CameraControlView, IndexControl } from "../../component/CameraControl"
import { createAllFolder } from "../../service/folder-handler"
import { getDateTime } from "../../service/date"
import { getDocumentName } from "../../service/document-handler"
import { Document } from "../../service/object-types"
import { useBackHandler } from "../../service/hook"
import { getCameraPermission } from "../../service/permission"
import { log } from "../../service/log"
import { cameraReducerAction, cameraReducerState } from "../../service/reducer"


type CameraParams = {
    Camera: {
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
    } | undefined
}


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


export default function Camera() {


    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const { params } = useRoute<RouteProp<CameraParams, "Camera">>()

    const cameraRef = useRef<RNCamera>(null)
    const [stateCameraSettings, dispatchCameraSettings] = useReducer(reducerCameraSettings, initialCameraSettings)
    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)

    const [documentName, setDocumentName] = useState<string>("Documento Vazio")
    const [pictureList, setPictureList] = useState<Array<string>>([])


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        if (params?.document === undefined && pictureList.length === 0) {
            navigation.navigate("Home")
            return
        }

        Alert.alert(
            "Este documento foi alterado", 
            "Sair agora descartará as alterações feitas neste documento, esta ação é irreversível",
            [
                {
                    text: "Voltar", 
                    onPress: () => navigation.navigate("Home")
                }, 
                {
                    text: "Cancelar", 
                    onPress: () => {}
                }
            ]
        )
    }, [pictureList])

    const addPictureFromGalery = useCallback(() => {
        navigation.navigate("ImportImageFromGalery", {
            document: params?.document,
            documentName: documentName,
            pictureList: pictureList,
        })
    }, [pictureList, documentName])

    const takePicture = useCallback(async () => {
        createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPictureOriginal}/${date}.jpg`
        const options = {
            quality: 0.2,
            path: picturePath
        }

        const hasCameraPermission = await getCameraPermission()
        if (!hasCameraPermission) {
            log("INFO", "Camera takePicture - Não tem permissão para tirar foto")
            return
        }

        try {
            await cameraRef.current?.takePictureAsync(options)
            setPictureList(oldValue => [...oldValue, picturePath])
        } catch (error) {
            log("ERROR", `Camera takePicture - Erro ao tirar foto. Mensagem: "${error}"`)
            Alert.alert(
                "Erro ao tirar foto", 
                "Não foi possível tirar foto, erro desconhecido"
            )
        }
    }, [cameraRef])

    const editDocument = useCallback(() => {
        let newDocumentName = "Documento Vazio"
        if (documentName === "Documento Vazio" && pictureList.length > 0) {
            newDocumentName = getDocumentName()
        }

        navigation.navigate("EditDocument", {
            document: params?.document,
            documentName: documentName === "Documento Vazio" ? newDocumentName : documentName,
            pictureList: pictureList,
        })
    }, [pictureList, documentName])


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

        Orientation.lockToPortrait()
        return () => {
            Orientation.unlockAllOrientations()
        }
    }, [])

    useEffect(() => {
        if (params) {
            setDocumentName(params.documentName)
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

            {isFocused && (
                <RNCamera
                    style={{flex: 1, overflow: "hidden"}}
                    ref={cameraRef}
                    captureAudio={false}
                    playSoundOnCapture={false}
                    type={"back"}
                    useNativeZoom={true}
                    flashMode={stateCameraSettings.flash}
                    whiteBalance={stateCameraSettings.whiteBalance}
                />
            )}

            <CameraHeader 
                goBack={goBack} 
                openSettings={() => setCameraSettingsVisible(true)}
            />

            <CameraControlView style={{position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "transparent"}}>
                <CameraControlButtonBase onPress={addPictureFromGalery}>
                    <Icon 
                        name={"md-image-outline"} 
                        size={cameraControlIconSize} 
                        color={"rgb(255, 255, 255)"}
                    />
                </CameraControlButtonBase>

                <CameraControlButtonBase 
                    onPress={takePicture} 
                    style={{backgroundColor: "rgb(255, 255, 255)"}}
                />

                <CameraControlButtonBase onPress={editDocument}>
                    <CameraControlViewButtonIndex>
                        <Icon 
                            name={"md-document-outline"} 
                            size={cameraControlIconSize} 
                            color={"rgb(255, 255, 255)"}
                        />

                        <IndexControl>
                            {`${pictureList.length}`}
                        </IndexControl>
                    </CameraControlViewButtonIndex>
                </CameraControlButtonBase>
            </CameraControlView>
        </SafeScreen>
    )
}
