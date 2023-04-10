import { Button, Modal, ModalActions, ModalContent, ModalProps, ModalTitle, RadioListItem } from "@elementium/native"
import { useEffect, useState } from "react"
import { NativeSyntheticEvent } from "react-native"

import { translate } from "../../locales"
import { useAppTheme } from "../../theme"


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

            <ModalContent>
                <RadioListItem
                    title={translate("ChangeTheme_auto")}
                    value={selectedTheme === "auto"}
                    onPress={() => setSelectedTheme("auto")}
                    style={{ paddingLeft: 0, backgroundColor: "transparent" }}
                />

                <RadioListItem
                    title={translate("ChangeTheme_light")}
                    value={selectedTheme === "light"}
                    onPress={() => setSelectedTheme("light")}
                    style={{ paddingLeft: 0, backgroundColor: "transparent" }}
                />

                <RadioListItem
                    title={translate("ChangeTheme_dark")}
                    value={selectedTheme === "dark"}
                    onPress={() => setSelectedTheme("dark")}
                    style={{ paddingLeft: 0, backgroundColor: "transparent" }}
                />
            </ModalContent>

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
