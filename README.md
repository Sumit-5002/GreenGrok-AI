# GreenGrok - AI-Powered Agricultural Assistant

## Overview
GreenGrok is a web-based agricultural assistant that provides personalized farming advice, weather updates, and market price information to Indian farmers. The system uses Google's Gemini AI model to deliver context-aware responses in multiple Indian languages.

## Features

### 1. Multilingual Support
GreenGrok supports 5 Indian languages with automatic language detection and response:

1. **English** (en)
   - Indian English accent
   - Preferred voices: Google हिन्दी, Microsoft Ravi, Microsoft Heera

2. **Hindi** (hi)
   - Native Hindi support
   - Preferred voices: Google हिन्दी, Microsoft Ravi, Microsoft Heera

3. **Marathi** (mr)
   - Native Marathi support
   - Preferred voices: Google मराठी, Microsoft Gopal

4. **Tamil** (ta)
   - Native Tamil support
   - Preferred voices: Google தமிழ், Microsoft Valluvar

5. **Telugu** (te)
   - Native Telugu support
   - Preferred voices: Google తెలుగు, Microsoft Chitra

The system automatically:
- Detects the input language
- Responds in the same language
- Uses appropriate regional voices for speech output

### 2. Intelligent Chat Interface
- Natural language processing for understanding agricultural queries
- Multilingual support (English, Hindi, Marathi, Tamil, Telugu)
- Context-aware responses with chat history
- Voice input and output capabilities

### 3. Weather Information
- Real-time weather updates
- Location-based weather data
- Agricultural weather recommendations
- Temperature, humidity, wind speed, and precipitation information

### 4. Market Price Analysis
- Real-time crop price information
- Price trends and predictions
- Location-specific market data
- Historical price comparison
- Market recommendations

### 5. Image Analysis
- Plant disease detection
- Soil condition analysis
- Crop health monitoring
- Pest identification
- Growth stage analysis

### 6. Voice Interaction
- Voice-to-text input
- Text-to-speech output
- Multilingual voice support
- Hands-free operation

### 7. Agricultural Knowledge Base
- Crop management advice
- Pest control recommendations
- Soil health information
- Seasonal farming guidance
- Best practices for different crops

## 🛠️ System Requirements

### Hardware Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection
- Microphone (for voice features)
- Speakers (for voice output)
- Minimum 2GB RAM
- 100MB free disk space

### Software Requirements
- Web Browser:
  - Chrome 80+ (recommended)
  - Firefox 75+
  - Edge 80+
  - Safari 13+
- Operating System:
  - Windows 10/11
  - macOS 10.15+
  - Linux (Ubuntu 20.04+)
  - Android 10+
  - iOS 13+

### API Requirements
- OpenWeatherMap API key (for weather data)
- Google Gemini API key (for AI capabilities)
- Open Government Data API key (for market prices)

## 🚀 Getting Started

### 1. Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/greengrok.git
cd greengrok
```

2. Install dependencies:
```bash
npm install
```

### 2. Configuration
1. Create a `.env` file in the root directory
2. Add your API keys:
```
WEATHER_API_KEY=your_openweathermap_api_key
GEMINI_API_KEY=your_gemini_api_key
OGD_API_KEY=your_ogd_api_key
```

### 3. Running the Application
1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## 🔑 API Keys Setup

### 1. OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key from the dashboard
3. Add it to your `.env` file

### 2. Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 3. Open Government Data API
1. Register at [Data.gov.in](https://data.gov.in/)
2. Generate an API key
3. Add it to your `.env` file

## 📱 Usage Guide

### Basic Usage
1. Type your question in the chat input
2. Press Enter or click Send
3. Receive AI-powered response

### Voice Commands
1. Click the microphone icon
2. Speak your query
3. Wait for the response

### Image Analysis
1. Click the upload button
2. Select an image of crops, soil, or plants
3. Receive detailed analysis

### Market Price Check
1. Enter crop name in the search box
2. View current prices and trends
3. Get market recommendations

## 🔒 Security

- All API keys are stored securely
- HTTPS encryption for all communications
- No personal data storage
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email sumitboy2005@gmail.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Google for Gemini AI
- Data.gov.in for market data
- All contributors and users

---

Made with ❤️ by the BINERY BEAST TEAM 