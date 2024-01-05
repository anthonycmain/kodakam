import { Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import LanPortScanner, { LSScanConfig, LSSingleScanResult } from 'react-native-lan-port-scanner';
import { useCallback, useEffect, useState } from 'react';
import CameraInfo from '@/types/cameraInfo';

export default function TabOneScreen() {

  const [devices, setDevices] = useState<CameraInfo[]>([]);
  const [scanProgress, setScanProgress] = useState<number>();


  
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

            console.log('result: ' + result.ip);

            //get_caminfo: flicker=50&flipup=0&fliplr=0&brate=550&svol=2&mvol=22&wifi=82&bat=14&hum=-1&tem=-273&hum_float=-1.0&tem_float=-273.0&storage=1&md=0:0:3:0&sd=0:2:3:0&td=0:3:1529:0&lbd=1:0:1:0&ir=0&lulla=0&res=720&sdcap=-113&sdfree=0&sdatrm=1&sdnoclips=10&mdled=0&ca=1&charge=0&lulvol=3&isp_idx=1&agc_lvl=0&ssid1=Zen+7530&ssid2=&ssid3=Zen+7530&hw_id=6&puscan=1&pu_ana_en=1&rtscan=1&panel_vox=0&charge_dur=21&mvr=1&dnsm=192.168.178.1&dnss=80.23.63.0&wifi_env=100001000000006&lulla_dur=15&localip=192.168.178.36&sync_channel=3&rp_pair=0&rp_conn=disconnect&blue_led_en=1&blue_led_ontime=180&red_led_affect=0&block_pu_upgrade=0&pu_fw_pkg=00.00.00&advise_homemode=1&snapshot_storage=1&soc_ver=517260&

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
          console.log('<< FINISHED SCAN - found: ' + results.length + ' >>');
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
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text> Scan Progress:  { (scanProgress == 100 ? 'Complete': scanProgress + '%') } </Text>
      <Button onPress={ performScan } title='Rescan'></Button>

      <FlatList
        data={devices}
        style={styles.deviceList}
        //numColumns={2}
        //style={styles.previewListStyle}
        renderItem={({item, index}) =>
        <TouchableOpacity>
          <Text>{ index }</Text>
          <Text>{ item.ipAddress }</Text>
          <Text></Text>
          
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
    backgroundColor: 'blue'
  }
});
