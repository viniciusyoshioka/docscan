import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'
import { PictureAction } from '@routes'


type OpenCameraToAddPictures = () => void


export function useOpenCameraToAddPictures(): OpenCameraToAddPictures {


  const navigation = useNavigation<NavigationProps<'DocumentDetail'>>()


  const openCameraToAddPictures = useCallback(() => {
    navigation.navigate(
      'Camera',
      { action: PictureAction.ADD_PICTURE },
    )
  }, [navigation])


  return openCameraToAddPictures
}
