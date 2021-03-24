import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import Home from "../screen/Home"
import Camera from "../screen/Camera"
import Settings from "../screen/Settings"
import EditDocument from "../screen/EditDocument"


const Stack = createStackNavigator()


export default function Router() {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"HomeScreen"} screenOptions={{headerShown: false}}>
                <Stack.Screen name={"Home"} component={Home} />
                <Stack.Screen name={"Camera"} component={Camera} />
                <Stack.Screen name={"Settings"} component={Settings} />
                <Stack.Screen name={"EditDocument"} component={EditDocument} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
