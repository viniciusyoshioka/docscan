import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps, ScreenParams } from '@routes'
import { PictureAction, useScreenParams } from '@routes'


type GoToPictureDetailScreen = () => void


export function useGoToPictureDetailScreen(
  pictureIndex?: ScreenParams['PictureDetail']['pictureIndex'],
): GoToPictureDetailScreen {


  const navigation = useNavigation<NavigationProps<'Gallery'>>()
  const screenParams = useScreenParams<'Gallery'>()


  const goToPictureDetailScreen = useCallback<GoToPictureDetailScreen>(() => {
    if (screenParams.action !== PictureAction.REPLACE_PICTURE) {
      return
    }

    const selectedPictureIndex = pictureIndex !== undefined
      ? pictureIndex
      : screenParams.replaceIndex

    navigation.navigate(
      'PictureDetail',
      { pictureIndex: selectedPictureIndex },
    )
  }, [screenParams, pictureIndex, navigation])


  return goToPictureDetailScreen
}
