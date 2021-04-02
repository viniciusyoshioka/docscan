import React, { useContext, useEffect, useState } from "react"

import { ModalButton, ModalTitle, ModalView, ModalViewButton, ModalViewContent } from "../../component/ModalComponent"
import { ModalFullscreen, ModalFullscreenProps } from "../../component/ModalFullscreen"
import { RadioButton } from "../../component/RadioButton"
import { themeAuto, themeDark, themeLight } from "../../service/constant"
import { SwitchThemeContext, ThemeContext } from "../../service/theme"


export interface ChangeThemeProps extends ModalFullscreenProps {}


export default function ChangeTheme(props: ChangeThemeProps) {


    const { appTheme } = useContext(ThemeContext)
    const switchTheme = useContext(SwitchThemeContext)

    const [selectedTheme, setSelectedTheme] = useState(appTheme)


    useEffect(() => {
        setSelectedTheme(appTheme)
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
                            switchTheme(selectedTheme)
                            props.setVisible(false)
                        }}
                    />
                </ModalViewButton>
            </ModalView>
        </ModalFullscreen>
    )
}
