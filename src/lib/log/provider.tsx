import { PropsWithChildren, createContext, useContext, useMemo } from "react"

import { useDatabase } from "@database"
import { StandardDateFormatter } from "@lib/date-formatter"
import { ILogger } from "./interfaces"
import { ConsoleLogger, DatabaseLogger, MultipleLogger } from "./loggers"


const LoggerContext = createContext<ILogger>({} as ILogger)


export function LoggerProvider({ children }: PropsWithChildren) {


  const isDevEnvironment = __DEV__ ?? true
  const { logModel } = useDatabase()


  function getLoggers() {
    const loggers: ILogger[] = []

    const databaseLogger = new DatabaseLogger(logModel)
    loggers.push(databaseLogger)

    if (isDevEnvironment) {
      const dateFormatter = new StandardDateFormatter()
      const consoleLogger = new ConsoleLogger(dateFormatter)
      loggers.push(consoleLogger)
    }

    return loggers
  }

  const logger = useMemo(() => {
    const loggers = getLoggers()
    return new MultipleLogger(...loggers)
  }, [])


  return <LoggerContext.Provider value={logger} children={children} />
}


export function useLogger() {
  return useContext(LoggerContext)
}
