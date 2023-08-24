import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, KeyboardAvoidingView, NativeModules, Platform } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import styled from "styled-components";
import { colors } from "../../colors";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { EvilIcons } from '@expo/vector-icons'; 
import DefaultImage from '../assets/QnA-Profile.png';

const { StatusBarManager } = NativeModules;

const {width: SCREENWIDTH, height : SCREENHEIGHT} = Dimensions.get("window");

const AskScreen = () => {
    const [currentUser, setCurrentUser] = useState([]);
    const [getProfileData, setGetProfileData] = useState([]);
    const [getQuestion, setGetQuestion] = useState([]);
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [ask, setAsk] = useState("");

    useEffect(()=>{
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
    }, []);

	useEffect(() => {
        setCurrentUser(auth().currentUser);
    }, [currentUser]);

    useEffect(() => {
        const subscriber = firestore().collection('Users').doc(`${currentUser.email}`).collection('UsersData').doc('URL')
            .onSnapshot(documentSnapshot => {
                setGetProfileData(documentSnapshot.data());
                // console.log('User data: ', documentSnapshot.data());
        });
        return () => subscriber();
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
                setGetQuestion(feedArray);
                // console.log(feedArray[1].Data);
            });

        return () => subscriber();
    }, [currentUser]);

    const onSubmitAskEditing = async() => {
        if(ask) {
            await firestore().collection('Users').doc(`${currentUser.email}`)
                .collection('QnA-Collection').add({
                    Question: ask,
                    orderBy: new Date(),
                    Favorites: false,
            })
        } 
        setAsk('');
    };

    return (
        <Container>
            <KeyboardView
                behavior={Platform.select({ios: 'padding', android: undefined})}
                keyboardVerticalOffset={statusBarHeight+44}>

            <ContentsContainer>
                <FlatList data={getQuestion}
                    keyExtractor={(item) => item.DocID + ""}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                        <>
                            {item && item.Data.Answer ? <>
                                <ContentsBox>
                                    <QuestionBox>
                                        <Question>
                                            {item.Data.Question}
                                        </Question>
                                    </QuestionBox>
                                </ContentsBox>

                                <ContentsBox2>
                                <ProfileImage source={getProfileData ? {uri: getProfileData.profileImgURL} : DefaultImage}/>
                                    <AnswerBox>
                                        <Answer>
                                            {item.Data.Answer}
                                        </Answer>
                                    </AnswerBox>
                                </ContentsBox2> 
                            </>
                            : 
                                <ContentsBox>
                                    <UnansweredBox>
                                        <EvilIcons name="exclamation" size={22} color="#5D5D5D" />
                                        <Unanswered> 미답변 질문입니다. </Unanswered>
                                    </UnansweredBox>
                                </ContentsBox>
                            }
                        </>
                    )} 
                />
            </ContentsContainer>          

                <TextInputContainer>
                    <TextInput value={ask} 
                        placeholder="ask"
                        placeholderTextColor="grey"
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={300}
                        multiline={true}
                        onChangeText={(text) => setAsk(text)}/>
                    <TextSaveBtn onPress={onSubmitAskEditing}>
                        <FontAwesome5 name="arrow-circle-right" size={33} color={colors.headerColor} />
                    </TextSaveBtn>
                </TextInputContainer>

            </KeyboardView>
        </Container>
    )
};


const Container = styled.View`
    background-color: white;
    flex: 1;
    padding-top: 2%;
`;

const ContentsContainer = styled.View`
    flex: 1;
    background-color: white;
    height: 100%;
    /* padding: 10px 10px; */
`;

const ContentsBox = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
    padding: 0px 20px;
    padding-bottom: 10px;
`;

const QuestionBox = styled.View`
    background-color: rgba(173, 189, 164, 0.25); 
    padding: 10px;
    border-radius: 10px 10px 0px 10px;
    max-width: 80%;
    margin: 5px 0px;
`;

const UnansweredBox = styled.View`
    background-color: rgba(173, 189, 164, 0.25); 
    padding: 10px;
    border-radius: 10px 10px 0px 10px;
    max-width: 80%;
    margin: 5px 0px;
    flex-direction: row;
    align-items: center;
`;

const Unanswered = styled.Text`
    color: #5D5D5D;
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: 18.5px;
`;

const Question = styled.Text`
    color: black;
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: 18.5px;
`;

const ContentsBox2 = styled.View`
    display: flex;
    justify-content: flex-start; /* 변경된 부분 */
    align-items: flex-start;
    flex-direction: row;
    padding: 0px 10px;
    padding-bottom: 10px;
`;

const ProfileImage = styled.Image`
    width: 35px;
    height: 35px;
    border-radius: 30px;
    margin-right: 10px;
`;

const AnswerBox = styled.View`
    background-color: rgba(45, 68, 33, 0.23);
    padding: 10px;
    border-radius: 0px 10px 10px 10px;
    max-width: 80%;
    margin: 5px 0px;
`;

const Answer = styled.Text`
    color: black; /* 변경된 부분 */
    margin: 0;
    font-size: 13px;
    font-weight: 300;
    line-height: 18.5px;
`;

const KeyboardView = styled(KeyboardAvoidingView)`
    flex: 1;
    background-color: grey;
`;

const TextInputContainer = styled.View`
    background-color: white;
    margin-top: auto;
    border-top-width: 1px;
    border-top-color: #EAEAEA;
    /* justify-content: space-between; */
    align-items: center;
    /* padding: 0px 20px; */
    padding-top: 10px;
    padding-bottom: 20px;
    flex-direction: row;
    justify-content: center;
`;

const TextSaveBtn = styled.TouchableOpacity``;

const TextInput = styled.TextInput`
    border: solid 1px ${colors.headerColor};
    padding: 10px 20px;
    border-radius: 20px;
    color: black;
    width: ${SCREENWIDTH - 100}px;
    font-size: 14px;
    border-width: 1px;
    margin: 0px 10px;
`;

export default AskScreen;