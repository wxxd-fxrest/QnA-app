import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EvilIcons } from '@expo/vector-icons'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Profile from "./Profile";

const Setup = () => {
    const navigation = useNavigation();
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
        <Container>
            <Profile getUserData={getUserData} getProfileData={getProfileData}/>
            <Empty />
            <ShareIconBox onPress={() => {
                navigation.navigate('ShareStack', {
                    screen: 'Share',
                    params: {
                        data: getUserData, 
                    }
                })
            }}>
                <ShareIcon name="share-google" size={24} color="black" />
            </ShareIconBox>
        </Container>
    )
};

// 공유 해야 함 챗 지피티 보고~ 
const Container = styled.View`
    flex: 1;
    /* background-color: grey; */
    padding: 10px 30px;
`;

const Title = styled.Text``;

const Empty = styled.View`
    width: 2%;
    height: 2%;
`;

const ShareIconBox = styled.TouchableOpacity`
    background-color: green;
`;

const ShareIcon = styled(EvilIcons)``;

export default Setup;