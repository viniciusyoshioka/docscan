import { Header, HeaderButton, HeaderTitle } from "../../components"
import { translate } from "../../locales"


export interface SettingsHeaderProps {
    goBack: () => void;
}


export function SettingsHeader(props: SettingsHeaderProps) {
    return (
        <Header>
            <HeaderButton
                iconName={"arrow-back"}
                onPress={props.goBack}
            />

            <HeaderTitle title={translate("Settings_header_title")} />
        </Header>
    )
}
