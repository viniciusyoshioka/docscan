import { useCallback, useEffect } from 'react'

import { PicturesListStatus } from './usePicturesList.ts'


const FINAL_STATUS = [
  PicturesListStatus.IS_EMPTY,
  PicturesListStatus.HAS_DATA,
]


interface OnFinishLoadingPictureListParams {
  totalPictures: number
}

type OnFinishLoadingPictureList = (
  params: OnFinishLoadingPictureListParams,
) => void


interface UseOnFinishLoadingPictureListParams {
  status: PicturesListStatus
  totalPictures: number
  onFinishLoadingPictureList: OnFinishLoadingPictureList
}


export function useOnFinishLoadingPictureList(
  params: UseOnFinishLoadingPictureListParams,
) {
  const { status, totalPictures, onFinishLoadingPictureList } = params


  const checkFinishLoadingPictureList = useCallback(() => {
    const hasLoaded = FINAL_STATUS.includes(status)
    if (!hasLoaded) {
      return
    }

    onFinishLoadingPictureList({
      totalPictures,
    })
  }, [status, totalPictures, onFinishLoadingPictureList])


  useEffect(() => {
    checkFinishLoadingPictureList()
  }, [status])
}
