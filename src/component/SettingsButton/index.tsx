import React from "react"
import { RectButton, RectButtonProps } from "react-native-gesture-handler"
import styled from "styled-components/native"
import Icon from "react-native-vector-icons/Ionicons"

import { styledProps, useTheme } from "../../service/theme"


const SettingsButtonBase = styled(RectButton)`
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    padding: 16px;
    width: 100%;
    height: 72px;
    max-height: 72px;
    background-color ${(props: styledProps) => props.theme.color.settingsButton_background};
`


const IconView = styled.View`
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    max-width: 32px;
    max-height: 32px;
`


const TextView = styled.View`
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    height: 40px;
    max-height: 40px;
    padding-left: 16px;
`


const ButtonTitle = styled.Text`
    width: 100%;
    font-size: 16px;
    color: ${(props: styledProps) => props.theme.color.settingsButton_colorFirst};
`


const ButtonDescription = styled.Text`
    width: 100%;
    font-size: 13px;
    color: ${(props: styledProps) => props.theme.color.settingsButton_colorSecond};
`


export interface SettingsButtonProps extends RectButtonProps {
    iconName?: string,
    title?: string,
    description?: string,
}


export function SettingsButton(props: SettingsButtonProps) {


    const { color } = useTheme()


    return (
        <SettingsButtonBase {...props}>
            {props.iconName && (
                <IconView>
                    <Icon
                        name={props.iconName}
                        size={24}
                        color={color.settingsButton_colorFirst}
                    />
                </IconView>
            )}

            <TextView>
                {props.title && (
                    <ButtonTitle>
                        {props.title}
                    </ButtonTitle>
                )}

                {props.description && (
                    <ButtonDescription>
                        {props.description}
                    </ButtonDescription>
                )}
            </TextView>
        </SettingsButtonBase>
    )
}
