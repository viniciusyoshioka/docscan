import { useCallback, useEffect } from "react"
import { Alert } from "react-native"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { getNotificationPermission } from "@services/permission"
import { stringifyError } from "@utils"


export function useRequestNotificationPermission() {


  const logger = useLogger()


  const requestPermissions = useCallback(async () => {
    try {
      const hasPermission = await getNotificationPermission()
      if (!hasPermission) {
        Alert.alert(
          translate("Home_alert_notificationPermissionDenied_title"),
          translate("Home_alert_notificationPermissionDenied_text"),
        )
      }
    } catch (error) {
      const errorMessage = stringifyError(error)
      logger.error(`Error requesting notification permission: ${errorMessage}`)
    }
  }, [logger])


  useEffect(() => {
    requestPermissions()
  }, [])
}
