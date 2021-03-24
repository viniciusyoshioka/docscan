import React from "react"
import { View } from "react-native"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle, BlockRight } from "../../component/Header"
import EditDocumentMenu from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void,
    documentName: string,
    selectionMode: boolean,
    changed: boolean,
    isNewDocument: boolean,
    deletePicture: () => void,
    openCamera: () => void,
    saveDocument: () => void,
    renameDocument: () => void,
    exportToPdf: () => void,
    discardDocument: () => void,
}


export default function EditDocumentHeader(props: EditDocumentHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                <HeaderButton 
                    onPress={() => props.goBack()} 
                    iconName={"md-arrow-back"} />
            </BlockLeft>

            <BlockCenter>
                <HeaderTitle>
                    {`${props.changed ? "*" : ""}${props.documentName}`}
                </HeaderTitle>
            </BlockCenter>

            <BlockRight>
                <View style={{opacity: props.selectionMode ? 1 : 0}}>
                    <HeaderButton
                        iconName={"md-trash-outline"}
                        onPress={() => props.deletePicture()} 
                    />
                </View>

                {(props.isNewDocument === false) && (
                    <HeaderButton
                        iconName={"md-camera-outline"}
                        onPress={() => props.openCamera()}
                    />
                )}

                <HeaderButton 
                    iconName={"md-save-outline"}
                    onPress={() => props.saveDocument()}
                />

                <EditDocumentMenu 
                    renameDocument={() => props.renameDocument()}
                    exportToPdf={() => props.exportToPdf()}
                    discardDocument={() => props.discardDocument()}
                />
            </BlockRight>
        </Header>  
    )
}
