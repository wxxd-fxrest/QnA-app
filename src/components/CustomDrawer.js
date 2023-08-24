import React from 'react';
import { Dimensions, Alert } from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import styled from 'styled-components';
import { colors } from '../../colors';
import { Ionicons } from '@expo/vector-icons'; 
import DefaultImage from '../assets/QnA-Profile.png';

const {width: SCREENWIDTH, height : SCREENHEIGHT} = Dimensions.get("window");

const CustomDrawer = (props) => {
    const onLogOut = () => {
        Alert.alert(
            'Log Out',
            '정말로 로그아웃하시겠습니까?',
            [
                {
                    text: "No",
                    onPress: () => console.log("no"),
                    style: "destructive"
                },
                {
                    text: "Yes",
                    onPress: () => auth().signOut(),
                },
            ],
            {
                cancelable: true,
            },
        );
    };

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <ProfileBox>
                    <ProfileImage source={props.getProfileData ? {uri: props.getProfileData.profileImgURL} : DefaultImage}/>
                    <ProfileTextBox>
                        <ProfileName>{props.getUserData.name}</ProfileName>
                    </ProfileTextBox>
                </ProfileBox>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <LogOutContainer onPress={onLogOut}>
                <LogOutBtn name="chevron-back-outline" size={24}/>
                <LogOutText>Log Out</LogOutText>
            </LogOutContainer>
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
    padding: 0px 20px;
`;

const ProfileBox = styled.View`
    flex-direction: row;
    align-items: center;
    margin: 10% 0px;
    padding: 10px 10px;
    border-bottom-width: 1px;
    border-bottom-color: ${colors.headerColor};
`;

const ProfileTextBox = styled.View`
    margin: 10% 0px;
`;

const ProfileName = styled.Text`
    font-size: 17px;
    font-weight: bold;
    color: ${colors.headerColor};
`;

const ProfileImage = styled.Image`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: 20px;
`;

const LogOutContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 0px;
    left: 10px;
    bottom: 50px;
    padding: 20px;
`;

const LogOutBtn = styled(Ionicons)`
    margin-right: 10px;
    color: ${colors.headerColor};
`;

const LogOutText = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color: ${colors.headerColor};
`;

export default CustomDrawer;