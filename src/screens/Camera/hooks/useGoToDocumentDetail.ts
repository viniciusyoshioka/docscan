import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'
import { PictureAction, useScreenParams } from '@routes'


type GoToDocumentDetail = () => void


export function useGoToDocumentDetail(): GoToDocumentDetail {


  const navigation = useNavigation<NavigationProps<'Camera'>>()

  const params = useScreenParams<'Camera'>()


  const goToDocumentDetail: GoToDocumentDetail = useCallback(() => {
    if (params?.action === PictureAction.ADD_PICTURE) {
      navigation.goBack()
    } else {
      navigation.replace('DocumentDetail')
    }
  }, [params, navigation])


  return goToDocumentDetail
}
