import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, View } from 'react-native'
import { Input } from 'react-native-elements';
import { Button, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { db } from '../firebase';

const AddChatScreen = ({navigation}) => {

    const [input, setInput] = useState("");

    useLayoutEffect (() => {
        navigation.setOptions({
            title: "Add a New Chat",
            headerBackTitle: "Chats",
        });
    }, [navigation]);

    const createChat = async () => (
        await db
        .collection('chats')
        .add({
            chatName: input,
        })
        .then(() => {
            navigation.goBack();
        })
        .catch((error) => alert(error))
    )

    return (
        <View style={styles.container}>


            <Input style={styles.input}
                placeholder="Enter a chat name"
                value = {input}
                onChangeText = {(text) => setInput(text)}
                onSubmitEditing = {createChat}
                leftIcon = {
                    <Icon name="comments" type="antdesign" size = {30} />

                }
            />

            <Button disabled={!input} onPress={createChat} title="Create New Chat" />
            
        </View>
       
    );
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%",
    }, 
    input: {paddingLeft: 10,},
});


