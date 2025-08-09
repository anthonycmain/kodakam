import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import CameraCommandInterface from '@/components/CameraCommandInterface';
import { useLocalSearchParams } from 'expo-router';

export default function CommandsScreen() {
  const local = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <CameraCommandInterface cameraAddress={`http://${local.id}/`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
