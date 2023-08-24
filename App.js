import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AppLoading from "expo-app-loading"; 
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons"
import AuthRoot from './src/navigations/AuthRoot';
import Drawer from './src/navigations/Drawer';

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const App = () => {
    const [ready, setReady] = useState(false);
    const [isAuthentication, setIsAuthentication] = useState(false); 
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            if(user) {
                setIsAuthentication(true);
            } else {
                setIsAuthentication(false);
            }
        })
    }, []);

	const onFinish = () => setReady(true);

    const startLoading = async () => {
        const fonts = loadFonts([Ionicons.font]);
        await Promise.all([...fonts]);
    };

    if (!ready) {
        return (
            <AppLoading
                startAsync={startLoading}
                onFinish={onFinish}
                onError={console.error}
            />
        );
    }

    return (
        <NavigationContainer>
			{isAuthentication ? <Drawer /> : <AuthRoot />}
        </NavigationContainer>
    );
}

export default App;