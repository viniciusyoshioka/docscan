import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Alert } from "react-native"

import { translate } from "@locales"
import { stringifyError } from "@utils"
import { EntityModels, useCreateModels } from "./useCreateModels"
import { useDataSources } from "./useDataSources"


const EntityModelsContext = createContext<EntityModels>({} as unknown as EntityModels)


// TODO: Add models for entities for export/import databases
export function EntityModelsProvider(props: PropsWithChildren) {


  const [models, setModels] = useState<EntityModels | undefined>()

  const { initializeDataSources, closeDataSources } = useDataSources()
  const { createRepositories, createModels } = useCreateModels()


  const initialize = useCallback(async () => {
    const initializationStatus = await initializeDataSources()

    if (!initializationStatus.success) {
      const errorMessage = stringifyError(initializationStatus.error)
      console.error(`Error opening "${initializationStatus.database}" database: ${errorMessage}`)

      Alert.alert(
        translate("criticalError"),
        translate("Database_errorInitializingDatabase"),
      )

      return
    }

    try {
      const repositories = createRepositories()
      const models = createModels(repositories)
      setModels(models)
    } catch (error) {
      const errorMessage = stringifyError(error)
      console.error(`Error creating entity models: ${errorMessage}`)

      Alert.alert(
        translate("criticalError"),
        translate("Database_errorOpeningDatabase"),
      )
    }
  }, [initializeDataSources, createRepositories, createModels])


  useEffect(() => {
    initialize()

    return () => {
      closeDataSources()
    }
  }, [])


  if (!models) {
    return null
  }


  return (
    <EntityModelsContext.Provider value={models}>
      {props.children}
    </EntityModelsContext.Provider>
  )
}


export function useEntityModels(): EntityModels {
  return useContext(EntityModelsContext)
}
