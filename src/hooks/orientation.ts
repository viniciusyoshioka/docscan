import { useEffect, useState } from "react"
import OrientationLocker, { OrientationType } from "react-native-orientation-locker"


export function useDeviceOrientation(): OrientationType {
    const [orientation, setOrientation] = useState(OrientationLocker.getInitialOrientation())

    useEffect(() => {
        function onDeviceOrientationChange(deviceOrientation: OrientationType) {
            setOrientation(deviceOrientation)
        }

        OrientationLocker.addDeviceOrientationListener(onDeviceOrientationChange)
        return () => {
            OrientationLocker.removeDeviceOrientationListener(onDeviceOrientationChange)
        }
    })

    return orientation
}
