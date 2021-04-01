import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { RNCamera } from "react-native-camera"
import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import Orientation from "react-native-orientation-locker"
import Icon from "react-native-vector-icons/Ionicons"
import { useBackHandler } from "@react-native-community/hooks"

import { SafeScreen } from "../../component/Screen"
import CameraHeader from "./Header"
import CameraSettings from "./CameraSetings"
import { fullPathPictureOriginal, settingsDefaultCamera } from "../../service/constant"
import { readSettings } from "../../service/storage"
import { CameraControlButtonBase, CameraControlViewButtonIndex, cameraControlIconSize, CameraControlView, IndexControl } from "../../component/CameraControl"
import { createAllFolder } from "../../service/folder-handler"
import { getDateTime } from "../../service/date"
import { getDocumentName } from "../../service/document-handler"
import { Document } from "../../service/object-types"


type CameraParams = {
    Camera: {
        newPictureList: Array<string>,
        newDocumentName: string,
        documentObject: Document,
    }
}


export default function Camera() {


    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const { params } = useRoute<RouteProp<CameraParams, "Camera">>()
    const cameraRef = useRef<RNCamera>(null)

    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)
    const [cameraSettings, setCameraSettings] = useState(settingsDefaultCamera)
    const [flash, setFlash] = useState(cameraSettings.flash)
    const [whiteBalance, setWhiteBalance] = useState(cameraSettings.whiteBalance)

    const [documentName, setDocumentName] = useState("Documento vazio")
    const [pictureList, setPictureList] = useState<Array<string>>([])
    const [documentObject, setDocumentObject] = useState<Document | undefined>(undefined)


    useBackHandler(() => {
        goBack()
        return true
    })


    const readCameraSettings = useCallback(async () => {
        // Read camera settings
        const currentSettings = await readSettings()
        setCameraSettings(currentSettings.camera)
        // Set camera attributes
        setFlash(currentSettings.camera.flash)
        setWhiteBalance(currentSettings.camera.whiteBalance)
    }, [])

    const goBack = useCallback(() => {
        if (pictureList.length === 0) {
            navigation.navigate("Home")
            return
        }

        Alert.alert(
            "Este documento não foi salvo", 
            "Sair agora descartará este documento, e esta ação não poderá ser desfeita",
            [
                {
                    text: "Voltar", 
                    onPress: () => {
                        navigation.navigate("Home")
                    }
                }, 
                {
                    text: "Cancelar", 
                    onPress: () => {}
                }
            ],
            {cancelable: false}
        )
    }, [pictureList])

    const addPictureFromGalery = useCallback(() => {
        navigation.navigate("ImportImageFromGalery", {
            pictureList: pictureList,
            documentName: documentName,
            documentObject: documentObject,
        })
    }, [pictureList, documentName, documentObject])

    const takePicture = useCallback(async () => {
        await createAllFolder()

        const date = getDateTime("-", "-", true)
        const picturePath = `${fullPathPictureOriginal}/${date}.jpg`
        const options = {
            quality: 0.3,
            path: picturePath
        }

        try {
            await cameraRef.current?.takePictureAsync(options)
            setPictureList([...pictureList, picturePath])
            if (documentName === "" || documentName === "Documento vazio") {
                setDocumentName(getDocumentName())
            }
        } catch {
            Alert.alert(
                "Erro ao tirar foto", 
                "Não foi possível tirar foto, ocorreu erro desconhecido",
                [{text: "Ok", onPress: () => {}}],
                {cancelable: false}
            )
        }
    }, [cameraRef, pictureList, documentName])

    const editDocument = useCallback(() => {
        navigation.navigate("EditDocument", {
            pictureList: pictureList,
            documentName: documentName,
            documentObject: documentObject,
        })
    }, [pictureList, documentName, documentObject])


    useEffect(() => {
        readCameraSettings()

        Orientation.lockToPortrait()
        return () => {
            Orientation.unlockAllOrientations()
        }
    }, [])

    useEffect(() => {
        if (params !== undefined) {
            setPictureList(params.newPictureList)
            setDocumentName(params.newDocumentName)
            setDocumentObject(params.documentObject)
        }
    }, [params])


    return (
        <SafeScreen>
            <CameraSettings
                visible={cameraSettingsVisible}
                setVisible={setCameraSettingsVisible}
                cameraAttributes={{flash, whiteBalance}}
                buttonFunctions={{setFlash, setWhiteBalance}}
            />

            {isFocused && (
                <RNCamera
                    style={{flex: 1, overflow: "hidden"}}
                    ref={cameraRef}
                    captureAudio={false}
                    playSoundOnCapture={false}
                    type={"back"}
                    useNativeZoom={true}
                    flashMode={flash}
                    whiteBalance={whiteBalance}
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
                    onPress={async () => await takePicture()} 
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
