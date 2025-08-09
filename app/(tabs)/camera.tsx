import { SectionList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Text, View } from '@/components/Themed';
import CameraCommandInterface from '@/components/CameraCommandInterface';

import { useCallback, useEffect, useState } from 'react';
import CameraInfo, { getCommands, allCommands } from '@/types/CameraInfo';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function CameraDetailsScreen() {

  const router = useRouter();

  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [cameraInfo, setCameraInfo] = useState<CameraInfo>();

  const [params, setParams] = useState<{[key: string]: string}>();

  const [allInfo, setAllInfo] = useState<MySection[]>([]);
  const [showCommandInterface, setShowCommandInterface] = useState(false);

  const [isQuerying, setIsQuerying] = useState(false);


  const { t } = useTranslation();
  
  interface MySection {
    title: string;
    data: QueryParam[];
  }
  
  const getCameraInfo = useCallback(async () => {
    // Prevent multiple simultaneous queries
    if (isQuerying) {
      return;
    }

    // Get the camera info
    const cameraAddress = 'http://' + local.id + '/';
    console.log('Connecting to: ' + cameraAddress);

    // Set loading state and clear previous data immediately
    setIsQuerying(true);
    setAllInfo([]);

    // Collect all promises to wait for completion
    const queryPromises: Promise<void>[] = [];

    // Look through the get commands
    for (const key in allCommands) {
      const command = allCommands[key];

      if (command.startsWith('get_')) {
        const url = cameraAddress + '?req=' + command;

        // Create a promise for each query
        const queryPromise = fetch(url)
          .then(caminfo => caminfo.text())
          .then(body => {
            const queryString = body.split(command + ': ')[1];

            if (queryString && queryString !== '-1') {
              // Get all the params
              const cameraParams = new URLSearchParams(queryString);
              const paramsArray: QueryParam[] = [];
              cameraParams.forEach((value, key) => {
                paramsArray.push({ key, value });
              });
              
              const section: MySection = {
                title: command,
                data: paramsArray
              };

              // Use functional update to avoid stale state issues
              setAllInfo(prevInfo => [...prevInfo, section]);
            }
          })
          .catch(error => {
            console.error(`Failed to query ${command}:`, error);
            // You could add error sections here if desired
          });

        queryPromises.push(queryPromise);
      }
    }

    // Wait for all queries to complete
    try {
      await Promise.allSettled(queryPromises);
    } catch (error) {
      console.error('Error during camera queries:', error);
    } finally {
      setIsQuerying(false);
    }


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

  // Human-readable parameter mapping
  const getReadableParameterName = (key: string): string => {
    const parameterMap: { [key: string]: string } = {
      // Basic Info
      'localip': 'Local IP Address',
      'wifi': 'WiFi Signal Strength',
      'bat': 'Battery Level',
      'charge': 'Charging Status',
      'charge_dur': 'Charge Duration',
      'storage': 'Storage Type',
      
      // Video Settings
      'res': 'Video Resolution',
      'brate': 'Bitrate',
      'frate': 'Frame Rate',
      'gop': 'GOP (Group of Pictures)',
      'flicker': 'Flicker Frequency',
      'flipup': 'Camera Orientation',
      'isp_idx': 'Picture Mode',
      
      // Audio Settings
      'svol': 'Speaker Volume',
      'mvol': 'Microphone Volume',
      'lulvol': 'Lullaby Volume',
      
      // Detection Settings
      'ir': 'Night Vision',
      'md': 'Motion Detection',
      'sd': 'Sound Detection',
      'td': 'Temperature Detection',
      'lbd': 'Light Detection',
      
      // Environmental Data
      'tem': 'Temperature (°C)',
      'tem_float': 'Temperature (Precise)',
      'hum': 'Humidity (%)',
      'hum_float': 'Humidity (Precise)',
      
      // SD Card Info
      'sdcap': 'SD Card Capacity',
      'sdfree': 'SD Card Free Space',
      'sdatrm': 'Auto Remove Old Files',
      'sdnoclips': 'Number of Clips to Keep',
      
      // Network Settings
      'ssid1': 'Primary WiFi Network',
      'ssid2': 'Secondary WiFi Network',
      'ssid3': 'Active WiFi Network',
      'dnsm': 'Primary DNS',
      'dnss': 'Secondary DNS',
      
      // System Info
      'hw_id': 'Hardware ID',
      'soc_ver': 'System Version',
      'ca': 'Camera Active',
      'mvr': 'Motion Video Recording',
      
      // Advanced Settings
      'agc_lvl': 'Audio Gain Level',
      'mdled': 'Motion Detection LED',
      'lulla': 'Lullaby Mode',
      'lulla_dur': 'Lullaby Duration',
      'advise_homemode': 'Home Mode Advisory',
      'snapshot_storage': 'Snapshot Storage Location',
      
      // Connectivity
      'rp_pair': 'Repeater Pairing',
      'rp_conn': 'Repeater Connection',
      'wifi_env': 'WiFi Environment',
      'sync_channel': 'Sync Channel',
      
      // LED Settings
      'blue_led_en': 'Blue LED Enabled',
      'blue_led_ontime': 'Blue LED On Time',
      'red_led_affect': 'Red LED Affected',
      
      // System Status
      'puscan': 'Push Scan',
      'pu_ana_en': 'Push Analysis Enabled',
      'rtscan': 'Real-time Scan',
      'panel_vox': 'Panel Voice',
      'block_pu_upgrade': 'Block Push Upgrade',
      'pu_fw_pkg': 'Push Firmware Package'
    };
    
    return parameterMap[key] || key;
  };

  const formatParameterValue = (key: string, value: string): string => {
    // Convert numeric values to more readable formats
    switch (key) {
      case 'wifi':
        return `${value}% (${parseInt(value) > 70 ? 'Excellent' : parseInt(value) > 50 ? 'Good' : parseInt(value) > 30 ? 'Fair' : 'Poor'})`;
      
      case 'bat':
        const batteryLevel = parseInt(value);
        if (batteryLevel > 75) return `${value}% (Full)`;
        if (batteryLevel > 50) return `${value}% (Good)`;
        if (batteryLevel > 25) return `${value}% (Low)`;
        return `${value}% (Critical)`;
      
      case 'charge':
        return value === '1' ? 'Charging' : 'Not Charging';
      
      case 'storage':
        return value === '1' ? 'Cloud Storage' : 'SD Card';
      
      case 'res':
        return value === '720' ? '720p (HD)' : value === '480' ? '480p (Standard)' : `${value}p`;
      
      case 'flipup':
        return value === '1' ? 'Ceiling Mount (Flipped)' : 'Normal Orientation';
      
      case 'flicker':
        return `${value} Hz`;
      
      case 'ir':
        switch (value) {
          case '0': return 'Auto';
          case '1': return 'Always On';
          case '2': return 'Always Off';
          default: return value;
        }
      
      case 'mdled':
        return value === '1' ? 'Motion LED On' : 'Motion LED Off';
      
      case 'ca':
        return value === '1' ? 'Active' : 'Inactive';
      
      case 'tem':
        const temp = parseInt(value);
        if (temp === -273) return 'No sensor data';
        return `${value}°C`;
      
      case 'hum':
        if (value === '-1') return 'No sensor data';
        return `${value}%`;
      
      case 'sdcap':
        if (parseInt(value) < 0) return 'No SD card';
        return `${Math.abs(parseInt(value))} MB`;
      
      case 'sdfree':
        return `${value} MB free`;
      
      case 'brate':
        return `${value} kbps`;
      
      case 'rp_conn':
        return value === 'disconnect' ? 'Disconnected' : value;
      
      case 'blue_led_en':
        return value === '1' ? 'Enabled' : 'Disabled';
      
      case 'blue_led_ontime':
        return `${value} seconds`;
      
      case 'lulla_dur':
        return `${value} minutes`;
      
      case 'charge_dur':
        return `${value} minutes`;
      
      // Boolean values
      case 'sdatrm':
      case 'puscan':
      case 'pu_ana_en':
      case 'rtscan':
      case 'mvr':
      case 'advise_homemode':
      case 'red_led_affect':
      case 'block_pu_upgrade':
        return value === '1' ? 'Yes' : 'No';
      
      default:
        // For complex values like detection settings (format: "0:0:3:0")
        if (value.includes(':')) {
          const parts = value.split(':');
          if (parts.length === 4) {
            const [enabled, schedule, sensitivity, unknown] = parts;
            return `${enabled === '1' ? 'Enabled' : 'Disabled'} (Sensitivity: ${sensitivity})`;
          }
        }
        return value;
    }
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: MySection;
  }) => <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title.replace('get_', '').replace(/_/g, ' ').toUpperCase()}</Text>
      </View>;

  const renderItem = ({ item }: { item: QueryParam }) => (
    <View style={styles.parameterRow}>
      <Text style={styles.parameterLabel}>{getReadableParameterName(item.key)}</Text>
      <Text style={styles.parameterValue}>{formatParameterValue(item.key, item.value)}</Text>
    </View>
  );
  




  if (showCommandInterface) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backChevron}
            onPress={() => setShowCommandInterface(false)}
          >
            <Text style={styles.backChevronText}>‹</Text>
          </TouchableOpacity>
        </View>
        <CameraCommandInterface cameraAddress={`http://${local.id}/`} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ local.id } </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isQuerying && styles.buttonDisabled]} 
          onPress={getCameraInfo}
          disabled={isQuerying}
        >
          {isQuerying ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Query Camera</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.commandButton]} 
          onPress={() => setShowCommandInterface(true)}
        >
          <Text style={styles.buttonText}>Send Commands</Text>
        </TouchableOpacity>
      </View>


      {isQuerying && allInfo.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Querying camera...</Text>
        </View>
      )}

      <SectionList
        sections={allInfo}
        keyExtractor={(item) => item.key.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        style={styles.fullWidthList}
        contentContainerStyle={styles.listContainer}
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
  header: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  backChevron: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backChevronText: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'normal',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  commandButton: {
    backgroundColor: '#ED0000',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  sectionHeader: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginHorizontal: 0,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  paramList: {
    flex: 1,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 0,
    marginVertical: 2,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  parameterValue: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    flex: 1,
    fontWeight: 'normal',
  },
  fullWidthList: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
