import { View } from "react-native"
import styled from "styled-components/native"

import { FOCUS_INDICATOR_SIZE } from "."


export const FocusIndicatorBase = styled(View)`
    position: absolute;
    top: 0px;
    left: 0px;
    width: ${FOCUS_INDICATOR_SIZE}px;
    height: ${FOCUS_INDICATOR_SIZE}px;
    border-width: 2px;
    border-color: white;
`
