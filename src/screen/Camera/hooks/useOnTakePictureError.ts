import { useCallback } from "react"
import { Alert } from "react-native"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { stringifyError } from "@utils"


export function useOnTakePictureError() {


  const logger = useLogger()


  const onTakePictureError = useCallback(async (errorThrown: Error) => {
    try {
      Alert.alert(
        translate("warn"),
        translate("Camera_alert_unknownErrorTakingPicture_text"),
      )

      const errorMessage = stringifyError(errorThrown)
      await logger.error(`Error taking picture: ${errorMessage}`)
    } catch (error) {
      const errorMessage = stringifyError(error)
      await logger.error(`Error while handling error trying to take a picture: ${errorMessage}`)
    }
  }, [logger])


  return onTakePictureError
}
