import React from "react"
import { View } from "react-native"

import { SafeScreen } from "../../component/Screen"
import HomeHeader from "./Header"


export default function Home() {
    return (
        <SafeScreen>
            <HomeHeader />
        </SafeScreen>
    )
}
