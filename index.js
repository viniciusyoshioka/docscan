import { AppRegistry } from 'react-native'
import 'react-native-get-random-values'
import 'reflect-metadata'

import { name as appName } from './app.json'
import { App } from './src/app.tsx'


AppRegistry.registerComponent(appName, () => App)
