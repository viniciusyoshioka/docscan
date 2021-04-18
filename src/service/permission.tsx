import { PermissionsAndroid, Rationale } from "react-native";


export async function getCameraPermission(): Promise<boolean> {
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) {
        return true
    }

    const cameraPermissionOption: Rationale = {
        title: "Permitir uso da câmera",
        message: "Para usar a câmera é necessário dar permissão",
        buttonPositive: "Permitir",
        buttonNegative: "Negar",
        buttonNeutral: "Perguntar mais tarde"
    }
    const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA, 
        cameraPermissionOption
    )
    if (permissionStatus == "granted") {
        return true
    }
    return false
}


export async function getCameraRollPermission(): Promise<boolean> {
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) {
        return true
    }

    const cameraRollPermissionOption: Rationale = {
        title: "Permitir uso da galeria",
        message: "Para usar a galeria é necessário dar permissão",
        buttonPositive: "Permitir",
        buttonNegative: "Negar",
        buttonNeutral: "Perguntar mais tarde"
    }
    const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, 
        cameraRollPermissionOption
    )
    if (permissionStatus == "granted") {
        return true
    }
    return false
}
