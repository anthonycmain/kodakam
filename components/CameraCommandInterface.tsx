import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
  SectionList,
} from 'react-native';
import { 
  cameraCommands, 
  CameraCommand, 
  CommandParameter 
} from '@/types/CameraInfo';

interface CameraCommandInterfaceProps {
  cameraAddress: string;
}

interface ParameterValues {
  [key: string]: string | number;
}

export default function CameraCommandInterface({ cameraAddress }: CameraCommandInterfaceProps) {
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [parameterValues, setParameterValues] = useState<ParameterValues>({});
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  
  // Modal picker state
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [currentPickerParam, setCurrentPickerParam] = useState<CommandParameter | null>(null);
  const [pickerOptions, setPickerOptions] = useState<Array<{label: string, value: any}>>([]);
  
  // Command picker state
  const [showCommandModal, setShowCommandModal] = useState(false);

  const commandOptions = Object.keys(cameraCommands).map(key => ({
    label: cameraCommands[key].description,
    command: key,
    value: key,
    category: cameraCommands[key].category,
  }));

  // Group commands by category
  const getCommands = commandOptions.filter(cmd => cmd.category === 'get');
  const setCommands = commandOptions.filter(cmd => cmd.category === 'set');
  const actionCommands = commandOptions.filter(cmd => cmd.category === 'action');

  // Create sectioned data for SectionList
  const commandSections = [
    {
      title: 'GET Commands - Retrieve information from the camera',
      data: getCommands,
    },
    {
      title: 'SET Commands - Change camera settings', 
      data: setCommands,
    },
    {
      title: 'ACTION Commands - Trigger immediate actions',
      data: actionCommands,
    },
  ].filter(section => section.data.length > 0); // Only show sections with commands

  const handleCommandChange = (command: string) => {
    setSelectedCommand(command);
    setParameterValues({});
    setResponse('');
  };

  const handleParameterChange = (paramName: string, value: string | number) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const openPickerModal = (param: CommandParameter) => {
    setCurrentPickerParam(param);
    
    // Format options for the modal
    const formattedOptions = param.options?.map(option => {
      if (typeof option === 'object' && 'label' in option) {
        return { label: option.label, value: option.value };
      } else {
        return { label: option.toString(), value: option };
      }
    }) || [];
    
    setPickerOptions(formattedOptions);
    setShowPickerModal(true);
  };

  const selectPickerValue = (value: any) => {
    if (currentPickerParam) {
      handleParameterChange(currentPickerParam.name, value);
    }
    setShowPickerModal(false);
    setCurrentPickerParam(null);
  };

  const openCommandModal = () => {
    setShowCommandModal(true);
  };

  const selectCommand = (commandKey: string) => {
    setSelectedCommand(commandKey);
    setParameterValues({}); // Clear parameters when changing command
    setShowCommandModal(false);
  };

  const buildCommandUrl = (command: CameraCommand): string => {
    let url = `${cameraAddress}?req=${command.command}`;
    
    command.parameters.forEach(param => {
      const value = parameterValues[param.name];
      if (value !== undefined && value !== '') {
        url += `&${param.name}=${encodeURIComponent(value.toString())}`;
      }
    });
    
    return url;
  };

  const validateParameters = (command: CameraCommand): boolean => {
    for (const param of command.parameters) {
      if (param.required && (parameterValues[param.name] === undefined || parameterValues[param.name] === '')) {
        Alert.alert('Validation Error', `Parameter "${param.name}" is required`);
        return false;
      }
      
      if (param.type === 'number' && parameterValues[param.name] !== undefined) {
        const numValue = Number(parameterValues[param.name]);
        if (param.min !== undefined && numValue < param.min) {
          Alert.alert('Validation Error', `Parameter "${param.name}" must be at least ${param.min}`);
          return false;
        }
        if (param.max !== undefined && numValue > param.max) {
          Alert.alert('Validation Error', `Parameter "${param.name}" must be at most ${param.max}`);
          return false;
        }
      }
    }
    return true;
  };

  const formatResponse = (rawResponse: string, commandName: string): string => {
    if (!rawResponse) {
      return 'No response received from camera';
    }

    // For GET commands, parse the response format: "command: param1=value1&param2=value2"
    if (commandName.startsWith('get_') && rawResponse.includes(commandName + ':')) {
      const responseParts = rawResponse.split(commandName + ': ');
      if (responseParts.length > 1) {
        const queryString = responseParts[1].trim();
        
        if (queryString === '-1') {
          return `Command "${commandName}" returned: -1 (Command failed or not supported)`;
        }

        // Parse URL parameters into readable format
        try {
          const params = new URLSearchParams(queryString);
          let formattedResponse = `Response from "${commandName}":\n\n`;
          
          const paramEntries = Array.from(params.entries());
          if (paramEntries.length === 0) {
            return `Command "${commandName}" executed successfully (no data returned)`;
          }

          paramEntries.forEach(([key, value]) => {
            formattedResponse += `${key}: ${value}\n`;
          });
          
          return formattedResponse;
        } catch (error) {
          return `Raw response from "${commandName}":\n${rawResponse}`;
        }
      }
    }

    // For SET/ACTION commands or other responses
    if (rawResponse.includes(commandName + ':')) {
      const responseParts = rawResponse.split(commandName + ': ');
      if (responseParts.length > 1) {
        const result = responseParts[1].trim();
        return `Command "${commandName}" result: ${result}`;
      }
    }

    // Fallback to raw response
    return `Raw response:\n${rawResponse}`;
  };

  const executeCommand = async () => {
    
    if (!selectedCommand) {
      Alert.alert('Error', 'Please select a command');
      return;
    }

    const command = cameraCommands[selectedCommand];
    if (!validateParameters(command)) {
      return;
    }

    setIsLoading(true);
    setResponse('');
    setShowModal(true); // Show modal immediately when command starts

    try {
      const url = buildCommandUrl(command);

      // Set a timeout for the request (10 seconds)
      const timeoutId = setTimeout(() => {
        setResponse('Request timed out. Camera may be unresponsive.');
        setIsLoading(false);
      }, 10000);

      const fetchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!fetchResponse.ok) {
        throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
      }
      
      const responseText = await fetchResponse.text();
      
      if (!responseText || responseText.trim() === '') {
        setResponse('Command executed but camera returned no data.');
      } else {
        const formattedResponse = formatResponse(responseText, command.command);
        setResponse(formattedResponse);
      }
    } catch (error) {
      console.error('Command execution error:', error);
      let errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Network request failed')) {
        errorMessage = 'Network error: Unable to connect to camera. Please check the camera IP address and network connection.';
      }
      
      setResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderParameterInput = (param: CommandParameter) => {
    const value = parameterValues[param.name];

    switch (param.type) {
      case 'select':
        const selectedOption = param.options?.find(option => {
          if (typeof option === 'object' && 'label' in option) {
            return option.value === value;
          } else {
            return option === value;
          }
        });
        
        const displayText = selectedOption ? 
          (typeof selectedOption === 'object' && 'label' in selectedOption ? selectedOption.label : selectedOption.toString()) :
          'Select an option...';
        
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <TouchableOpacity
              style={styles.modalPickerButton}
              onPress={() => openPickerModal(param)}
            >
              <Text style={[
                styles.modalPickerText,
                !value && styles.modalPickerPlaceholder
              ]}>
                {displayText}
              </Text>
              <Text style={styles.modalPickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        );

      case 'number':
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <TextInput
              style={styles.textInput}
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const numValue = parseFloat(text);
                handleParameterChange(param.name, isNaN(numValue) ? text : numValue);
              }}
              keyboardType="numeric"
              placeholder={`Enter ${param.name}${param.min !== undefined ? ` (${param.min}-${param.max})` : ''}`}
            />
          </View>
        );

      case 'text':
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <TextInput
              style={styles.textInput}
              value={value?.toString() || ''}
              onChangeText={(text) => handleParameterChange(param.name, text)}
              placeholder={`Enter ${param.name}`}
              autoCapitalize="none"
            />
          </View>
        );

      case 'boolean':
        const booleanParam = {
          ...param,
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" }
          ]
        };
        
        const boolSelectedOption = booleanParam.options.find(option => option.value === value);
        const boolDisplayText = boolSelectedOption ? boolSelectedOption.label : 'Select...';
        
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <TouchableOpacity
              style={styles.modalPickerButton}
              onPress={() => openPickerModal(booleanParam)}
            >
              <Text style={[
                styles.modalPickerText,
                !value && styles.modalPickerPlaceholder
              ]}>
                {boolDisplayText}
              </Text>
              <Text style={styles.modalPickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };



  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Tip: GET commands display results in a popup. SET commands change camera settings. Action commands trigger immediate actions.
        </Text>
      </View>

      {/* Command Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Command</Text>
        <Text style={styles.sectionDescription}>
          Choose a camera command to execute. GET commands retrieve info, SET commands change settings, and Action commands trigger actions.
        </Text>
        <TouchableOpacity
          style={styles.modalPickerButton}
          onPress={openCommandModal}
        >
          <Text style={[
            styles.modalPickerText,
            !selectedCommand && styles.modalPickerPlaceholder
          ]}>
            {selectedCommand ? 
              cameraCommands[selectedCommand]?.description : 
              'Select a command...'
            }
          </Text>
          <Text style={styles.modalPickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Parameter Inputs */}
      {selectedCommand && (
        <View style={styles.parametersSection}>
          <Text style={styles.parametersTitle}>Parameters</Text>
          {cameraCommands[selectedCommand].parameters.length === 0 ? (
            <Text style={styles.noParameters}>No parameters required</Text>
          ) : (
            cameraCommands[selectedCommand].parameters.map(renderParameterInput)
          )}
        </View>
      )}



      {/* Execute Button */}
      {selectedCommand ? (
        <TouchableOpacity
          style={[styles.executeButton, isLoading && styles.executeButtonDisabled]}
          onPress={executeCommand}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.executeButtonText}>Execute Command</Text>
          )}
        </TouchableOpacity>
      ) : null}

      {/* Response Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Command Response</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.responseContainer}>
            {response ? (
              <Text style={styles.responseText}>{response}</Text>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Processing command...</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Picker */}
      <Modal
        visible={showPickerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select {currentPickerParam?.name}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPickerModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pickerOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => selectPickerValue(item.value)}
              >
                <Text style={styles.pickerOptionText}>{item.label}</Text>
                {parameterValues[currentPickerParam?.name || ''] === item.value && (
                  <Text style={styles.pickerCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Command Selection Modal */}
      <Modal
        visible={showCommandModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Command</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCommandModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <SectionList
            sections={commandSections}
            keyExtractor={(item) => item.value}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeaderModal}>
                <Text style={styles.sectionHeaderModalText}>{title}</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => selectCommand(item.value)}
              >
                <View style={styles.commandModalItem}>
                  <Text style={styles.commandModalTitle}>{item.label}</Text>
                  <Text style={styles.commandModalCategory}>{item.command}</Text>
                </View>
                {selectedCommand === item.value && (
                  <Text style={styles.pickerCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    padding: 12,
    marginBottom: 20
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },

  parametersSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  parametersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  noParameters: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  parameterContainer: {
    marginBottom: 16,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  parameterDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },

  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
  },
  executeButton: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  executeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  executeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFB700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  responseContainer: {
    flex: 1,
    padding: 16,
  },
  responseText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#000',
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  modalPickerButton: {
    backgroundColor: '#ED0000',
    borderRadius: 0,
    borderWidth: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPickerText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  modalPickerPlaceholder: {
    color: '#fff',
    opacity: 0.7,
  },
  modalPickerArrow: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 8,
  },
  pickerOption: {
    backgroundColor: 'transparent',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  pickerCheckmark: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  commandModalItem: {
    flex: 1,
    marginRight: 12,
  },
  commandModalTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 2,
  },
  commandModalCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '400',
  },
  sectionHeaderModal: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionHeaderModalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});