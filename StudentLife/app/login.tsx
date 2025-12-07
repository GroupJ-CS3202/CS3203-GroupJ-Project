import React, { useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'test' && password === '1234') {
      Alert.alert('Login Successful', 'Welcome!');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} 
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={handleLogin}
            color="#007AFF"
          />
        </View>

        <View style={styles.options}>
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
});

export default LoginPage;