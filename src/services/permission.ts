import { PermissionsAndroid } from "react-native"


/**
 * Request Android's `CAMERA` permission to the user
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
 * Request Android's `READ_EXTERNAL_STORAGE` permission to the user
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
 * Request Android's `WRITE_EXTERNAL_STORAGE` permission to the user
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
