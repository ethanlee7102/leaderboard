import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Button, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { increment, getLeaderboard, getMe } from './api/api';
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const [loading, setLoading] = useState(true);
  const [pressCount, setPressCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const styles = createStyles();

  const loadLeaderboard = async () => {
    const res = await getLeaderboard();
    setLeaderboard(res.data);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login-page');
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    const fetchUserPressCount = async () => {
      const res = await getMe();
      setUsername(res.data.username)
      setPressCount(res.data.pressCount);
    };
  
    fetchUserPressCount();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking login...</Text>
      </View>
    );
  }

  const handlePress = async () => {
    const res = await increment();
    setPressCount(res.data.pressCount);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login-page');
  };

  

  

  return (
    <SafeAreaView style = {styles.container}>
    <View style = {styles.viewContainer}>
      <Text style={styles.login}>You're logged in as {username} 🎉</Text>
      
      <Button title="Press me!" onPress={handlePress} style={styles.pressCountButton}/>
      <Text style={styles.pressCountText}>
        Your Press Count: {pressCount}
      </Text>
     
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList style={styles.leaderboard}
        data={leaderboard}
        keyExtractor={(item) => item.username}
        renderItem={({ item, index }) => (
          <Text>{index + 1}. {item.username} - {item.pressCount}</Text>
        )}
      />
    </View>
    <View style={styles.logoutContainer}>
      <Pressable onPress={logout} style={styles.logoutButton}>
          <Text>Logout</Text>
      </Pressable>
    </View>
    </SafeAreaView>
  );
}

function createStyles(){

  return StyleSheet.create({
      login: {
        margin: 50,
        alignText: 'center'
      },
      container:{
          flex:1,
          backgroundColor: 'white',
          padding: 50
      },
      viewContainer:{
        flex:1,
      },
      logoutButton:{
          flex: 1,
          marginBottom: 100,
          padding: 12,
          backgroundColor: 'gray',
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical:20

      },
      pressCountButton: {
        marginTop: 50,
        justifyContent: 'center',
      },
      pressCountText: {
        fontSize: 18,
        marginTop: 100,
        
      },
      logoutContainer: {
        marginBottom: 0, // optional: adds spacing from bottom
        marginTop: 0,
        alignContent: 'bottom',
        flex: 0,
      },
      leaderboard: {
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 60,
        flexGrow: 1

      },
      title: {
        fontSize: 18,
        marginTop: 20,
      }
  })
}