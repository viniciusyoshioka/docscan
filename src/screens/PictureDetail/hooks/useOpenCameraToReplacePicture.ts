import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'
import { PictureAction } from '@routes'


type OpenCameraToReplacePicture = () => void


export function useOpenCameraToReplacePicture(
  pictureIndex: number,
): OpenCameraToReplacePicture {


  const navigation = useNavigation<NavigationProps<'PictureDetail'>>()


  const openCameraToReplacePicture = useCallback(() => {
    navigation.navigate('Camera', {
      action: PictureAction.REPLACE_PICTURE,
      replaceIndex: pictureIndex,
    })
  }, [navigation, pictureIndex])


  return openCameraToReplacePicture
}
