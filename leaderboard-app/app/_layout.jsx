import { Stack } from "expo-router";
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Redirect } from "expo-router";


export default function RootLayout() {
  
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login-page" options={{}} />
        <Stack.Screen name="index" options={{}} />
      </Stack>
    </SafeAreaProvider>
  );
}