import styled from "styled-components/native"


export const ModalView = styled.TouchableOpacity`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 16px;
`


export const ModalBackground = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.35);
`


export const ModalContent = styled.ScrollView`
    max-height: 344px;
`
