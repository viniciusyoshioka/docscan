import { PermissionsAndroid } from "react-native"


/**
 * Request Android CAMERA permission for the user
 *
 * @returns boolean indicating if the permission was granted or not
 */
export async function getCameraPermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.CAMERA")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.CAMERA")
        return requestedPermission === "granted"
    }
    return true
}


/**
 * Request Android READ_EXTERNAL_STORAGE permission for the user
 *
 * @returns boolean indicating if the permission was granted or not
 */
export async function getReadPermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.READ_EXTERNAL_STORAGE")
        return requestedPermission === "granted"
    }
    return true
}


/**
 * Request Android WRITE_EXTERNAL_STORAGE permission for the user
 *
 * @returns boolean indicating if the permission was granted or not
 */
export async function getWritePermission(): Promise<boolean> {
    const hasPermission = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE")
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request("android.permission.WRITE_EXTERNAL_STORAGE")
        return requestedPermission === "granted"
    }
    return true
}
