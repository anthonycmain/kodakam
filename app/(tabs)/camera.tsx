import { Button, FlatList, SectionList, StyleSheet, TouchableOpacity, VirtualizedList } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import LanPortScanner, { LSScanConfig, LSSingleScanResult } from 'react-native-lan-port-scanner';
import { useCallback, useEffect, useState } from 'react';
import CameraInfo, { getCommands, allCommands } from '@/types/CameraInfo';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MonoText } from '@/components/StyledText';

export default function CameraDetailsScreen() {

  const router = useRouter();

  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [cameraInfo, setCameraInfo] = useState<CameraInfo>();

  const [params, setParams] = useState<{[key: string]: string}>();

  //const [allInfo, setAllInfo] = useState<Array<{[key: string]: QueryParam[]}>>([]);
  //const [allInfo, setAllInfo] = useState<Record<string, QueryParam[]>>({});
  const [allInfo, setAllInfo] = useState<MySection[]>([]);
  


  const { t } = useTranslation();
  
  interface MySection {
    title: string;
    data: QueryParam[];
  }
  
  const getCameraInfo = useCallback(async () => {

    // Get the camera infor
    const cameraAddress = 'http://' + local.id + '/';
    console.log('Connecting to: ' + cameraAddress);

    // Clear state
    setAllInfo([]);

    // Look through the get commands
    for (const key in allCommands) {

        const command = allCommands[key];

        //console.log('Processing: ' + command);

        if (command.startsWith('get_')) {

        const url = cameraAddress + '?req=' + command

        //console.log(url)

        fetch(url)
        .then(caminfo => {

          caminfo.text().then(function (body) {

            const queryString = body.split(command + ': ')[1];

            if (queryString != '-1') {

              // Get all the params
              const cameraParams = new URLSearchParams(queryString);
              const paramsArray: QueryParam[] = [];
              cameraParams.forEach((value, key) => {
                paramsArray.push({ key, value });
              });
              
              let section: MySection ={
                title: command,
                data: paramsArray
              } 

              let cameraDetails = allInfo;
              cameraDetails.push(section);

              setAllInfo(cameraDetails);
            }

          });
        });
      }

    }

    // fetch(cameraAddress + '?req=get_caminfo')
    //   .then(caminfo => {

    //     caminfo.text().then(function (body) {

    //       const queryString = body.split('get_caminfo: ')[1];

    //       const cameraParams = new URLSearchParams(queryString);

    //       // Populate CameraInfo object
    //       const cameraInfo: CameraInfo = {
    //         ipAddress: local.id.toString(),
    //         params: cameraParams
    //       }

          


    //       let indexedArray: {[key: string]: number};

    //       //indexedArray = params.values();


    //       setCameraInfo(cameraInfo);

    //     });

        
    //   });
      
      

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

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: MySection;
  }) => <View style={styles.section}>
        <MonoText>{title}</MonoText>
      </View>;

  const renderItem = ({ item }: { item: QueryParam }) => (
    <Text>{`${item.key}, ${item.value}`}</Text>
  );
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('camera.title')} Details</Text>
      <Text style={styles.title}>{ local.id } </Text>
      <Button onPress={ getCameraInfo } title='Query Camera'></Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* <FlatList
        data={paramsArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'row'}}>
            <Text style={{width: 150, marginRight: 50, padding: 10}}>{t('params.' + item.key)}</Text>
            <Text style={{padding: 10}}>{item.value}</Text>
          </View>
        )}
      /> */}

      <SectionList
        sections={allInfo}
        keyExtractor={(item) => item.key.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
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
  section: {
    backgroundColor: 'pink',
    fontWeight: 'bold'

  },
  paramList: {
    flex: 1,
    backgroundColor: 'blue'
  }
});
