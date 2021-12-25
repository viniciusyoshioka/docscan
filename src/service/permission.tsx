import { PermissionsAndroid } from "react-native"


export async function getCameraPermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.CAMERA")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.CAMERA")
        return requestedPermission === "granted"
    }
    return true
}


export async function getReadPermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.READ_EXTERNAL_STORAGE")
        return requestedPermission === "granted"
    }
    return true
}


export async function getWritePermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.WRITE_EXTERNAL_STORAGE")
        return requestedPermission === "granted"
    }
    return true
}
