import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { enableScreens } from "react-native-screens"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { Home } from "@screen/Home"
import { Camera } from "@screen/Camera"
import { Settings } from "@screen/Settings"
import { EditDocument } from "@screen/EditDocument"
import { VisualizePicture } from "@screen/VisualizePicture"
import { ImportImageFromGalery } from "@screen/ImportImageFromGalery"
import { FileExplorer } from "@screen/FileExplorer"

import { ScreenParams } from "@type/"


enableScreens()
const Stack = createNativeStackNavigator<ScreenParams>()


export function Router() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={"Home"}
                screenOptions={{
                    headerShown: false,
                    animationTypeForReplace: "push",
                    animation: "fade",
                }}
            >
                <Stack.Screen
                    name={"Home"}
                    component={Home}
                />

                <Stack.Screen
                    name={"Camera"}
                    component={Camera}
                    options={{ orientation: "portrait" }}
                />

                <Stack.Screen
                    name={"Settings"}
                    component={Settings}
                />

                <Stack.Screen
                    name={"EditDocument"}
                    component={EditDocument}
                />

                <Stack.Screen
                    name={"VisualizePicture"}
                    component={VisualizePicture}
                />

                <Stack.Screen
                    name={"ImportImageFromGalery"}
                    component={ImportImageFromGalery}
                />

                <Stack.Screen
                    name={"FileExplorer"}
                    component={FileExplorer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
