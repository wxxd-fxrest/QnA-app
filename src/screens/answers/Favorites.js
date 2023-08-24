import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import styled from "styled-components";
import { colors } from "../../../colors";
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 

const {width: SCREENWIDTH, height : SCREENHEIGHT} = Dimensions.get("window");

const Favorites = () => {
    const [currentUser, setCurrentUser] = useState([]);
    const [getLike, setGetLike] = useState([]);

	useEffect(() => {
        setCurrentUser(auth().currentUser);
    }, [currentUser]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Users').doc(`${currentUser.email}`)
            .collection('QnA-Collection').orderBy('orderBy', 'asc').onSnapshot(documentSnapshot => {
                let feedArray = []
                documentSnapshot.forEach((doc) => {
                    feedArray.push({
                        DocID: doc.id, 
                        Data: doc.data(),
                    })
                    // console.log(doc.data())
                });
                setGetLike(feedArray);
                // console.log(feedArray[1].Data);
            });

        return () => subscriber();
    }, [currentUser]);

    const onUnLike = (item) => {
        if(item.DocID) {
            Alert.alert(
                '즐겨찾기 취소',
                '즐겨찾기를 취소하시겠습니까?',
                [
                    {
                        text: "No",
                        onPress: () => console.log("no"),
                        style: "destructive"
                    },
                    {
                        text: "Yes",
                        onPress: async() => {
                            await firestore().collection('Users').doc(`${currentUser.email}`)
                                .collection('QnA-Collection').doc(`${item.DocID}`).update({
                                    Favorites: false,
                            });
                        }
                    },
                ],
                {
                    cancelable: true,
                },
            );
        }
    };

    return(
        <Container>
            <ContentsContainer>
                <LikeHeader>
                    <TagIcon name="bookmark" size={40} color='rgb(45, 68, 33)'/>
                        <LikeIcon name="bubble-chart" size={13} color='white'/>
                </LikeHeader>
                <FlatList data={getLike}
                    keyExtractor={(item) => item.DocID + ""}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => ( <>
                        {item.Data.Favorites === true && 
                        <>
                            <ContentsBox>
                                <QuestionBox>
                                    <Question>
                                        {item.Data.Question}
                                    </Question>
                                </QuestionBox>

                                <IconContainer>
                                    <LikeIconBox onPress={() => onUnLike(item)}>
                                        <MaterialIcons name="bubble-chart" size={16} color={colors.headerColor}/>
                                    </LikeIconBox>
                                </IconContainer>
                            </ContentsBox>

                            {item && item.Data.Answer ? 
                                <ContentsBox2>
                                    <AnswerBox>
                                        <AnswerText>
                                            {item.Data.Answer}
                                        </AnswerText>
                                    </AnswerBox>
                                </ContentsBox2> 
                            : null}
                        </>}
                    </> )} 
                />
            </ContentsContainer>
        </Container>
    )
};

const Container = styled.View`
    background-color: white;
    flex: 1;
    /* padding: 20px 10px 0px 10px; */
    padding: 0px 15px;
    padding-top: 2%;
`;

const ContentsContainer = styled.View`
    flex: 1;
    background-color: white;
    height: 100%;
`;

const LikeHeader = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    top: -15px;
    right: 0px;
`;

const TagIcon = styled(Entypo)``;

const LikeIcon = styled(MaterialIcons)`
    position: absolute;
    top: 30%;
    right: 33%;
`;

const ContentsBox = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 0px 10px;
    padding-bottom: 10px;
`;

const QuestionBox = styled.View`
    background-color: rgba(45, 68, 33, 0.23);
    padding: 10px;
    border-radius: 0px 10px 10px 10px;
    max-width: 80%;
    margin: 5px 0px;
`;

const Question = styled.Text`
    color: black;
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: 18.5px;
`;

const IconContainer = styled.View`
    flex-direction: row;
    margin: 5px 0px;
`;

const DeleteBox = styled.TouchableOpacity`
    background-color: rgba(45, 68, 33, 0.4);
    padding: 6px;
    border-radius: 10px;
    margin-left: 5px;
`;

const LikeIconBox = styled.TouchableOpacity`
    background-color: rgba(45, 68, 33, 0.4);
    padding: 6px ;
    border-radius: 10px;
    margin-left: 8px;
`;

const ContentsBox2 = styled.View`
    display: flex;
    justify-content: flex-end; /* 변경된 부분 */
    align-items: flex-end; /* 변경된 부분 */
    flex-direction: row;
    padding: 0px 10px;
    padding-bottom: 10px;
`;

const AnswerBox = styled.View`
    background-color: rgba(173, 189, 164, 0.25); /* 변경된 부분 */
    padding: 10px;
    border-radius: 10px 10px 0px 10px;
    max-width: 80%;
    margin: 5px 0px;
`;

const AnswerText = styled.Text`
    color: black; /* 변경된 부분 */
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: 18.5px;
`;

export default Favorites;