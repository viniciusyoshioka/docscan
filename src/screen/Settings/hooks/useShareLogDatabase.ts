import { useCallback } from "react"
import { Alert } from "react-native"
import Share from "react-native-share"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { Constants } from "@services/constant"
import { PathUtils, stringifyError } from "@utils"


type ShareLogDatabase = () => Promise<void>


export function useShareLogDatabase(): ShareLogDatabase {


  const logger = useLogger()


  const shareLogDatabase = useCallback(async () => {
    try {
      const databasePath = PathUtils.fullPathToFileProtocol(Constants.logDatabaseFullPath)

      await Share.open({
        type: "application/x-sqlite3",
        url: databasePath,
        failOnCancel: false,
      })
    } catch (error) {
      Alert.alert(
        translate("warn"),
        translate("Settings_alert_errorSharingLogDatabase_text"),
      )

      const errorMessage = stringifyError(error)
      await logger.error(`Error sharing log database file: "${errorMessage}"`)
    }
  }, [logger])


  return shareLogDatabase
}
