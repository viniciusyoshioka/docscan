import { PermissionsAndroid, Rationale } from "react-native";


export async function getCameraPermission(): Promise<boolean> {
    const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA

    const hasPermission = await PermissionsAndroid.check(cameraPermission)
    
    if (hasPermission) {
        return true
    }
    
    const cameraPermissionOption: Rationale = {
        title: "Permitir uso da câmera",
        message: "Para usar a câmera é necessário dar permissão",
        buttonPositive: "Permitir",
        buttonNegative: "Negar",
        buttonNeutral: "Perguntar mais tarde"
    }
    const permissionStatus = await PermissionsAndroid.request(cameraPermission, cameraPermissionOption)
    if (permissionStatus == "granted") {
        return true
    }
    return false
}


export async function getCameraRollPermission(): Promise<boolean> {
    const cameraRollPermission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE

    const hasPermission = await PermissionsAndroid.check(cameraRollPermission)
    
    if (hasPermission) {
        return true
    }
    
    const cameraRollPermissionOption: Rationale = {
        title: "Permitir uso da galeria",
        message: "Para usar a galeria é necessário dar permissão",
        buttonPositive: "Permitir",
        buttonNegative: "Negar",
        buttonNeutral: "Perguntar mais tarde"
    }
    const permissionStatus = await PermissionsAndroid.request(cameraRollPermission, cameraRollPermissionOption)
    if (permissionStatus == "granted") {
        return true
    }
    return false
}
