import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { KeyboardAvoidingView } from 'react-native';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/core';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            console.log(authUser);
            if(authUser) {
                navigation.replace("Home");
            }
        })

        return unsubscribe;
    }, []);

    const signIn = () =>{
        auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error));
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container} 
        >
            <StatusBar style = "white" />

            <Image 
                source={{
                    uri: "https://miro.medium.com/max/2000/1*zMwCw7dpXU8q0wrohX4Rdg.png",
                }} 
            style = {{width: 100, height: 100,}} />
            <View style={styles.inputContainer}>
                <Input 
                    value={email}
                    placeholder="Email" 
                    autoFocus type="email" 
                    onChangeText={(text) => setEmail(text)}/>
                <Input 
                    value={password}
                    placeholder="Password" 
                    type="password" 
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing = {signIn} /> 
            </View>
            <Button containerStyle = {styles.button} onPress={signIn} title="Login"/>
            <Button onPress = {() => navigation.navigate("Register")} containerStyle = {styles.button} type="outline" title="Register"/>
            <View style= {{height: 10}}></View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,

    },
})
