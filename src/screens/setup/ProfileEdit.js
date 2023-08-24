import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import DefaultImage from '../../assets/QnA-Profile.png';
import { Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ActivityIndicator, Alert } from "react-native";

const ProfileEdit = ({getUserData, getProfileData, onEdit}) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect(() => {
        const uploadImage = async () => {
            if (!imageUrl) return;
        
            // 이미지 업로드 로직
            setLoading(true);
            try {
                const asset = imageUrl.assets[0];
                const reference = storage().ref(`/profile/${asset.fileName}`);
                await reference.putFile(asset.uri);
                const IMG_URL = await reference.getDownloadURL();
                console.log('IMG_URL', IMG_URL);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };
      
        uploadImage(); // 이미지 업로드 실행
    }, [imageUrl]); // imageUrl이 변경될 때마다 실행
      
    const handleImagePick = async () => {
        if (!status?.granted) {
            const permission = await requestPermission();
            if (!permission.granted) {
                // 권한이 거부된 경우에 대한 처리 로직
                console.log("권한이 거부되었습니다.");
                return;
            }
        }

        // 이미지 선택 로직
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
          aspect: [1, 1],
        });
      
        console.log('result', result);
        setImageUrl(result);
    };      

    const onImgEdit = async() => {
        if(imageUrl) {
            await firestore().collection('Users').doc(`${getUserData.email}`)
                .collection('UsersData').doc('URL').set({
                profileImgURL: imageUrl,
            });
        }
        if(text) {
            await firestore().collection('Users').doc(`${getUserData.email}`).update({
                name: text ? text : getUserData.name,
            });
        }
        onEdit();
    };

    return (
        <Container>
            <ProfileBox>

                <ImageEditButton onPress={onImgEdit}>
                    <Feather name="edit" size={18} color="black" />
                    {loading === true ? 
                        <ActivityIndicator color="black"/> 
                        :                        
                        <EditTitle> 완료 </EditTitle>} 
                </ImageEditButton>

                <ProfileEditButton onPress={onEdit}>
                    <Feather name="x" size={18} color="black" />
                    <EditTitle> 취소 </EditTitle>
                </ProfileEditButton>

                <ProfileImageBox onPress={handleImagePick}>
                    <EditIcon name="camera-outline" size={45} color="white" />
                    <ProfileImage source={imageUrl ? {uri: imageUrl} :  getProfileData ? {uri: getProfileData.profileImgURL} : DefaultImage}/>
                </ProfileImageBox>

                <Empty />

                <ProfileTextBox>
                    <ProfileNameInput
                        placeholder= {getUserData ? getUserData.name : text}
                        placeholderTextColor="grey"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={10}
                        returnKeyType="done"
                        onChangeText={(text) => setText(text)}
                    /> 
                </ProfileTextBox>

            </ProfileBox> 
        </Container>
    )
};

const Container = styled.View``;

const Title = styled.Text``;

const ProfileBox = styled.View`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: ${colors.headerColor};
`;

const ProfileEditButton = styled.TouchableOpacity`
    position: absolute;
    top: 70px;
    right: 0px;
    flex-direction: row;
    align-items: center;
    border-radius: 20px;
    border: 1px black;
    padding: 5px 10px;
`;

const ImageEditButton = styled.TouchableOpacity`
    position: absolute;
    top: 20px;
    right: 0px;
    flex-direction: row;
    align-items: center;
    border-radius: 20px;
    border: 1px black;
    padding: 5px 10px;
`;

const ProfileImageBox = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

const EditIcon = styled(Ionicons)`
    position: absolute;
    z-index: 10;
`;

const EditTitle = styled.Text`
    font-size: 13px;
`;

const Empty = styled.View`
    width: 30px;
`;

const ProfileTextBox = styled.View`
    width: 30%;
    margin: 10% 0px;
`;

const ProfileNameInput = styled.TextInput`
    border-bottom-color: black;
    border-bottom-width: 1px;
    padding: 10px 3px;
    font-size: 16px;
    color: black;
`;

const ProfileImage = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 30px;
    opacity: 0.3;
`;

export default ProfileEdit;