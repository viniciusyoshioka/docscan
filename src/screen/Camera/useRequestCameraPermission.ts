import { useEffect } from "react"

import { getCameraPermission } from "../../services/permission"


export type RequestPermissionCallback = (hasPermission: boolean) => void


export function useRequestCameraPermission(callback?: RequestPermissionCallback): () => void {


    async function requestPermission() {
        const hasCameraPermission = await getCameraPermission()
        if (callback) callback(hasCameraPermission)
    }


    useEffect(() => {
        requestPermission()
    }, [])


    return requestPermission
}
