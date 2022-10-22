import React, { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { Modal, ModalButton, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, RadioButton } from "../../components"
import { useColorTheme } from "../../services/theme"


export interface ChangeThemeProps extends ModalProps { }


export const ChangeTheme = (props: ChangeThemeProps) => {


    const { appTheme, switchTheme } = useColorTheme()

    const [selectedTheme, setSelectedTheme] = useState(appTheme)


    useEffect(() => {
        setSelectedTheme(appTheme)
    }, [props.visible])


    return (
        <Modal {...props}>
            <ModalTitle>
                Mudar tema
            </ModalTitle>

            <ModalViewContent>
                <RadioButton
                    text={"Automático"}
                    value={selectedTheme === "auto"}
                    onPress={() => setSelectedTheme("auto")} />
                <RadioButton
                    text={"Claro"}
                    value={selectedTheme === "light"}
                    onPress={() => setSelectedTheme("light")} />
                <RadioButton
                    text={"Escuro"}
                    value={selectedTheme === "dark"}
                    onPress={() => setSelectedTheme("dark")} />
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={"Cancelar"}
                    onPress={() => {
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />

                <ModalButton
                    text={"Ok"}
                    onPress={() => {
                        switchTheme(selectedTheme)
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalViewButton>
        </Modal>
    )
}
