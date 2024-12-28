import { PropsWithChildren, createContext, useCallback, useContext, useMemo } from "react"

import { useLogRealm } from "@database"
import { StandardDateFormatter } from "@libs/date-formatter"
import { Logger } from "./interfaces"
import { ConsoleLogger, DatabaseLogger, MultipleLogger } from "./loggers"


const LoggerContext = createContext<Logger>({} as Logger)


export function LoggerProvider({ children }: PropsWithChildren) {


  const isDevEnvironment = __DEV__ ?? true
  const logRealm = useLogRealm()


  const getLoggers = useCallback(() => {
    const loggers: Logger[] = []

    if (isDevEnvironment) {
      const dateFormatter = new StandardDateFormatter()
      const consoleLogger = new ConsoleLogger(dateFormatter)
      loggers.push(consoleLogger)
    }

    const databaseLogger = new DatabaseLogger(logRealm)
    loggers.push(databaseLogger)

    return loggers
  }, [])

  const logger = useMemo(() => {
    const loggers = getLoggers()
    return new MultipleLogger(...loggers)
  }, [getLoggers])


  return <LoggerContext.Provider value={logger} children={children} />
}


export function useLogger() {
  return useContext(LoggerContext)
}
