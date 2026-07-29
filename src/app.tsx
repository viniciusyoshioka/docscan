import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { StatusBar } from '@components'
import {
  AppDataSource,
  DatabaseName,
  DatabaseProvider,
  LogDataSource,
  TypeOrmDatabase,
} from '@database'
import { LocaleProvider } from '@locale'
import { AlertProvider } from '@modules/alert'
import { FileSystemProvider, NitroFileSystem } from '@modules/file-system'
import { LoggerProvider } from '@modules/logger'
import { useSettings } from '@modules/settings'
import { Router } from '@routes'
import { AppThemeProvider } from '@theme'


export function App() {


  const { settings } = useSettings()

  const fileSystem = useMemo(() => {
    return new NitroFileSystem()
  }, [])

  const typeormDatabase = useMemo(() => {
    return new TypeOrmDatabase({
      [DatabaseName.APP]: AppDataSource,
      [DatabaseName.LOG]: LogDataSource,
    })
  }, [])


  return (
    <>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <StatusBar />

          <AppThemeProvider theme={settings.theme}>
            <LocaleProvider>
              <AlertProvider>
                <FileSystemProvider fileSystem={fileSystem}>
                  <DatabaseProvider database={typeormDatabase}>
                    <LoggerProvider>
                      <Router />
                    </LoggerProvider>
                  </DatabaseProvider>
                </FileSystemProvider>
              </AlertProvider>
            </LocaleProvider>
          </AppThemeProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </>
  )
}
