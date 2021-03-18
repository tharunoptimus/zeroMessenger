import * as firebase from "firebase";
import React, { useLayoutEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { Input} from 'react-native-elements'
import { ScrollView, Alert } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { db, auth } from '../firebase';

const ChatScreen = ({ navigation, route }) => {

    const [ input, setInput ] = useState("");
    const [ messages, setMessages ] = useState([]);

    const comingSoon = () => {
        Alert.alert("Coming Soon..!!");
    };

    const scrollRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Avatar 
                        rounded 
                        source={{ 
                            uri: 
                                messages[0]?.data.photoURL, }}/>
                    <Text
                        style={{
                            color: "white",
                            marginLeft: 10,
                            fontWeight: "700",
                        }} 
                    >{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity 
                    style={{
                        marginLeft: 10,
                    }} onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft"  size={24} color="white"  />
                </TouchableOpacity>
            ),

            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        marginRight: 20,
                        justifyContent: 'space-between',
                        width: 80,
                    }}>
                    <TouchableOpacity onPress={comingSoon}>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={comingSoon}>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, messages]);

    const sendMessage = () => {

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput("");
    };

    useLayoutEffect(() => {
        const unsubscribe = db
        .collection("chats")
        .doc(route.params.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => 
            setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            )
        );

        return unsubscribe;

    }, [route])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "white",
        }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style = {styles.container}
                keyboardVerticalOffset = {100}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView 
                        ref={scrollRef}
                        contentContainerStyle={{ paddingTop: 15 }}>
                            {messages.map(({id, data}) => (
                                scrollRef.current.scrollToEnd(),
                                console.log(id),
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar 
                                            position="absolute"
                                            rounded
                                            size={18}
                                            bottom={-10}
                                            right={-5}
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5,
                                            }}

                                            source={{
                                                uri: data.photoURL,
                                            }} 
                                        />
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar 
                                            position="absolute"
                                            rounded
                                            size={18}
                                            bottom={-10}
                                            left={-5}
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                left: -5,
                                            }}

                                            source={{
                                                uri: data.photoURL,
                                            }} 
                                        />
                                        <Text style={styles.senderText }>{data.message}</Text>
                                        <Text style={styles.senderName }>{data.displayName}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={comingSoon}>
                                <Ionicons name="ios-happy" size= {30} color="#2B68E6" style={{paddingRight: 5}} />
                            </TouchableOpacity>
                            <TextInput 
                                style={styles.textInput}
                                value={ input } 
                                placeholder="Send a Zero Message" 
                                onChangeText={(text) => setInput(text)}
                            />


                            <TouchableOpacity activeOpacity = {0.5} onPress={sendMessage} >
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        height: 50,
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: 'relative',

    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,

    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: 'relative',
    },
    receiverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
    }
})
