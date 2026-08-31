import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoToPictureDetailScreen = (pictureIndex: number) => void


export function useGoToPictureDetailScreen(): GoToPictureDetailScreen {


  const navigation = useNavigation<NavigationProps<'DocumentDetail'>>()


  const goToPictureDetailScreen = useCallback((pictureIndex: number) => {
    navigation.navigate(
      'PictureDetail',
      { pictureIndex },
    )
  }, [navigation])


  return goToPictureDetailScreen
}
