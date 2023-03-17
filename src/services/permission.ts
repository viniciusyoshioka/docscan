import { Permission, PermissionsAndroid, Platform } from "react-native"

// TODO request permission for Android and iOS

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
 * Request Android's `READ_MEDIA_IMAGES` permission to the user
 *
 * @returns boolean indicating if the permission was granted or not
 */
export async function getReadMediaImagesPermission(): Promise<boolean> {
    const permission: Permission = Platform.Version >= 33
        ? "android.permission.READ_MEDIA_IMAGES"
        : "android.permission.READ_EXTERNAL_STORAGE"

    const hasPermission = await PermissionsAndroid.check(permission)
    if (!hasPermission) {
        const requestedPermission = await PermissionsAndroid.request(permission)
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
