import { useRoute } from '@react-navigation/native'
import type { ViewStyle } from 'react-native'

import { useDocumentState } from '@modules/document-state'
import type { RouteProps } from '@routes'
import { PictureAction } from '@routes'
import { ActionBar, ActionButton, CaptureButton } from './components'
import { useIsCaptureButtonEnabled } from './hooks'


interface CameraControlProps {
  isShowingCamera: boolean
  cameraControlStyle: ViewStyle
  goToGallery: () => void
  takePicture: () => void
  goToDocumentDetail: () => void
}


export function CameraControl(props: CameraControlProps) {
  const {
    isShowingCamera,
    cameraControlStyle,
    goToGallery,
    takePicture,
    goToDocumentDetail,
  } = props


  const { params } = useRoute<RouteProps<'Camera'>>()

  const { pictures } = useDocumentState()

  const picturesCount = (pictures?.length ?? 0).toString()
  const isCaptureButtonEnabled = useIsCaptureButtonEnabled(
    isShowingCamera,
  )


  return (
    <ActionBar
      isShowingCamera={isShowingCamera}
      cameraControlStyle={cameraControlStyle}
    >
      <ActionButton
        icon={'image-multiple-outline'}
        onPress={goToGallery}
        isShowingCamera={isShowingCamera}
      />


      <CaptureButton
        isDisabled={!isCaptureButtonEnabled}
        onClick={takePicture}
        isShowingCamera={isShowingCamera}
      />


      {params?.action !== PictureAction.REPLACE_PICTURE && (
        <ActionButton
          icon={'file-document-outline'}
          counter={picturesCount}
          onPress={goToDocumentDetail}
          isShowingCamera={isShowingCamera}
        />
      )}

      {params?.action === PictureAction.REPLACE_PICTURE && (
        <ActionButton isShowingCamera={isShowingCamera} />
      )}
    </ActionBar>
  )
}
