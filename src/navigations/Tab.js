import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Answer from "../screens/answers/Answer";
import Favorites from "../screens/answers/Favorites";
import { colors } from "../../colors";
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

const NativeTab = createBottomTabNavigator();

const Tab = ({ navigation: {setOptions}, route: {params} }) => {
    // console.log("params", params)
    useEffect(() => {
        setOptions({
            title: params.getUserData.name,
        }); 
    }, []); 

    return (
        <NativeTab.Navigator 
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                headerStyle: {
                    backgroundColor: "white",
                },
                tabBarStyle: {
                    backgroundColor: "white",
                },
                tabBarIconStyle: {
                    color: colors.headerColor,
                    marginTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "700", 
                    marginBottom: -8,
                },
            }}
        >

            <NativeTab.Screen name="Answer" component={Answer} 
                options={{
                    tabBarIcon: ({focused}) => {
                        return <Ionicons name={focused ? "ios-chatbubble-ellipses" : "ios-chatbubble-ellipses-outline"} color={focused ? colors.headerColor : colors.pointColor} size={28} />
                    }
                }} 
            />
            <NativeTab.Screen name="Favorites" component={Favorites} 
                options={{
                    tabBarIcon: ({focused}) => {
                        return <MaterialIcons name="bubble-chart" color={focused ? colors.headerColor : colors.pointColor} size={30} />
                    }
                }}
            />

        </NativeTab.Navigator>
    )
};

export default Tab; 