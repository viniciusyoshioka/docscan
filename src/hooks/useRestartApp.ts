import { useCallback } from 'react'
import { restart } from 'react-native-restart-newarch'


export function useRestartApp() {


  const restartApp = useCallback(() => {
    restart()
  }, [])


  return restartApp
}
