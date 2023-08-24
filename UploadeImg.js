import React from "react";
import { ActivityIndicator, Dimensions, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import styled from "styled-components";
import { Feather } from '@expo/vector-icons'; 

// 추후 추가 및 참고 예정 

const UploadeImg = () => {
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [height, setHeight] = useState(0);
    const { width } = Dimensions.get('window');

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [saveImgUrl, setSaveImgUrl] = useState('');

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
                // console.log('IMG_URL', IMG_URL);
                setSaveImgUrl(IMG_URL);
                setLoading(false);
                if(saveImgUrl) {
                    Image.getSize(saveImgUrl, (w, h) => {
                        setHeight(h * (width / w));
                    });
                }
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
      
        // console.log('result', result);
        setImageUrl(result);
    };      
    
    return (
        <>
            {loading === true ? 
                <ActivityIndicator color="black"/> 
            : <>
                {saveImgUrl && 
                    <PickImageView>
                        <PickCancle name="x" size={24} color="black" />
                        <PickImage resizeMode='contain' source={{ uri: saveImgUrl, height }} />
                        {/* <PickImage resizeMode='contain' source={{uri: DefaultImage, height}} /> */}
                    </PickImageView>
                }
            </>}   
        </>
    )
};

const PickImageView = styled.View`
    background-color: white;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40%;
`;

const PickCancle = styled(Feather)`
    background-color: grey;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const PickImage = styled.Image`
    width: 100%;
    /* height: 40%; */
`;

export default UploadeImg;