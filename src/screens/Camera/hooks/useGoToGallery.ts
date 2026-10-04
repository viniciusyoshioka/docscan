import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'
import { PictureAction, useScreenParams } from '@routes'


type GoToGallery = () => void


export function useGoToGallery(): GoToGallery {


  const navigation = useNavigation<NavigationProps<'Camera'>>()

  const params = useScreenParams<'Camera'>()


  const goToGallery: GoToGallery = useCallback(() => {
    if (params?.action === PictureAction.REPLACE_PICTURE) {
      navigation.navigate('Gallery', {
        action: params.action,
        replaceIndex: params.replaceIndex,
      })
      return
    }

    navigation.navigate('Gallery', {
      action: PictureAction.ADD_PICTURE,
    })
  }, [navigation, params])


  return goToGallery
}
