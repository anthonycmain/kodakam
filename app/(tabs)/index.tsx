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
  return (
    <View style={styles.container}>
      
      <Text> Scan Progress:  { (scanProgress == 100 ? 'Complete': scanProgress + '%') } </Text>
      <Button onPress={ performScan } title='Scan'></Button>

      <FlatList
        data={devices}
        style={styles.deviceList}
        //numColumns={2}
        //style={styles.previewListStyle}
        renderItem={({item, index}) =>
        <TouchableOpacity  onPress={() => router.push({ pathname:'/(tabs)/camera', params: { id: item.ipAddress} })}>
          <View style={{ flex: 1, flexDirection: 'row'}}>
            <Image source={require('../../assets/images/camera-icon-1.png')} style={{width: 50, height: 50}} />
            <Text>IP: { item.ipAddress }</Text>
          </View>
          
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          
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
    marginTop: 20
  }
});
