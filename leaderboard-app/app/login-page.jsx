import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform,
        TouchableWithoutFeedback,
        Keyboard, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { login, register } from './api/api';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const styles = createStyles();

    const handleLogin = async () => {
        try {
            const res = await login(username, password);
            await AsyncStorage.setItem('token', res.data.token);
            router.replace('/');
          } catch (e) {
            setError('Login failed');
          }
    };

    const handleRegister = async () => {
        try {
            await register(username, password);
            handleLogin();
          } catch (e) {
            setError('Registration failed');
          }
    };

    return (
        <SafeAreaView style = {styles.container}>
           
            <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder = "Username"
                placeholderTextColor="gray"
                value = {username}
                onChangeText={setUsername}
                />
                <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder = "Password"
                placeholderTextColor="gray"
                value = {password}
                onChangeText={setPassword}
                
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable 
                style={styles.loginButton}
                onPress={handleLogin}
                >
                    <Text>Login</Text>
                </Pressable>
                <Pressable 
                style={styles.registerButton}
                onPress={handleRegister}
                >
                    <Text >Register</Text>
                </Pressable>
            </View>
            {error ? <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text> : null}
            </ScrollView>
        </SafeAreaView>
    );
}
function createStyles(){

    return StyleSheet.create({
        container:{
            flex:1,
            backgroundColor: 'white',
        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
        },
        inputContainer: {
            alignItems: 'center',
        },
        input:{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            fontSize: 18,
            width: '100%',
            maxWidth: 400,
            marginBottom: 10,
            
        },
        buttonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            marginTop: 0,
            padding: 10,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        loginButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            padding: 10,
            paddingVertical: 13,
            backgroundColor: 'grey',
            margin: 5,
            
            maxWidth: 120,
        },
        registerButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            padding: 10,
            paddingVertical: 13,
            backgroundColor: 'grey',
            margin: 5,
            maxWidth: 120,
        }
    })
}