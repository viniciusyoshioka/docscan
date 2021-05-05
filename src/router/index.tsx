import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { enableScreens } from "react-native-screens"
import { createNativeStackNavigator } from "react-native-screens/native-stack"

import { Home } from "../screen/Home"
import { Camera } from "../screen/Camera"
import { Settings } from "../screen/Settings"
import { EditDocument } from "../screen/EditDocument"
import { VisualizePicture } from "../screen/VisualizePicture"
import { ImportImageFromGalery } from "../screen/ImportImageFromGalery"


enableScreens()
const Stack = createNativeStackNavigator()


export function Router() {
    return(
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={"HomeScreen"}
                screenOptions={{
                    headerShown: false,
                    replaceAnimation: "push",
                    stackAnimation: "fade",
                }}
            >
                <Stack.Screen
                    name={"Home"}
                    component={Home}
                />
                <Stack.Screen
                    name={"Camera"}
                    component={Camera}
                    options={{screenOrientation: "portrait"}}
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}
