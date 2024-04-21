import { useEffect } from "react"
import { Alert } from "react-native"

import { translate } from "@locales"
import { getNotificationPermission } from "@services/permission"


export function useRequestNotificationPermission() {
  useEffect(() => {
    async function requestPermissions() {
      const hasPermission = await getNotificationPermission()
      if (!hasPermission) {
        Alert.alert(
          translate("Home_alert_notificationPermissionDenied_title"),
          translate("Home_alert_notificationPermissionDenied_text")
        )
      }
    }

    requestPermissions()
  }, [])
}
