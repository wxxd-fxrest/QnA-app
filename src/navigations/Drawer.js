import React, { useEffect, useState } from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomDrawer from '../components/CustomDrawer.js';
import AskScreen from '../screens/AskScreen';
import Tab from './Tab';
import Stack from './Stack';
import { colors } from '../../colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const NavigateDrawer = createDrawerNavigator();

const Drawer = () => {
	const [currentUser, setCurrentUser] = useState([]);
    const [getUserData, setGetUserData] = useState([]);
	const [getProfileData, setGetProfileData] = useState([]);

	useEffect(() => {
        setCurrentUser(auth().currentUser);
    }, [currentUser]);

    useEffect(() => {
        const subscriber = firestore().collection('Users').doc(`${currentUser.email}`)
            .onSnapshot(documentSnapshot => {
                setGetUserData(documentSnapshot.data());
                // console.log('User data: ', documentSnapshot.data());
        });
        return () => subscriber();
    }, [currentUser]);

    useEffect(() => {
        const subscriber = firestore().collection('Users').doc(`${currentUser.email}`).collection('UsersData').doc('URL')
            .onSnapshot(documentSnapshot => {
                setGetProfileData(documentSnapshot.data());
                // console.log('User data: ', documentSnapshot.data());
        });
        return () => subscriber();
    }, [currentUser]);
    
    return (
        <NavigateDrawer.Navigator
            initialRouteName="Home"
            NavigateDrawerPosition="left"
            backBehavior="history"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "white",
                },
                headerTintColor: colors.headerColor,
                
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
				drawerLabelStyle: {
					fontWeight: 'bold',
				},
				drawerActiveTintColor: 'white',
				drawerActiveBackgroundColor: 'rgba(45, 68, 33, 0.7)',
				drawerInactiveBackgroundColor: "rgba(173, 189, 164, 0.15)",
            }}
			
            drawerContent={(props) => <CustomDrawer {...props} getUserData={getUserData} getProfileData={getProfileData}/>}
        >
            <NavigateDrawer.Screen name="Ask" component={AskScreen} 
				options={{
					drawerIcon: ({focused}) => {
						return <Ionicons name={focused ? "ios-chatbubble-ellipses" : "ios-chatbubble-ellipses-outline"} color={focused ? 'white' : 'rgba(45, 68, 33, 0.4)'} size={23} />
					}
				}}
			/>

            <NavigateDrawer.Screen name={getUserData ? getUserData.name || '프로필' : '프로필'}  component={Tab} 
				options={{
					drawerIcon: ({focused}) => {
						return <MaterialIcons name="bubble-chart" color={focused ? 'white' : 'rgba(45, 68, 33, 0.4)'} size={23} />
					}
				}}
				initialParams={{getUserData}}
			/>

            <NavigateDrawer.Screen name="설정" component={Stack} 
				options={{
					drawerIcon: ({focused}) => {
						return <AntDesign name="setting"color={focused ? 'white' : 'rgba(45, 68, 33, 0.4)'} size={20} />
					}
				}}
				initialParams={{getUserData}}
			/>
        </NavigateDrawer.Navigator>
    )
};

export default Drawer;