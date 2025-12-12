import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import { router } from 'expo-router';
import { login as loginRequest, saveAuth, verifyAuthWithServer} from '../services/authService';

const LoginPage = () => {

  const colorScheme = useColorScheme();


  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const auth = await verifyAuthWithServer();
      if (auth) {
        router.replace('/home');
      }
    })();
  }, []);



  const handleLogin = async () => {
    if (!email || !password)
    {
        Alert.alert('Login Failed', 'Email and password are required.');
        return;
    }

    setLoading(true);

    try 
    {
      const {token, user} = await loginRequest(email, password);
      saveAuth(token, user);

      Alert.alert('Login Successful', 'Welcome, ${user.name || user.email}!')
      
      router.replace('/home');
    }
    catch (err : any) 
    {
      console.error('Login error:', err);
      Alert.alert('Login Failed', err.message ?? 'Login failed')
    }
    finally 
    {
      setLoading(false);
    }

  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery logic is needed.');
  };

  return (
    <KeyboardAvoidingView
        style={[styles.container, themeContainerStyle]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
    >
      <View style={[styles.innerContainer, themeContainerStyle]}>
        <Text style={[styles.title, themeTextStyle]}>Login</Text>

        <TextInput
          style={[styles.input, themeContainerStyle]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />

        <TextInput
          style={[styles.input, themeContainerStyle]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
        />

        <View style={[styles.buttonContainer, themeContainerStyle]}>
          <Button
            title="Login"
            onPress={handleLogin}
            color="#007AFF"
          />
        </View>

        <View style={[styles.options, themeContainerStyle]}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
          {/*<TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>*/}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 50,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  lightContainer: {
    backgroundColor: '#fff',
    borderColor: '#151718'
  },
  darkContainer: {
    backgroundColor: '#151718',
    borderColor: '#ECEDEE',
  },
  lightThemeText: {
    color: '#11181C',
  },
  darkThemeText: {
    color: '#ECEDEE',
  },
});

export default LoginPage;