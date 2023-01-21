import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { enableScreens } from "react-native-screens"

import { Camera } from "../screen/Camera"
import { EditDocument } from "../screen/EditDocument"
import { FileExplorer } from "../screen/FileExplorer"
import { Gallery } from "../screen/Gallery"
import { Home } from "../screen/Home"
import { Settings } from "../screen/Settings"
import { VisualizePicture } from "../screen/VisualizePicture"
import { ScreenParams } from "../types"


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
                    name={"Gallery"}
                    component={Gallery}
                />

                <Stack.Screen
                    name={"FileExplorer"}
                    component={FileExplorer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
