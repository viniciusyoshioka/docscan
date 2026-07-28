import type { LanguagesToNamespacesMapType } from './locale.types.ts'
import { Namespaces, SupportedLanguages } from './locale.types.ts'

import * as enUSApp from './en-us/app.json'
import * as enUSCommon from './en-us/common.json'
import * as enUSHome from './en-us/home.json'
import * as enUSInitialization from './en-us/initialization.json'
import * as ptBRApp from './pt-br/app.json'
import * as ptBRCommon from './pt-br/common.json'
import * as ptBRHome from './pt-br/home.json'
import * as ptBRInitialization from './pt-br/initialization.json'


// TODO: Add lazy loading
export const resources: LanguagesToNamespacesMapType = {
  [SupportedLanguages.EN_US]: {
    [Namespaces.COMMON]: enUSCommon,
    [Namespaces.HOME]: enUSHome,
    [Namespaces.INITIALIZATION]: enUSInitialization,
    [Namespaces.APP]: enUSApp,
  },
  [SupportedLanguages.PT_BR]: {
    [Namespaces.COMMON]: ptBRCommon,
    [Namespaces.HOME]: ptBRHome,
    [Namespaces.INITIALIZATION]: ptBRInitialization,
    [Namespaces.APP]: ptBRApp,
  },
}
