# JustlyAI Android App

A comprehensive legal assistance Android application for Indian citizens, providing free legal guidance, self-help solutions, and emergency support.

## 🚀 Quick Start

### Prerequisites
- Android Studio (latest version)
- Java Development Kit (JDK) 8 or higher
- Android SDK (API level 24+)
- Python 3.7+ (for backend)

### Setup Instructions

1. **Clone/Download the Project**
   ```bash
   git clone <repository-url>
   cd justlyai/JustlyAI-Android
   ```

2. **Open in Android Studio**
   - Launch Android Studio
   - File → Open → Select `JustlyAI-Android` folder
   - Wait for Gradle sync to complete

3. **Start the Backend Server**
   ```bash
   # Option 1: Use the launcher script
   ./start_backend.bat  # Windows
   ./start_backend.sh   # Mac/Linux
   
   # Option 2: Manual start
   cd ../mini-chatbot
   pip install -r requirements.txt
   python app.py
   ```

4. **Test API Connection**
   ```bash
   python test_api_connection.py
   ```

5. **Run the Android App**
   - Click the green "Run" button in Android Studio
   - Select your device/emulator
   - The app will install and launch

## 📱 App Features

### Core Features
- **Legal Chat Assistant**: AI-powered legal guidance
- **Voice Assistant**: Voice-based legal queries
- **Legal Topics**: Browse different legal categories
- **Emergency Contacts**: Quick access to help numbers
- **Multi-language Support**: English, Hindi, Telugu
- **Self-Help Solutions**: Step-by-step legal guidance

### Legal Categories
- **Police Cases**: Arrest, bail, investigation procedures
- **Property Disputes**: Land, rental, ownership issues
- **Family Law**: Marriage, divorce, custody matters
- **Traffic Violations**: Driving offenses, accidents
- **Consumer Rights**: Product defects, service issues
- **Labor Laws**: Employment, wages, workplace issues

## 🏗️ Project Structure

```
JustlyAI-Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/justlyai/android/
│   │   │   ├── api/           # API communication
│   │   │   ├── model/         # Data models
│   │   │   ├── repository/    # Data management
│   │   │   ├── ui/           # Activities and fragments
│   │   │   ├── viewmodel/    # ViewModels
│   │   │   └── MainActivity.kt
│   │   ├── res/
│   │   │   ├── layout/       # UI layouts
│   │   │   ├── values/       # Strings, colors, themes
│   │   │   └── drawable/     # Images and icons
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
├── ANDROID_SETUP_GUIDE.md
├── start_backend.bat
├── start_backend.sh
├── test_api_connection.py
└── README.md
```

## 🔧 Configuration

### API Endpoints
The app communicates with the Flask backend via these endpoints:

- **Base URL**: `http://10.0.2.2:5000/` (emulator) or `http://YOUR_IP:5000/` (device)
- **Chat**: `POST /api/chat`
- **Voice**: `POST /api/voice`
- **Legal Topics**: `GET /api/legal-topics`
- **Emergency Contacts**: `GET /api/emergency-contacts`
- **Case Sections**: `GET /api/case-sections`

### For Physical Device Testing
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update `JustlyAIApi.kt`:
   ```kotlin
   private const val BASE_URL = "http://YOUR_COMPUTER_IP:5000/"
   ```

## 🎨 UI Components

### Activities
- **MainActivity**: Home screen with navigation
- **ChatActivity**: Text-based legal chat
- **VoiceActivity**: Voice assistant interface
- **LegalTopicsActivity**: Browse legal categories
- **EmergencyContactsActivity**: Emergency numbers

### Features
- **Material Design**: Modern, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Dark/Light Theme**: User preference support
- **Accessibility**: Screen reader support
- **Offline Support**: Basic functionality without internet

## 🛠️ Development

### Architecture
- **MVVM Pattern**: Model-View-ViewModel architecture
- **Repository Pattern**: Data abstraction layer
- **Coroutines**: Asynchronous operations
- **Room Database**: Local data storage
- **Retrofit**: API communication

### Key Dependencies
```gradle
// API Communication
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'

// Coroutines
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'

// Room Database
implementation 'androidx.room:room-runtime:2.6.1'
implementation 'androidx.room:room-ktx:2.6.1'

// Speech Recognition
implementation 'com.google.cloud:google-cloud-speech:4.8.0'

// UI Components
implementation 'com.google.android.material:material:1.11.0'
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
```

### Building the App
```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

## 🧪 Testing

### API Testing
```bash
# Test backend connection
python test_api_connection.py

# Test specific endpoints
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my rights?", "language": "english"}'
```

### Android Testing
- **Unit Tests**: `./gradlew test`
- **Instrumented Tests**: Run in Android Studio
- **UI Tests**: Espresso framework
- **Manual Testing**: Test on real devices

## 🚀 Deployment

### Release Build
1. **Generate Signed APK**:
   - Build → Generate Signed Bundle/APK
   - Choose APK option
   - Create or use existing keystore
   - Select release build variant

2. **Test Release Build**:
   - Install on test devices
   - Verify all features work
   - Check performance

3. **Google Play Store**:
   - Create developer account
   - Upload APK
   - Configure store listing
   - Submit for review

### APK Distribution
- **Internal Testing**: Share APK directly
- **Beta Testing**: Google Play Console
- **Production**: Google Play Store

## 🐛 Troubleshooting

### Common Issues

#### Gradle Sync Failed
```bash
# Clean and rebuild
./gradlew clean
./gradlew build
```

#### API Connection Error
- Check if Flask backend is running
- Verify IP address configuration
- Check firewall settings
- Ensure device/emulator is on same network

#### Voice Features Not Working
- Check microphone permissions
- Verify Google Play Services
- Test on physical device (emulator may have issues)

#### App Crashes
- Check logcat for error details
- Verify all dependencies are installed
- Clean and rebuild project

### Debug Mode
Enable debug logging in `JustlyAIApi.kt`:
```kotlin
.addInterceptor(HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
})
```

## 📊 Performance

### Optimization Tips
- Use coroutines for async operations
- Implement proper error handling
- Cache responses when appropriate
- Optimize image loading
- Use Room for local data storage

### Memory Management
- Dispose of resources properly
- Use weak references where needed
- Monitor memory usage in Android Studio

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Follow Kotlin coding conventions
- Use meaningful variable names
- Add comments for complex logic
- Write unit tests for new features

## 📞 Support

### Getting Help
- Check the setup guide: `ANDROID_SETUP_GUIDE.md`
- Review Android Studio documentation
- Check logcat for error details
- Test API endpoints manually

### Useful Commands
```bash
# Backend
cd ../mini-chatbot
python app.py

# Android
./gradlew clean
./gradlew build
./gradlew installDebug

# Testing
python test_api_connection.py
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Flask backend team
- Android development community
- Legal experts for content validation
- Open source contributors

---

**Built with ❤️ for Indian citizens seeking legal assistance**

For more information, visit the main project repository or contact the development team. 