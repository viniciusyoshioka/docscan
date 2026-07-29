import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'

import { useServices } from '@database'
import { StandardDateFormatter } from '@modules/date-formatter'
import type { Logger } from './logger.interface.ts'
import { ConsoleLogger, DatabaseLogger, MultipleLogger } from './loggers'


const LoggerContext = createContext<Logger | null>(null)


export function LoggerProvider(props: PropsWithChildren) {


  const { logService } = useServices()


  const getLoggers = useCallback(() => {
    const loggers: Logger[] = []

    if (__DEV__) {
      const dateFormatter = new StandardDateFormatter()
      const consoleLogger = new ConsoleLogger(dateFormatter)
      loggers.push(consoleLogger)
    }

    const databaseLogger = new DatabaseLogger(logService)
    loggers.push(databaseLogger)

    return loggers
  }, [logService])

  const logger = useMemo(() => {
    const loggers = getLoggers()
    return new MultipleLogger(...loggers)
  }, [getLoggers])


  return <LoggerContext.Provider value={logger} children={props.children} />
}


export function useLogger(): Logger {
  const logger = useContext(LoggerContext)

  if (!logger) {
    throw new Error(
      'No value returned for useLogger. Probably LoggerProvider is missing',
    )
  }

  return logger
}
