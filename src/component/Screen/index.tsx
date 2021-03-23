import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const SafeScreen = styled.SafeAreaView`
    display: flex;
    flex: 1;
    background-color: ${(props: styledProps) => props.theme.color.background};
`
