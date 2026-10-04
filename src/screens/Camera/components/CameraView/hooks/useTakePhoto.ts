import type { RefObject } from 'react'
import { useCallback } from 'react'
import type { CameraPhotoOutput, FlashMode } from 'react-native-vision-camera'

import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import type { PictureTakenFeedbackRef } from '../components'


interface TakePhotoParams {
  photoOutput: CameraPhotoOutput
  mappedCameraFlash: FlashMode
  pictureTakenFeedbackRef: RefObject<PictureTakenFeedbackRef | null>
}


type TakePhoto = () => Promise<AbsolutePath>


export function useTakePhoto(params: TakePhotoParams): TakePhoto {
  const { photoOutput, mappedCameraFlash, pictureTakenFeedbackRef } = params


  const fileSystem = useFileSystem()


  const takePhoto = useCallback(async () => {
    pictureTakenFeedbackRef.current?.showFeedback()

    const { filePath } = await photoOutput.capturePhotoToFile(
      {
        enableShutterSound: false,
        flashMode: mappedCameraFlash,
      },
      {},
    )

    const photoPath = new AbsolutePath(filePath)
    // TODO: There is a low chance of this file name already exists on
    // `Info.folders.internal.temp`
    const randomPhotoPath = await fileSystem.getNewRandomFileBasedAt(photoPath)

    const tmpImagePath = new AbsolutePath([
      Info.folders.internal.temp,
      randomPhotoPath.baseName,
    ])

    await fileSystem.moveFile(photoPath, tmpImagePath)

    return tmpImagePath
  }, [pictureTakenFeedbackRef, photoOutput, mappedCameraFlash, fileSystem])


  return takePhoto
}
