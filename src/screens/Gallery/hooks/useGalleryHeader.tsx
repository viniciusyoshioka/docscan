import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Appbar } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'


interface UseGalleryHeaderParams {
  isSelectionMode: boolean
  selectedImagesCount: number
  importSelectedImages: () => Promise<void>
}


interface GalleryHeader {
  title?: string
  RightComponentSelectionMode?: ReactNode
}


export function useGalleryHeader(
  params: UseGalleryHeaderParams,
): GalleryHeader {
  const { isSelectionMode, selectedImagesCount, importSelectedImages } = params


  const { t } = useLocale()


  const title = isSelectionMode
    ? String(selectedImagesCount)
    : t('Gallery_header_title', { ns: Namespaces.APP })

  const RightComponentSelectionMode = useMemo<ReactNode>(() => (
    <>
      <Appbar.Action
        icon={'check'}
        onPress={importSelectedImages}
      />
    </>
  ), [importSelectedImages])


  const galleryHeader = useMemo<GalleryHeader>(() => ({
    title,
    RightComponentSelectionMode,
  }), [title, RightComponentSelectionMode])


  return galleryHeader
}
