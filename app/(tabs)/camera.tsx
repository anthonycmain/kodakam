import { Button, FlatList, StyleSheet, TouchableOpacity, VirtualizedList } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import LanPortScanner, { LSScanConfig, LSSingleScanResult } from 'react-native-lan-port-scanner';
import { useCallback, useEffect, useState } from 'react';
import CameraInfo from '@/types/CameraInfo';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function CameraDetailsScreen() {

  const router = useRouter();

  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [cameraInfo, setCameraInfo] = useState<CameraInfo>();

  const [params, setParams] = useState<{[key: string]: string}>();

  const { t } = useTranslation();
  
  const getCameraInfo = useCallback(async () => {

    // Get the camera infor
    const cameraAddress = 'http://' + local.id + '/?req=get_caminfo';
    console.log('Opening: ' + cameraAddress);

    fetch(cameraAddress)
      .then(caminfo => {

        caminfo.text().then(function (body) {

          const queryString = body.split('get_caminfo: ')[1];

          const params = new URLSearchParams(queryString);

          // Populate CameraInfo object
          const cameraInfo: CameraInfo = {
            ipAddress: local.id.toString(),
            params: params
          }


          let indexedArray: {[key: string]: number};

          //indexedArray = params.values();


          setCameraInfo(cameraInfo);

        });

        
      });
      
      

  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await getCameraInfo();
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  
  interface QueryParam {
    key: string;
    value: string;
  }

  
  const paramsArray: QueryParam[] = [];
    cameraInfo?.params.forEach((value, key) => {
      paramsArray.push({ key, value });
    });


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('camera.title')} Details</Text>
      <Text style={styles.title}>{ cameraInfo?.ipAddress} </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <FlatList
        data={paramsArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'row'}}>
            <Text style={{width: 150, marginRight: 50, padding: 10}}>{t('params.' + item.key)}</Text>
            <Text style={{padding: 10}}>{item.value}</Text>
          </View>
        )}
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
  paramList: {
    flex: 1,
    backgroundColor: 'blue'
  }
});
