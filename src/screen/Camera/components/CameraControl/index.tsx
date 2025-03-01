import { useRoute } from "@react-navigation/native"

import { RouteProps } from "@router"
import { ActionBar, ActionButton, CaptureButton } from "./components"
import { useIsCaptureButtonEnabled } from "./hooks"


export { useCameraControlStyle } from "./hooks"


interface CameraControlProps {
  isShowingCamera: boolean
  addPictureFromGallery: () => void
  takePicture: () => void
  editDocument: () => void
}


// TODO: Get picture count from state
export function CameraControl(props: CameraControlProps) {


  const { params } = useRoute<RouteProps<"Camera">>()

  const picturesCount = (0).toString()
  const isCaptureButtonEnabled = useIsCaptureButtonEnabled(props.isShowingCamera)


  return (
    <ActionBar isShowingCamera={props.isShowingCamera}>
      <ActionButton
        icon={"image-multiple-outline"}
        onPress={props.addPictureFromGallery}
        isShowingCamera={props.isShowingCamera}
      />


      <CaptureButton
        isDisabled={!isCaptureButtonEnabled}
        onPress={props.takePicture}
        isShowingCamera={props.isShowingCamera}
      />


      {params?.action !== "replace-picture" && (
        <ActionButton
          icon={"file-document-outline"}
          counter={picturesCount}
          onPress={props.editDocument}
          isShowingCamera={props.isShowingCamera}
        />
      )}

      {params?.action === "replace-picture" && (
        <ActionButton isShowingCamera={props.isShowingCamera} />
      )}
    </ActionBar>
  )
}
