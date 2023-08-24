import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShareStack from "./ShareStack";

const NativeStack = createNativeStackNavigator();

const Stack = () => {
    return (
        <NativeStack.Navigator 
            screenOptions={{
                headerBackVisible: true,
                headerBackTitleVisible: true,
                headerBackTitleVisible: false,
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'red',
                },
                headerTitleStyle: {
                    color: "white",
                },
                contentStyle: {
                    backgroundColor: "white",
                }
            }}>
            <NativeStack.Screen name="ShareStack" component={ShareStack}/>
        </NativeStack.Navigator>
    )
};

export default Stack; 