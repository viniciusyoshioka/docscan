import { useEffect, useState } from "react"

import { getCameraPermission } from "@services/permission"


export type RequestCameraPermissionType = [boolean | undefined, () => Promise<void>]


export function useRequestCameraPermission(): RequestCameraPermissionType {


    const [hasPermission, setHasPermission] = useState<boolean>()


    async function requestPermission() {
        const hasCameraPermission = await getCameraPermission()
        setHasPermission(hasCameraPermission)
    }


    useEffect(() => {
        requestPermission()
    }, [])


    return [hasPermission, requestPermission]
}
