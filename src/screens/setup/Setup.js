import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EvilIcons } from '@expo/vector-icons'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Profile from "./Profile";
import Share from 'react-native-share';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from "expo-web-browser";

const Setup = () => {
	const [currentUser, setCurrentUser] = useState([]);
    const [getUserData, setGetUserData] = useState([]);
    const [getProfileData, setGetProfileData] = useState([]);

    const goWebSite = async() => {
        const WebURL = `https://wxxd-fxrest.github.io/ask-app/profile/${currentUser.email}`; 
        await WebBrowser.openBrowserAsync(WebURL)
    };

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
        <Container>
            <Profile getUserData={getUserData} getProfileData={getProfileData}/>
            <Empty />
            <ShareIconBox onPress={goWebSite}>
                <Title> 페이지를 공유해보세요! </Title>
                <ShareIcon name="share-google" size={30} color="black" />
            </ShareIconBox>
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    padding: 10px 30px;
`;

const Title = styled.Text``;

const Empty = styled.View`
    width: 2%;
    height: 2%;
`;

const ShareIconBox = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ShareIcon = styled(EvilIcons)``;

export default Setup;