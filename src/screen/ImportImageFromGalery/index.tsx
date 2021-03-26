import { useNavigation } from "@react-navigation/core"
import React, { useCallback, useState } from "react"

import { SafeScreen } from "../../component/Screen"
import ImportImageFromGaleryHeader from "./Header"


export default function ImportImageFromGalery() {


    const navigation = useNavigation()

    const [selectionMode, setSelectionMode] = useState(false)


    const goBack = useCallback(() => {
        navigation.navigate("Camera")
    }, [])

    const importImage = useCallback(() => {

    }, [])


    return (
        <SafeScreen>
            <ImportImageFromGaleryHeader
                goBack={goBack}
                importImage={importImage}
                selectionMode={selectionMode}
            />
        </SafeScreen>
    )
}
