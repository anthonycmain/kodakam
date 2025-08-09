import { Image, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import LanPortScanner, { LSScanConfig, LSSingleScanResult } from 'react-native-lan-port-scanner';
import { useCallback, useEffect, useState } from 'react';
import CameraInfo from '@/types/CameraInfo';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {

  const [devices, setDevices] = useState<CameraInfo[]>([]);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const router = useRouter();
  


  const performScan = useCallback(async () => {
    try {
      if (scanProgress == 100) {
        console.log('=== STARTING NETWORK SCAN ===');
        
        // Clear the device list
        setDevices([]);
        setScanProgress(0);

        const networkInfo = await LanPortScanner.getNetworkInfo();
        console.log('Network Info:', networkInfo);

        if (!networkInfo) {
          console.error('Failed to get network info');
          alert('Failed to get network information. Please check your WiFi connection.');
          setScanProgress(100);
          return;
        }

        // Check if we're on emulator (10.0.2.x network) and handle differently
        if (networkInfo.ipAddress?.startsWith('10.0.2.')) {
          console.log('🚨 Running on Android Emulator - cannot scan host WiFi network directly');
          console.log('💡 Emulator is on 10.0.2.x but your camera is likely on 192.168.178.x');
          alert('Android Emulator Detected!\n\nThe emulator cannot directly scan your WiFi network where the camera is located.\n\nPlease use a real Android device connected to the same WiFi as your camera for network scanning.');
          setScanProgress(100);
          return;
        }

        // Override to just my camera for now (when on real device)
        //const ipRange = ['192.168.178.36'];

        const config1: LSScanConfig = {
          networkInfo: networkInfo,
          //ipRange: ipRange,
          ports: [80], //Specify port here
          timeout: 2000, //Increased timeout for better reliability
          threads: 50, //Reduced threads for better stability
          logging: true //Enable logging for debugging
        };

        console.log('Scan config:', config1);

        let results: Array<CameraInfo> = [];

        const cancelScanHandle = LanPortScanner.startScan(
          config1,
          (totalHosts: number, hostScanned: number) => {
            const progress = Math.round(hostScanned/totalHosts*100);
            console.log(`Scan progress: ${hostScanned}/${totalHosts} (${progress}%)`);
            setScanProgress(progress);
          },
          (result) => {
            console.log('Found open port:', result);

            if (result != null) {
              // Get the camera info
              const cameraAddress = 'http://' + result.ip + '/?req=get_caminfo';
              console.log('Checking camera at:', cameraAddress);

              fetch(cameraAddress, {
                method: 'GET',
                timeout: 5000,
              })
              .then(caminfo => {
                console.log('Response status:', caminfo.status);
                return caminfo.text();
              })
              .then(function (body) {
                console.log('Response body from', result.ip, ':', body.substring(0, 100));

                if (body.startsWith('get_caminfo')) {
                  // Found a camera
                  console.log('✅ Found Kodak camera at:', result.ip);

                  const queryString = body.split('get_caminfo: ')[1];
                  const params = new URLSearchParams(queryString);

                  // Populate CameraInfo object
                  const cameraInfo: CameraInfo = {
                    ipAddress: result.ip,
                    params: params
                  }

                  results.push(cameraInfo);
                  console.log('Added camera to results:', cameraInfo);
                  
                  // Update devices state with new array
                  setDevices([...results]);
                } else {
                  console.log('❌ Not a Kodak camera at:', result.ip);
                }
              })
              .catch(error => {
                console.log('Error checking camera at', result.ip, ':', error.message);
              });
            }
          },
          (scanResults) => {
            console.log('=== SCAN COMPLETED ===');
            console.log('Total cameras found:', results.length);
            console.log('Final scan results:', scanResults);
            setScanProgress(100);
          }
        );
      } else {
        alert('Scan is already in progress');
      }
    } catch (error) {
      console.error('Error during scan:', error);
      alert('Scan failed: ' + error.message);
      setScanProgress(100);
    }
  }, [scanProgress]);

  useEffect(() => {
    void (async () => {
      try {
        // Don't auto-scan on startup, let user trigger it manually
        console.log('App loaded, ready for manual scan');
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  function getChargingIcon(value: string | null) {

      const parsed: number = Number(value);

      if (value != null) {
        if (parsed >= 100.0) {
          return <Image source={require('../../assets/images/icons/ic_battery_fully_charged.png')} />;
      } else if (parsed > 0.0) {
        return <Image source={require('../../assets/images/icons/ic_battery_charging.png')} />;
      }
      return <Image source={require('../../assets/images/icons/ic_battery_power_plugged.png')} />;

    }
  }

  return (
    <View style={styles.container}>
      
    
      <TouchableOpacity style={styles.scanButton} onPress={performScan}>
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      <Text> Scan Progress:  { (scanProgress == 100 ? 'Complete': scanProgress + '%') } </Text>
      
      <Text style={styles.helpText}>
        📱 For network scanning to work, use a real Android device connected to the same WiFi network as your camera.
        {'\n\n'}
        🚫 Android emulators cannot scan WiFi networks directly.
      </Text>

      <FlatList
        data={devices}
        style={styles.deviceList}
        renderItem={({item, index}) =>
        <TouchableOpacity style={styles.deviceItem} onPress={() => router.push({ pathname:'/(tabs)/camera', params: { id: item.ipAddress} })}>
          <View style={styles.deviceContent}>
            <View style={styles.deviceHeader}>
              <Image source={require('../../assets/images/camera-icon-1.png')} style={styles.cameraIcon} />
              <View style={styles.deviceInfo}>
                <Text style={styles.ipAddress}>IP: {item.ipAddress}</Text>
                <Text style={styles.deviceName}>Kodak Camera</Text>
              </View>
              <View style={styles.batteryContainer}>
                {getChargingIcon(item.params.get('charge'))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        }
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  deviceList: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  deviceItem: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginHorizontal: 0,
  },
  deviceContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  ipAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 14,
    color: '#000',
  },
  batteryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: 'center',
    marginVertical: 10,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    lineHeight: 16,
  },
});
