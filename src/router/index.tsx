import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { enableScreens } from "react-native-screens"

import { Camera } from "@screen/Camera"
import { ConvertPdfOption, EditDocument, RenameDocument } from "@screen/EditDocument"
import { Gallery } from "@screen/Gallery"
import { Home } from "@screen/Home"
import { ChangeTheme, Settings } from "@screen/Settings"
import { VisualizePicture } from "@screen/VisualizePicture"
import { useAppTheme } from "@theme"
import { ScreenParams } from "./types"


export * from "./types"


enableScreens()
const Stack = createNativeStackNavigator<ScreenParams>()


export function Router() {


    const { isDark } = useAppTheme()


    const stackNavigatorScreenOptions: NativeStackNavigationOptions = {
        animation: "fade",
        headerShown: false,
        statusBarColor: "transparent",
        statusBarTranslucent: true,
        statusBarStyle: isDark ? "light" : "dark",
    }


    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Home"} screenOptions={stackNavigatorScreenOptions}>
                <Stack.Screen name={"Home"} component={Home} />
                <Stack.Screen name={"Camera"} component={Camera} options={{ orientation: "portrait" }} />
                <Stack.Screen name={"Settings"} component={Settings} />
                <Stack.Screen name={"EditDocument"} component={EditDocument} />
                <Stack.Screen name={"VisualizePicture"} component={VisualizePicture} options={{ statusBarStyle: "light" }} />
                <Stack.Screen name={"Gallery"} component={Gallery} />

                <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
                    <Stack.Screen name={"ChangeTheme"} component={ChangeTheme} />
                    <Stack.Screen name={"ConvertPdfOption"} component={ConvertPdfOption} />
                    <Stack.Screen name={"RenameDocument"} component={RenameDocument} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
