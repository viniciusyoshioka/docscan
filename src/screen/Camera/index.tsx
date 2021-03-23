import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, BackHandler, ToastAndroid } from "react-native"
import { RNCamera } from "react-native-camera"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import Orientation from "react-native-orientation-locker"
import Icon from "react-native-vector-icons/Ionicons"

import { SafeScreen } from "../../component/Screen"
import CameraHeader from "./Header"
import CameraSettings from "./CameraSetings"
import { fullPathPictureOriginal, settingsDefaultCamera } from "../../service/constant"
import { readSettings } from "../../service/storage"
import { CameraControlButtonBase, cameraControlIconSize, CameraControlView } from "../../component/CameraControl"
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
    const { params } = useRoute<RouteProp<CameraParams, "Camera">>()
    const cameraRef = useRef<RNCamera>(null)

    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)
    const [cameraSettings, setCameraSettings] = useState(settingsDefaultCamera)
    const [flash, setFlash] = useState(cameraSettings.flash)
    const [focus, setFocus] = useState(cameraSettings.focus)
    const [whiteBalance, setWhiteBalance] = useState(cameraSettings.whiteBalance)

    const [documentName, setDocumentName] = useState("Documento vazio")
    const [pictureList, setPictureList] = useState<Array<string>>([])
    const [documentObject, setDocumentObject] = useState<Document | undefined>(undefined)


    const readCameraSettings = useCallback(async () => {
        // Read camera settings
        const currentSettings = await readSettings()
        setCameraSettings(currentSettings.camera)
        // Set camera attributes
        setFlash(currentSettings.camera.flash)
        setFocus(currentSettings.camera.focus)
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
            ]
        )
    }, [pictureList])

    const backhandlerFunction = useCallback(() => {
        goBack()
        return true
    }, [goBack])

    const setBackhandler = useCallback(() => {
        BackHandler.addEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [backhandlerFunction])

    const removeBackhandler = useCallback(() => {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [backhandlerFunction])

    const addPictureFromGalery = useCallback(() => {
        ToastAndroid.show("Add picture from galery is not available yet", 10)
    }, [])

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
                "Não foi possível tirar foto, ocorreu erro desconhecido"
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
        setBackhandler()

        return () => {
            removeBackhandler()
        }
    }, [backhandlerFunction])

    useEffect(() => {
        navigation.addListener("focus", setBackhandler)

        return () => {
            navigation.removeListener("focus", setBackhandler)
        }
    }, [setBackhandler])

    useEffect(() => {
        navigation.addListener("blur", removeBackhandler)

        return () => {
            navigation.removeListener("blur", removeBackhandler)
        }
    }, [removeBackhandler])

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
                cameraAttributes={{flash, focus, whiteBalance}}
                buttonFunctions={{setFlash, setFocus, setWhiteBalance}}
            />

            <RNCamera
                style={{flex: 1}}
                ref={cameraRef}
                captureAudio={false}
                playSoundOnCapture={false}
                type={"back"}
                useNativeZoom={true}
                flashMode={flash}
                focusDepth={focus}
                whiteBalance={whiteBalance}
            />

            {/* <View style={{flex: 1, backgroundColor: "rgb(180, 180, 180)"}} /> */}

            <CameraHeader 
                goBack={goBack} 
                openSettings={() => setCameraSettingsVisible(true)}
            />

            <CameraControlView style={{position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "transparent"}}>
                <CameraControlButtonBase onPress={() => addPictureFromGalery()}>
                    <Icon 
                        name={"md-image-outline"} 
                        size={cameraControlIconSize} 
                        color={"rgb(255, 255, 255)"} />
                </CameraControlButtonBase>

                <CameraControlButtonBase 
                    onPress={async () => await takePicture()} 
                    style={{backgroundColor: "rgb(255, 255, 255)"}}
                />

                <CameraControlButtonBase onPress={() => editDocument()}>
                    <Icon 
                        name={"md-document-outline"} 
                        size={cameraControlIconSize} 
                        color={"rgb(255, 255, 255)"} />
                </CameraControlButtonBase>
            </CameraControlView>
        </SafeScreen>
    )
}
