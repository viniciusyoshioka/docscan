import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type OpenRenameDocumentModal = () => void


export function useOpenRenameDocumentModal(): OpenRenameDocumentModal {


  const navigation = useNavigation<NavigationProps<'DocumentDetail'>>()


  const openRenameDocumentModal = useCallback(() => {
    navigation.navigate('RenameDocument')
  }, [navigation])


  return openRenameDocumentModal
}
