import React, { useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/core"
import Share from "react-native-share"

import { SettingsHeader } from "./Header"
import { ChangeTheme } from "./ChangeTheme"
import { TextVersion, ViewVersion } from "./style"
import { ListItem, SafeScreen } from "../../component"
import { appName, appType, appVersion, logDatabaseFullPath } from "../../service/constant"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
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

    async function shareLogFile() {
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


    return (
        <SafeScreen>
            <ChangeTheme
                visible={changeThemeVisible}
                setVisible={setChangeThemeVisible}
            />

            <SettingsHeader
                goBack={goBack}
            />

            <ListItem
                icon={"brightness-medium"}
                title={"Tema"}
                description={"Mudar tema de cores do aplicativo"}
                onPress={() => setChangeThemeVisible(true)}
            />

            <ListItem
                icon={"receipt-long"}
                title={"Compartilhar logs"}
                description={"Enviar registro de erros"}
                onPress={shareLogFile}
            />

            <ViewVersion>
                <TextVersion>
                    {appName} - {appVersion} - {appType}
                </TextVersion>
            </ViewVersion>
        </SafeScreen>
    )
}
