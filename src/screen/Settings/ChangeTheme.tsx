import { Button, Modal, ModalActions, ModalProps, ModalTitle } from "@elementium/native"
import { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { RadioButton } from "../../components"
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

            <ModalActions>
                <Button
                    variant={"text"}
                    text={translate("cancel")}
                    onPress={() => {
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />

                <Button
                    variant={"text"}
                    text={translate("ok")}
                    onPress={() => {
                        switchTheme(selectedTheme)
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalActions>
        </Modal>
    )
}
