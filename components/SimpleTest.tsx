import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function SimpleTest() {
  const testAlert = () => {
    console.log('Simple test button pressed!');
    Alert.alert('Test', 'Simple button works!');
  };

  const testFetch = async () => {
    console.log('Testing fetch...');
    try {
      const response = await fetch('https://httpbin.org/get');
      const data = await response.json();
      console.log('Fetch test successful:', data);
      Alert.alert('Success', 'Network fetch works!');
    } catch (error) {
      console.error('Fetch test failed:', error);
      Alert.alert('Error', `Fetch failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Component Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={testAlert}>
        <Text style={styles.buttonText}>Test Alert</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: '#34C759' }]} onPress={testFetch}>
        <Text style={styles.buttonText}>Test Network</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});