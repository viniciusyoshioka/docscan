import { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { Modal, ModalButton, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, RadioButton } from "../../components"
import { translate } from "../../locales"
import { useAppTheme } from "../../services/theme"


export interface ChangeThemeProps extends ModalProps { }


export function ChangeTheme(props: ChangeThemeProps) {


    const { appTheme, switchTheme } = useAppTheme()

    const [selectedTheme, setSelectedTheme] = useState(appTheme)


    useEffect(() => {
        setSelectedTheme(appTheme)
    }, [props.visible])


    return (
        <Modal {...props}>
            <ModalTitle>
                {translate("ChangeTheme_title")}
            </ModalTitle>

            <ModalViewContent>
                <RadioButton
                    text={translate("ChangeTheme_auto")}
                    value={selectedTheme === "auto"}
                    onPress={() => setSelectedTheme("auto")} />
                <RadioButton
                    text={translate("ChangeTheme_light")}
                    value={selectedTheme === "light"}
                    onPress={() => setSelectedTheme("light")} />
                <RadioButton
                    text={translate("ChangeTheme_dark")}
                    value={selectedTheme === "dark"}
                    onPress={() => setSelectedTheme("dark")} />
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={translate("cancel")}
                    onPress={() => {
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />

                <ModalButton
                    text={translate("ok")}
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
