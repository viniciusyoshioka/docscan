import { useRoute } from "@react-navigation/native"
import { forwardRef, useImperativeHandle, useState } from "react"

import { useDocumentModel } from "@database"
import { RouteParamProps } from "@router"
import { Action } from "./Action"
import { ActionBar } from "./ActionBar"
import { MainAction } from "./MainAction"


export * from "./useCameraControlDimensions"


export interface CameraControlProps {
  isShowingCamera: boolean
  addPictureFromGallery: () => void
  takePicture: () => void
  editDocument: () => void
}


export interface CameraControlRef {
  disableAction: () => void
  enableAction: () => void
}


export const CameraControl = forwardRef<CameraControlRef, CameraControlProps>((
  props,
  ref
) => {


  const { params } = useRoute<RouteParamProps<"Camera">>()

  const { documentModel } = useDocumentModel()
  const picturesCount = (documentModel?.pictures.length ?? 0).toString()
  const [isActionDisabled, setIsActionDisabled] = useState(false)


  useImperativeHandle(ref, () => ({
    disableAction: () => setIsActionDisabled(true),
    enableAction: () => setIsActionDisabled(false),
  }))


  return (
    <ActionBar isShowingCamera={props.isShowingCamera}>
      <Action
        icon={"image-multiple-outline"}
        onPress={props.addPictureFromGallery}
        isShowingCamera={props.isShowingCamera}
      />


      <MainAction
        disabled={isActionDisabled}
        onPress={props.takePicture}
        isShowingCamera={props.isShowingCamera}
      />


      {params?.screenAction !== "replace-picture" && (
        <Action
          icon={"file-document-outline"}
          counter={picturesCount}
          onPress={props.editDocument}
          isShowingCamera={props.isShowingCamera}
        />
      )}

      {params?.screenAction === "replace-picture" && (
        <Action isShowingCamera={props.isShowingCamera} />
      )}
    </ActionBar>
  )
})
