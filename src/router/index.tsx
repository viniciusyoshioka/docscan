import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import Home from "../screen/Home"


const Stack = createStackNavigator()


export default function Router() {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"HomeScreen"} screenOptions={{headerShown: false}}>
                <Stack.Screen name={"Home"} component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
