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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

  // Debug logging
  console.log('CameraCommandInterface rendered with address:', cameraAddress);
  console.log('Available camera commands:', Object.keys(cameraCommands));

  const commandOptions = Object.keys(cameraCommands).map(key => ({
    label: `${cameraCommands[key].description} (${key})`,
    value: key,
    category: cameraCommands[key].category,
  }));

  console.log('Command options:', commandOptions);

  // Group commands by category
  const getCommands = commandOptions.filter(cmd => cmd.category === 'get');
  const setCommands = commandOptions.filter(cmd => cmd.category === 'set');
  const actionCommands = commandOptions.filter(cmd => cmd.category === 'action');

  console.log('GET commands:', getCommands);
  console.log('SET commands:', setCommands);
  console.log('Action commands:', actionCommands);

  const handleCommandChange = (command: string) => {
    console.log('Command selected:', command);
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
    console.log('Execute button pressed!');
    console.log('Selected command:', selectedCommand);
    console.log('Parameter values:', parameterValues);
    
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
      console.log('Executing command:', url);

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
      
      console.log('Raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        setResponse('Command executed but camera returned no data.');
      } else {
        const formattedResponse = formatResponse(responseText, command.command);
        setResponse(formattedResponse);
      }
    } catch (error) {
      console.error('Command execution error:', error);
      let errorMessage = `Error: ${error.message}`;
      
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
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
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value || ''}
                onValueChange={(itemValue) => handleParameterChange(param.name, itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select an option..." value="" />
                {param.options?.map((option, index) => {
                  if (typeof option === 'object' && 'label' in option) {
                    return (
                      <Picker.Item
                        key={index}
                        label={option.label}
                        value={option.value}
                      />
                    );
                  } else {
                    return (
                      <Picker.Item
                        key={index}
                        label={option.toString()}
                        value={option}
                      />
                    );
                  }
                })}
              </Picker>
            </View>
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
        return (
          <View key={param.name} style={styles.parameterContainer}>
            <Text style={styles.parameterLabel}>
              {param.name} {param.required && '*'}
            </Text>
            <Text style={styles.parameterDescription}>{param.description}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value || ''}
                onValueChange={(itemValue) => handleParameterChange(param.name, itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="True" value="true" />
                <Picker.Item label="False" value="false" />
              </Picker>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderCommandSection = (title: string, commands: typeof commandOptions) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {title === 'GET Commands' && (
        <Text style={styles.sectionDescription}>
          GET commands retrieve information from the camera and display the results in a popup.
        </Text>
      )}
      {title === 'SET Commands' && (
        <Text style={styles.sectionDescription}>
          SET commands configure camera settings. Configure parameters below before executing.
        </Text>
      )}
      {title === 'Action Commands' && (
        <Text style={styles.sectionDescription}>
          Action commands trigger immediate actions like playing melodies or restarting the camera.
        </Text>
      )}
      {commands.map((cmd) => (
        <TouchableOpacity
          key={cmd.value}
          style={[
            styles.commandOption,
            selectedCommand === cmd.value && styles.selectedCommand
          ]}
          onPress={() => {
            console.log('TouchableOpacity pressed for command:', cmd.value);
            handleCommandChange(cmd.value);
          }}
        >
          <Text style={[
            styles.commandText,
            selectedCommand === cmd.value && styles.selectedCommandText
          ]}>
            {cmd.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Camera Commands</Text>
      <Text style={styles.address}>Camera: {cameraAddress}</Text>
      
      <TouchableOpacity 
        style={[styles.executeButton, { backgroundColor: '#FF6B6B', marginBottom: 16 }]}
        onPress={() => {
          console.log('Test button pressed!');
          Alert.alert('Test', 'Button is working! Check console for logs.');
        }}
      >
        <Text style={styles.executeButtonText}>🧪 Test Button (Press Me First)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.executeButton, { backgroundColor: '#9C27B0', marginBottom: 16 }]}
        onPress={() => {
          console.log('Direct command test!');
          setSelectedCommand('get_caminfo');
          Alert.alert('Test', 'Manually selected get_caminfo command!');
        }}
      >
        <Text style={styles.executeButtonText}>🔧 Direct Select Test</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Tip: GET commands will display their results in a popup window. 
          The output shows all the camera settings and status information.
        </Text>
      </View>

      {selectedCommand && (
        <View style={[styles.infoContainer, { backgroundColor: '#E8F5E8' }]}>
          <Text style={[styles.infoText, { color: '#2E7D32' }]}>
            ✅ Selected: {selectedCommand}
          </Text>
        </View>
      )}

      {/* Command Selection */}
      {renderCommandSection('GET Commands', getCommands)}
      {renderCommandSection('SET Commands', setCommands)}
      {renderCommandSection('Action Commands', actionCommands)}

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

      {/* Debug: Show current state */}
      <View style={[styles.infoContainer, { backgroundColor: '#FFF3E0' }]}>
        <Text style={[styles.infoText, { color: '#E65100' }]}>
          Debug: selectedCommand = "{selectedCommand}" | isLoading = {isLoading.toString()}
        </Text>
      </View>

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
      ) : (
        <View style={[styles.infoContainer, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.infoText, { color: '#C62828' }]}>
            No command selected - Execute button hidden
          </Text>
        </View>
      )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
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
  commandOption: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCommand: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  commandText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCommandText: {
    color: 'white',
    fontWeight: 'bold',
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
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
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
    backgroundColor: '#007AFF',
    borderRadius: 8,
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
    backgroundColor: 'white',
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
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
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
    color: '#333',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
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
});