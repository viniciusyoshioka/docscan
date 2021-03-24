import React, { useEffect, useState } from "react"

import { ModalButton, ModalTitle, ModalView, ModalViewButton, ModalViewContent } from "../../component/ModalComponent"
import { ModalFullscreen, ModalFullscreenProps } from "../../component/ModalFullscreen"
import { RadioButton } from "../../component/RadioButton"
import { themeAuto, themeDark, themeLight } from "../../service/constant"


export interface ChangeThemeProps extends ModalFullscreenProps {
    changeTheme: (newTheme: string) => void,
    currentTheme: string,
}


export default function ChangeTheme(props: ChangeThemeProps) {


    const [selectedTheme, setSelectedTheme] = useState(props.currentTheme)


    useEffect(() => {
        setSelectedTheme(props.currentTheme)
    }, [props.visible])


    return (
        <ModalFullscreen {...props}>
            <ModalView>
                <ModalTitle>
                    Mudar tema
                </ModalTitle>

                <ModalViewContent>
                    <RadioButton 
                        text={"Automático"} 
                        value={selectedTheme === themeAuto}
                        onPress={() => setSelectedTheme(themeAuto)} />
                    <RadioButton 
                        text={"Claro"} 
                        value={selectedTheme === themeLight}
                        onPress={() => setSelectedTheme(themeLight)} />
                    <RadioButton 
                        text={"Escuro"} 
                        value={selectedTheme === themeDark}
                        onPress={() => setSelectedTheme(themeDark)} />
                </ModalViewContent>

                <ModalViewButton>
                    <ModalButton 
                        text={"Cancelar"} 
                        onPress={() => props.setVisible(false)}
                    />

                    <ModalButton 
                        text={"Ok"} 
                        onPress={() => {
                            props.changeTheme(selectedTheme)
                            props.setVisible(false)
                        }}
                    />
                </ModalViewButton>
            </ModalView>
        </ModalFullscreen>
    )
}
