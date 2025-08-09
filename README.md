
# Kodakam

![mini-icon](https://github.com/anthonycmain/kodakam/assets/950131/5742001b-dd01-4b7d-8a8a-b472bb2d8811)

**Description**: After Kodak shutdown its Smart Home division, this project provides a comprehensive app solution for those wanting to continue using their cameras with full control and monitoring capabilities.

## Features

- **Camera Discovery**: Automatically scan and discover Kodak smart cameras on your local network
- **Camera Information**: Query detailed camera status including battery level, WiFi strength, temperature, and system info
- **Remote Control**: Execute camera commands including:
  - **GET Commands**: Retrieve camera settings and status information
  - **SET Commands**: Configure camera settings (motion detection, flip mode, recording quality, etc.)
  - **Action Commands**: Trigger actions like playing melodies, restarting, or taking snapshots
- **User-Friendly Interface**: Modal-based command selection with parameter validation
- **Real-time Feedback**: Live status updates and formatted command responses

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Components**: React Native Elements, custom modal interfaces
- **Network**: HTTP-based camera communication, LAN port scanning
- **State Management**: React hooks (useState, useCallback)
- **Internationalization**: react-i18next for multi-language support

## Status

**Beta** - Core functionality implemented and tested. Camera discovery, querying, and command execution are fully functional.



## Dependencies

### Core Dependencies
- [react-native-lan-port-scanner](https://github.com/gajjartejas/react-native-lan-port-scanner) - Network scanning for camera discovery
- [expo-router](https://expo.github.io/router/) - File-based navigation
- [react-i18next](https://react.i18next.com/) - Internationalization
- [react-native-tcp](https://github.com/Rapsssito/react-native-tcp-socket) - Network communication

### Development Dependencies
- TypeScript for type safety
- ESLint for code quality
- Expo development tools

## Installation

### Prerequisites
- Node.js (v16 or later)
- Yarn or npm
- Expo CLI
- iOS Simulator (macOS) or Android Studio for testing

### Setup Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/anthonycmain/kodakam.git
   cd kodakam
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` to open iOS Simulator
   - **Android**: Press `a` to open Android emulator
   - **Physical Device**: Scan QR code with Expo Go app

### Important Notes
- **Network Requirements**: The app requires access to your local network to discover cameras
- **Development vs Production**: For full LAN scanning functionality, build and install the app directly (not through Expo Go)
- **Camera Compatibility**: Tested with Kodak smart cameras (models W101, W121, etc.)


## Usage

### Basic Workflow
1. **Launch the app** and ensure you're connected to the same WiFi network as your Kodak cameras
2. **Scan for cameras** using the built-in network scanner
3. **Select a camera** from the discovered devices list
4. **Query camera info** to see current status (battery, WiFi, temperature, etc.)
5. **Send commands** using the modal interface to control camera settings

### Available Commands

#### GET Commands (Information Retrieval)
- `get_caminfo` - Complete camera status and settings
- `get_temp_humid` - Temperature and humidity readings
- `get_version` - Firmware version information
- `get_wifi_strength` - WiFi signal strength
- `get_night_vision` - Current night vision mode status

#### SET Commands (Configuration)
**Camera Orientation & Video:**
- `set_flipup` - Camera orientation (Normal/Ceiling Mount)
- `set_flicker` - Flicker frequency (50Hz/60Hz)
- `set_resolution` - Video resolution settings
- `set_night_vision` - Night vision mode (Auto/On/Off)

**Motion & Sound Detection:**
- `set_motion_source` - Motion detection on/off
- `set_motion_sensitivity` - Motion sensitivity (Low/Medium/High)
- `set_motion_storage` - Motion recording storage (SD Card/Cloud)
- `set_sound_detection` - Sound detection settings with sensitivity

**System & Connectivity:**
- `set_blue_led` - Blue LED indicator settings
- `change_router_info` - Change WiFi network settings

**Audio:**
- `melody_vol` - Set melody volume (0-5)

#### Action Commands
**Melody & Sounds:**
- `melody1` through `melody5` - Play different melodies (5/10/15 second duration)
- `melodystop` - Stop playing melody

**System Control:**
- `restart_system` - Restart camera system
- `pair_stop` - Restart camera (pairing mode)

### Tips
- **Response Format**: GET commands display formatted results in a popup
- **Parameter Validation**: The app validates required parameters before sending commands
- **Network Timeout**: Commands have a 10-second timeout for unresponsive cameras
- **Error Handling**: Clear error messages for network and camera issues

## Known Issues

- **Camera Discovery**: Some cameras may not appear immediately - try refreshing the scan
- **Network Timing**: Initial connection may take 10-15 seconds depending on network speed
- **Command Responses**: Some older camera firmware may return different response formats
- **Background Scanning**: LAN scanning requires the app to be built and installed (not available in Expo Go)


## Project Structure

```
kodakam/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── camera.tsx     # Camera details and control
│   │   └── index.tsx      # Home/scanner screen
│   └── translations/      # i18n language files
├── components/            # Reusable React components
│   ├── CameraCommandInterface.tsx  # Command execution UI
│   └── Themed.tsx        # Theme-aware components
├── types/                # TypeScript type definitions
│   └── CameraInfo.ts     # Camera command definitions
├── constants/            # App constants and configuration
└── assets/              # Images, fonts, and static files
```

### Key Files
- **`types/CameraInfo.ts`** - Comprehensive camera command definitions and parameters
- **`components/CameraCommandInterface.tsx`** - Modal-based command interface with parameter validation
- **`app/(tabs)/camera.tsx`** - Main camera control screen with formatted status display
- **`package.json`** - Dependencies including network scanning and communication libraries

## Contributing

We welcome contributions! Please see [CONTRIBUTING](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Areas for Contribution
- **Camera Compatibility**: Testing with different Kodak camera models
- **UI/UX Improvements**: Enhanced interface design and user experience
- **Command Coverage**: Adding support for additional camera commands
- **Documentation**: Improving guides and API documentation
- **Testing**: Unit tests and integration tests

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)


----

## Credits and references

1. https://github.com/kairoaraujo/kodak-smart-home
2. API references: https://github.com/kairoaraujo/kodak-smart-home/issues/16
