import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tab from "./Tab";

const RootNavigation = createNativeStackNavigator(); 

const Root = () => {

    return (
        <RootNavigation.Navigator 
            screenOptions={{
                headerShown: false
            }}>
            <RootNavigation.Screen name="Tab" component={Tab}/>
        </RootNavigation.Navigator>
    )
};

export default Root;  