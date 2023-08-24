import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import DefaultImage from '../../assets/QnA-Profile.png';
import { Feather } from '@expo/vector-icons'; 
import { LayoutAnimation } from "react-native";
import ProfileEdit from "./ProfileEdit";

const Profile = ({getUserData, getProfileData}) => {
    const [edit, setEdit] = useState(false);

    const onEdit = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setEdit(!edit);
    };

    return (
        <Container>
            {edit === false ? 
                <ProfileBox>
                    <ProfileEditButton onPress={onEdit}>
                        <Feather name="edit" size={18} color="black" />
                        <EditTitle> 수정 </EditTitle>
                    </ProfileEditButton>
                    <ProfileImage source={getProfileData ? {uri: getProfileData.profileImgURL} : DefaultImage}/>
                    <ProfileTextBox>
                        <ProfileName>{getUserData.name}</ProfileName>
                    </ProfileTextBox>
                </ProfileBox>
            : 
                <ProfileEdit getUserData={getUserData} getProfileData={getProfileData} onEdit={onEdit}/>
            }
        </Container>
    )
};

const Container = styled.View``;

const Title = styled.Text``;

const ProfileBox = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 10px 0px;
    border-bottom-width: 1px;
    border-bottom-color: ${colors.headerColor};
`;

const ProfileEditButton = styled.TouchableOpacity`
    position: absolute;
    top: 20px;
    right: 0px;
    flex-direction: row;
    align-items: center;
    border-radius: 20px;
    border: 1px black;
    padding: 5px 10px;
`;

const EditTitle = styled.Text`
    font-size: 13px;

`;

const ProfileTextBox = styled.View`
    margin: 10% 0px;
`;

const ProfileImage = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 30px;
    margin-right: 30px;
`;

const ProfileName = styled.Text`
    font-size: 19px;
    font-weight: bold;
    color: ${colors.headerColor};
`;

export default Profile;