import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Join from "../screens/auth/Join";
import Login from "../screens/auth/Login";
import { colors } from "../../colors";

const AuthStack = createNativeStackNavigator();

const AuthRoot = () => {

    return (
        <AuthStack.Navigator             
            screenOptions={{
                presentation: "modal",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: colors.headerColor,
                },
            }}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Join" component={Join} />
        </AuthStack.Navigator>
    )
};

export default AuthRoot;