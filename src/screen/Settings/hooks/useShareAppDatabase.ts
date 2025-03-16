import { useCallback } from "react"
import { Alert } from "react-native"
import Share from "react-native-share"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { Constants } from "@services/constant"
import { PathUtils, stringifyError } from "@utils"


type ShareAppDatabase = () => Promise<void>


export function useShareAppDatabase(): ShareAppDatabase {


  const logger = useLogger()


  const shareAppDatabase = useCallback(async () => {
    try {
      const databasePath = PathUtils.fullPathToFileProtocol(Constants.appDatabaseFullPath)

      await Share.open({
        type: "application/x-sqlite3",
        url: databasePath,
        failOnCancel: false,
      })
    } catch (error) {
      Alert.alert(
        translate("warn"),
        translate("Settings_alert_errorSharingAppDatabase_text"),
      )

      const errorMessage = stringifyError(error)
      await logger.error(`Error sharing app database file: "${errorMessage}"`)
    }
  }, [logger])


  return shareAppDatabase
}
