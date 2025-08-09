import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, Linking, Text as RNText } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/anthonycmain/kodakam/issues/new');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <RNText style={styles.title}>How to Use Kodakam</RNText>
        
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>▶ Getting Started</RNText>
          <RNText style={styles.instruction}>
            1. Ensure your device is connected to the same WiFi network as your Kodak cameras
          </RNText>
          <RNText style={styles.instruction}>
            2. Use the Scanner tab to discover cameras on your network
          </RNText>
          <RNText style={styles.instruction}>
            3. Tap on a discovered camera to view its details and status
          </RNText>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>◉ Camera Details</RNText>
          <RNText style={styles.instruction}>
            • Query Camera: Get detailed information including battery level, WiFi strength, and temperature
          </RNText>
          <RNText style={styles.instruction}>
            • Send Commands: Access advanced camera controls and settings
          </RNText>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>◆ Available Commands</RNText>
          <RNText style={styles.instruction}>
            • <RNText style={styles.bold}>GET</RNText>: Retrieve camera information and current settings
          </RNText>
          <RNText style={styles.instruction}>
            • <RNText style={styles.bold}>SET</RNText>: Configure camera settings like motion detection and video quality
          </RNText>
          <RNText style={styles.instruction}>
            • <RNText style={styles.bold}>ACTION</RNText>: Execute actions like playing melodies or restarting the camera
          </RNText>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>⚠ Important Notes</RNText>
          <RNText style={styles.instruction}>
            • This app works with Kodak Smart Home cameras after the official service shutdown
          </RNText>
          <RNText style={styles.instruction}>
            • Some commands may take a few seconds to execute
          </RNText>
          <RNText style={styles.instruction}>
            • Camera discovery requires network access and may take 10-15 seconds
          </RNText>
        </View>

        <View style={styles.supportSection}>
          <RNText style={styles.sectionTitle}>? Need Help?</RNText>
          <RNText style={styles.supportText}>
            Found a bug or need support? Report issues on our GitHub repository:
          </RNText>
          
          <TouchableOpacity style={styles.githubButton} onPress={handleGitHubPress}>
            <FontAwesome name="github" size={20} color="#fff" style={styles.githubIcon} />
            <RNText style={styles.githubButtonText}>Visit GitHub Repository</RNText>
          </TouchableOpacity>
          
          <RNText style={styles.githubUrl}>github.com/anthonycmain/kodakam/issues/new</RNText>
        </View>
      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#ED0000',
  },
  supportSection: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  githubButton: {
    backgroundColor: '#ED0000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 10,
  },
  githubIcon: {
    marginRight: 10,
  },
  githubButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  githubUrl: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
