import React, { useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/core"
import Share from "react-native-share"

import { SettingsHeader } from "./Header"
import { ChangeTheme } from "./ChangeTheme"
import { TextVersion, ViewVersion } from "./style"
import { ListItem, Screen } from "../../components"
import { appDatabaseFullPath, appName, appType, appVersion, logDatabaseFullPath } from "../../services/constant"
import { useBackHandler } from "../../hooks"
import { log } from "../../services/log"
import { NavigationParamProps } from "../../types"


export function Settings() {


    const navigation = useNavigation<NavigationParamProps<"Settings">>()

    const [changeThemeVisible, setChangeThemeVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        navigation.navigate("Home")
    }

    async function shareLogDatabaseFile() {
        try {
            await Share.open({
                title: "Compartilhar logs",
                message: "Enviar registros de erro para o desenvolvedor",
                type: "application/x-sqlite3",
                url: `file://${logDatabaseFullPath}`,
                failOnCancel: false,
            })
        } catch (error) {
            log.error(`Error sharing log file: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro ao compartilhar log"
            )
        }
    }

    async function shareAppDatabaseFile() {
        try {
            await Share.open({
                title: "Compartilhar banco de dados dos documentos",
                message: "Enviar banco de dados dos documentos para o desenvolvedor",
                type: "application/x-sqlite3",
                url: `file://${appDatabaseFullPath}`,
                failOnCancel: false,
            })
        } catch (error) {
            log.error(`Error sharing document database file: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro ao compartilhar banco de dados dos documentos"
            )
        }
    }


    return (
        <Screen>
            <SettingsHeader
                goBack={goBack}
            />

            <ListItem
                iconName={"brightness-medium"}
                title={"Tema"}
                description={"Mudar tema de cores do aplicativo"}
                onPress={() => setChangeThemeVisible(true)}
            />

            <ListItem
                iconName={"receipt-long"}
                title={"Compartilhar logs"}
                description={"Enviar registro de erros"}
                onPress={shareLogDatabaseFile}
            />

            {__DEV__ && (
                <ListItem
                    iconName={"receipt-long"}
                    title={"Compartilhar banco de dados"}
                    description={"Enviar banco de dados dos documentos"}
                    onPress={shareAppDatabaseFile}
                />
            )}

            <ViewVersion>
                <TextVersion>
                    {appName} - {appVersion} - {appType}
                </TextVersion>
            </ViewVersion>

            <ChangeTheme
                visible={changeThemeVisible}
                onRequestClose={() => setChangeThemeVisible(false)}
            />
        </Screen>
    )
}
