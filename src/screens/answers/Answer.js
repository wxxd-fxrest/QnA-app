import React, { useEffect, useState } from "react";
import { Text, Alert, Dimensions, KeyboardAvoidingView, LayoutAnimation, NativeModules, Platform, FlatList, Image } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import styled from "styled-components";
import { colors } from "../../../colors";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 

const { StatusBarManager } = NativeModules;

const {width: SCREENWIDTH, height : SCREENHEIGHT} = Dimensions.get("window");

const Answer = () => {
    const [currentUser, setCurrentUser] = useState([]);
    const [getQuestion, setGetQuestion] = useState([]);
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPopModalVisible, setPopModalVisible] = useState(false);
    const [ask, setAsk] = useState("");
    const [answersID, setAnswersID] = useState('');
    const [AnswerData, setAnswerData] = useState([]);

    useEffect(()=>{
        Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
            setStatusBarHeight(statusBarFrameData.height)
        }) : null
    }, []);

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
                setGetQuestion(feedArray);
                // console.log(getQuestion[4].Data.ImgUrl)
                // console.log(feedArray[1].Data);
            });

        return () => subscriber();
    }, [currentUser]);

    const onSubmitAskEditing = async() => {
        if(ask) {
            await firestore().collection('Users').doc(`${currentUser.email}`)
                .collection('QnA-Collection').doc(`${answersID}`).update({
                    Answer: ask,
            })
        } else {
            Alert.alert('메시지를 입력해주세요.');
        }
        setAsk("");
        setModalVisible(false);
    };

    const data = [
        {
            id: 1, 
            text: '질문에 대해 답장하기', 
            icon: <Ionicons name="arrow-undo-outline" size={20} color={colors.headerColor} />,
            function: () => {
                let item =  AnswerData;
                onAnswer(item);
                setPopModalVisible(false);
                // console.log('click', AnswerData);
            }
        },
        {
            id: 2, 
            text: '질문 삭제하기', 
            icon: <Feather name="x" size={20} color={colors.headerColor} />,
            function: () => {
                let item =  AnswerData;
                onDelete(item);
                setPopModalVisible(false);
                // console.log('click', AnswerData);
            } 
        },
        {
            id: 3, 
            text: '즐겨찾기에 추가', 
            icon: <MaterialIcons name="bubble-chart" size={20} color={colors.headerColor} />,
            function: async() => {
                await firestore().collection('Users').doc(`${currentUser.email}`)
                    .collection('QnA-Collection').doc(`${AnswerData.DocID}`).update({
                        Favorites: true,
                });
                setPopModalVisible(false);
            } 
        },
    ];

    const openModal = (item) => {
        setAnswerData('');
        setPopModalVisible(true);
        setAnswerData(item);
    };

    const onAnswer = (item) => {
        // console.log('onAnswer', item)
        setAnswersID('');
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setModalVisible(true);
        setAnswersID(item.DocID);
        // console.log('answersID', answersID);
    };

    const onDelete = (item) => {
        // console.log('item.DocID', item.DocID)
        if(item.DocID) {
            Alert.alert(
                '질문을 삭제하시겠습니까?',
                '삭제 시 복구할 수 없으며, 답변도 함께 삭제됩니다.',
                [
                    {
                        text: "No",
                        onPress: () => console.log("no"),
                        style: "destructive"
                    },
                    {
                        text: "Yes",
                        onPress: async() => {
                            await firestore()
                                .collection('Users').doc(`${currentUser.email}`)
                                .collection('QnA-Collection').doc(`${item.DocID}`)
                                .delete().then(() => {
                                    console.log('User deleted!');
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

    const onAnswerDelete = (item) => {
        // console.log('item.DocID', item.DocID)
        if(item.DocID) {
            Alert.alert(
                '답변을 삭제하시겠습니까?',
                '삭제 시 복구할 수 없습니다.',
                [
                    {
                        text: "No",
                        onPress: () => console.log("no"),
                        style: "destructive"
                    },
                    {
                        text: "Yes",
                        onPress: async() => {
                            await firestore()
                                .collection('Users').doc(`${currentUser.email}`)
                                .collection('QnA-Collection').doc(`${item.DocID}`)
                                .update({
                                    Answer: '',
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
            <KeyboardView
                behavior={Platform.select({ios: 'padding', android: undefined})}
                keyboardVerticalOffset={statusBarHeight+44}>

            <ContentsContainer>
                <LikeHeader>
                    <TagIcon name="bookmark" size={40} color='rgb(45, 68, 33)'/>
                        <LikeIcon name="ios-chatbubble-ellipses-outline" size={13} color='white'/>
                </LikeHeader>
                <FlatList data={getQuestion}
                    keyExtractor={(item) => item.DocID + ""}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                        <>
                            <ContentsBox>
                                <QuestionBox onLongPress={() => openModal(item)}
                                    activeOpacity={0.8}>
                                    <Question>
                                        {item.Data.Question}
                                    </Question>
                                </QuestionBox>
                                
                                <IconContainer>
                                    <ReactionBox onPress={() => onAnswer(item)}>
                                        <Ionicons name="arrow-undo-outline" size={16} color={colors.headerColor} />
                                    </ReactionBox>
                                    <DeleteBox onPress={() => onDelete(item)}>
                                        <Feather name="x" size={16} color={colors.headerColor} />
                                    </DeleteBox>
                                </IconContainer>
                            </ContentsBox>

                            {item && item.Data.Answer ? 
                                <ContentsBox2>
                                    <AnswerIconContainer>
                                        <AnswerDeleteBox onPress={() => onAnswerDelete(item)}>
                                            <Feather name="x" size={16} color={colors.headerColor} />
                                        </AnswerDeleteBox>
                                    </AnswerIconContainer>
                                    <AnswerBox>
                                        <AnswerText>
                                            {item.Data.Answer}
                                        </AnswerText>
                                    </AnswerBox>
                                </ContentsBox2> 
                            : null}
                        </>
                    )} 
                />
            </ContentsContainer>

            <Modal 
                isVisible={isPopModalVisible} 
                onBackdropPress={() => setPopModalVisible(false)}
                animationIn="slideInUp" // 팝업이 올라오는 애니메이션
                animationOut="slideOutDown" // 팝업이 내려가는 애니메이션
                style={{ margin: 0 }}
            >
            <BottomMenu onTouchStart={(e) => e.preventDefault()}>
                {data.map((item) => (
                    <MenuItem key={item.id}>
                        <MenuItemClick onPress={item.function}>
                            <Text>{item.text}</Text>
                            <PopIcon>{item.icon}</PopIcon>
                        </MenuItemClick>
                    </MenuItem>
                ))}
            </BottomMenu>
            </Modal>

                {isModalVisible ? 
                    <TextInputContainer>
                        <CancleBox onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            setModalVisible(false);
                            setAnswersID('');
                        }}>
                            <CancleText> 취소 </CancleText>
                        </CancleBox>
                        <TextInput value={ask} 
                            placeholder="ask"
                            placeholderTextColor="grey"
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={300}
                            multiline={true}
                            keyboardType="default"
                            onChangeText={(text) => setAsk(text)}/>
                        <TextSaveBtn onPress={onSubmitAskEditing}>
                            <FontAwesome5 name="arrow-circle-right" size={33} color={colors.headerColor} />
                        </TextSaveBtn>
                    </TextInputContainer> 
                : null}

            </KeyboardView>
        </Container>
    )
};

const BottomMenu = styled.View`
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 13%;
    padding-top: 6%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
`;

const MenuItem = styled.View`
    padding: 18px;
    border-bottom-width: 1px;
    border-color: #ccc;
`;

const MenuItemClick = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
`;

const PopIcon = styled.Text``;

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

const LikeIcon = styled(Ionicons)`
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

const QuestionBox = styled.TouchableOpacity`
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

const ReactionBox = styled.TouchableOpacity`
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

const AnswerIconContainer = styled.View`
    flex-direction: row;
    margin: 5px 8px;
`;

const AnswerDeleteBox = styled.TouchableOpacity`
    background-color: rgba(45, 68, 33, 0.4);
    padding: 6px;
    border-radius: 10px;
    margin-left: 5px;
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

const KeyboardView = styled(KeyboardAvoidingView)`
    flex: 1;
    background-color: grey;
`;

const TextInputContainer = styled.View`
    background-color: white;
    margin-top: auto;
    border-top-width: 1px;
    border-top-color: #EAEAEA;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 20px;
    flex-direction: row;
    justify-content: center;
`;

const CancleBox = styled.TouchableOpacity`
    margin-right: 3px;
`;

const CancleText = styled.Text``;

const TextSaveBtn = styled.TouchableOpacity``;

const TextInput = styled.TextInput`
    /* background-color: violet; */
    border: solid 1px ${colors.headerColor};
    padding: 10px 20px;
    /* padding-right: 50px; */
    border-radius: 20px;
    margin: 0px 10px;
    color: black;
    width: ${SCREENWIDTH - 120}px;
    font-size: 14px;
    border-width: 1px;
`;

export default Answer;