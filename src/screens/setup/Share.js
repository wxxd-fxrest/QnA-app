import React from "react";
import ShareOpen from 'react-native-share'; 
import styled from "styled-components";
import { EvilIcons } from '@expo/vector-icons'; 

const Share = ({ navigation: {setOptions}, route: {params} }) => {
    const postId = params.data.name;
    const postUrl = `https://wood-forest-ask.com/${postId}`;

    const onShare = async () => {
        try {
			const shareOptions = {
				title: '게시글 공유',
				message: '이 게시글을 함께 공유해보세요!',
				url: postUrl,
			};
          	await ShareOpen.open(shareOptions);
        } catch (error) {
          	console.log('Error sharing:', error.message);
        }
    };

    return (
        <Container>
            <Title> Share </Title>
            <ShareIconBox onPress={onShare}>
                <ShareIcon name="share-google" size={24} color="black" />
            </ShareIconBox>
        </Container>
    )
};

const Container = styled.View``;

const Title = styled.Text``;

const ShareIconBox = styled.TouchableOpacity`
    background-color: green;
`;

const ShareIcon = styled(EvilIcons)``;

export default Share;