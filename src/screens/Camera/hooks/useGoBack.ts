import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { useDocumentState } from '@modules/document-state'
import type { NavigationProps } from '@routes'
import { PictureAction, useScreenParams } from '@routes'


interface GoBackParams {
  isSettingsVisible: boolean
  hideSettings: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {
  const { isSettingsVisible, hideSettings } = params


  const navigation = useNavigation<NavigationProps<'Camera'>>()
  const screenParams = useScreenParams<'Camera'>()

  const { closeDocument } = useDocumentState()


  const goBack = useCallback<GoBack>((): boolean => {
    if (isSettingsVisible) {
      hideSettings()
      return true
    }

    if (screenParams?.action === PictureAction.REPLACE_PICTURE) {
      navigation.navigate('PictureDetail', {
        pictureIndex: screenParams.replaceIndex,
      })
      return true
    }

    if (screenParams?.action === PictureAction.ADD_PICTURE) {
      navigation.navigate('DocumentDetail')
      return true
    }

    closeDocument()
    navigation.goBack()
    return true
  }, [
    isSettingsVisible,
    hideSettings,
    screenParams,
    navigation,
    closeDocument,
  ])


  return goBack
}
