import { PermissionsAndroid } from "react-native"


export async function getCameraPermission(): Promise<boolean> {
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) {
        return true
    }

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    if (status === "granted") {
        return true
    }
    return false
}


export async function getCameraRollPermission(): Promise<boolean> {
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) {
        return true
    }

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    if (status === "granted") {
        return true
    }
    return false
}


export type LogPermissionResult = {
    WRITE_EXTERNAL_STORAGE: boolean;
    READ_EXTERNAL_STORAGE: boolean;
}

export async function getLogPermission(): Promise<LogPermissionResult> {
    const hasWritePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    const hasReadPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    if (hasWritePermission && hasReadPermission) {
        return {
            WRITE_EXTERNAL_STORAGE: true,
            READ_EXTERNAL_STORAGE: true
        }
    }

    const status = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, 
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    ])

    return {
        WRITE_EXTERNAL_STORAGE: status["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted",
        READ_EXTERNAL_STORAGE: status["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
    }
}
