import { useEffect, useState } from 'react'
import type { OrientationType } from 'react-native-orientation-locker'
import OrientationLocker from 'react-native-orientation-locker'


export function useDeviceOrientation(): OrientationType {


  const [orientation, setOrientation] = useState<OrientationType>(() => (
    OrientationLocker.getInitialOrientation()
  ))


  useEffect(() => {
    function onDeviceOrientationChange(deviceOrientation: OrientationType) {
      setOrientation(deviceOrientation)
    }

    OrientationLocker.addDeviceOrientationListener(onDeviceOrientationChange)
    return () => {
      OrientationLocker.removeDeviceOrientationListener(
        onDeviceOrientationChange,
      )
    }
  }, [])


  return orientation
}
