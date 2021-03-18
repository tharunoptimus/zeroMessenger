import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from '../components/CustomListItem'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { auth, db } from '../firebase';
import { Alert } from 'react-native';

const HomeScreen = ({navigation}) => {

    const comingSoon = () => {
        Alert.alert("Coming Soon..!!");
    };

    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        auth.signOut()
            .then(() => {
            navigation.replace("Login");
        });
    };

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc =>({
                id: doc.id,
                data: doc.data()
            })))
        ))

        return unsubscribe;
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Zero Messenger",
            headerStyle: { backgroundColor: '#fff'},
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style = {{marginLeft: 20}}>
                    <TouchableOpacity onPress={signOutUser} activeOpacity={ 0.5 }>
                        <Avatar 
                            rounded
                            source = {{ uri: auth?.currentUser?.photoURL }} 
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20,
                }} >
                    <TouchableOpacity activeOpacity={0.5} onPress={comingSoon} >
                        <AntDesign name = "camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5} >
                        <SimpleLineIcons name = "pencil" size={22} color="black" />
                    </TouchableOpacity>
                </View>
            ),

        });
    }, [navigation]);

    const enterChat = ( id, chatName ) => {
        navigation.navigate('Chat', {
            id,
            chatName,
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem 
                        key={id} 
                        id={id} 
                        chatName={chatName}
                        enterChat={enterChat } />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
})
