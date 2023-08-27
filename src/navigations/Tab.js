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
                    fontSize: 10,
                    fontWeight: "400", 
                    marginBottom: -5,
                    color: colors.headerColor
                },
            }}
        >

            <NativeTab.Screen name="답변하기" component={Answer} 
                options={{
                    tabBarIcon: ({focused}) => {
                        return <Ionicons name={focused ? "ios-chatbubble-ellipses" : "ios-chatbubble-ellipses-outline"} color={focused ? colors.headerColor : colors.pointColor} size={28} />
                    }
                }} 
            />
            <NativeTab.Screen name="즐겨찾기" component={Favorites} 
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