import { useEffect, useState } from "react"


export interface IsCameraActive {
    hasPermission: boolean | undefined;
    isForeground: boolean;
    isFocused: boolean;
}


export function useIsCameraActive(attributes: IsCameraActive): boolean {


    function checkIsCameraActive() {
        return (
            (attributes.hasPermission === true)
            && attributes.isForeground
            && attributes.isFocused
        )
    }


    const [isCameraActive, setIsCameraActive] = useState(checkIsCameraActive)


    useEffect(() => {
        const newIsCameraActive = checkIsCameraActive()
        if (newIsCameraActive === isCameraActive) return

        setIsCameraActive(newIsCameraActive)
    }, [attributes.hasPermission, attributes.isForeground, attributes.isFocused])


    return isCameraActive
}
