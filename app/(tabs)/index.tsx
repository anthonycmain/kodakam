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
  
  const getNetworkInfo = useCallback(async () => {

    const networkInfo = await LanPortScanner.getNetworkInfo();

    const ipRangeInfo = await LanPortScanner.generateIPRange(networkInfo);

    console.log('Range' + ipRangeInfo.ipRange);
  }, []);

  const performScan = useCallback(async () => {

    if (scanProgress == 100) {

      const networkInfo = await LanPortScanner.getNetworkInfo();

      // Clear the device list
      setDevices([]);

      // Override to just my camera for now
      //const ipRange = ['192.168.178.36'];

      const config1: LSScanConfig = {
        networkInfo: networkInfo,
        //ipRange: ipRange,
        ports: [80], //Specify port here
        timeout: 1000, //Timeout for each thread in ms
        threads: 150, //Number of threads
        logging: false
      };

      console.log('<< STARTING SCAN >>');

      let results: Array<CameraInfo> = [];

      const cancelScanHandle = LanPortScanner.startScan(
        config1, //or config2
        (totalHosts: number, hostScanned: number) => {
          setScanProgress(Math.round(hostScanned/totalHosts*100));
        },
        (result) => {

          if (result != null) {

            // Get the camera infor
            const cameraAddress = 'http://' + result.ip + '/?req=get_caminfo';
            console.log('Checking: ' + cameraAddress);

            fetch(cameraAddress)
            .then(caminfo => {
              caminfo.text().then(function (body) {

                if (body.startsWith('get_caminfo')) {
                  // Found a camera

                  const queryString = body.split('get_caminfo: ')[1];

                  const params = new URLSearchParams(queryString);

                  // Populate CameraInfo object
                  const cameraInfo: CameraInfo = {
                    ipAddress: result.ip,
                    params: params

                  }

                  results.push(cameraInfo);

                  setDevices(results);
                }
                
                
              });
              

            });

            //
          }

        },
        (results) => {
          //console.log(results); // This will call after scan end.
          console.log('<< FINISHED SCAN >>');
        }
      );
    }
    else {
      alert('Scan is already in progress');
    }

  }, []);

  useEffect(() => {
    void (async () => {
      try {
        //await getNetworkInfo();
        await performScan();
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
});
