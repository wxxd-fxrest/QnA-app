import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setup from "../screens/setup/Setup";
import Share from "../screens/setup/Share";

const ShareNavigation = createNativeStackNavigator(); 

const ShareStack = () => {
    return (
        <ShareNavigation.Navigator 
            screenOptions={{
                presentation: "modal", 
                headerShown: false
            }}>
            <ShareNavigation.Screen name="Setup" component={Setup}/>
            <ShareNavigation.Screen name="Share" component={Share}/>
        </ShareNavigation.Navigator>
    )
};

export default ShareStack;  