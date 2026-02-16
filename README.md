# GreenGrok - AI-Powered Agricultural Assistant

## Overview
GreenGrok is a web-based agricultural assistant that provides personalized farming advice, weather updates, and market price information to Indian farmers. The system uses Google's Gemini AI model to deliver context-aware responses in multiple Indian languages.

## Features

### 1. Multilingual Support
GreenGrok supports multiple Indian languages with automatic language detection and response:
- **English**, **Hindi**, **Marathi**, **Tamil**, **Telugu**
- The system automatically detects input language and responds in kind.

### 2. Intelligent Chat Interface
- Modern, glassmorphism-inspired UI with dark mode support.
- Context-aware responses with chat history persistence.
- Markdown rendering for clear, formatted advice.
- Voice input and text-to-speech output.

### 3. Weather Information
- Real-time location-based weather updates.
- Agricultural recommendations based on current conditions.
- Detailed metrics: Temperature, humidity, wind, pressure, and visibility.

### 4. Market Price Analysis
- Real-time crop price trends and predictions.
- Interactive charts (via Chart.js) for price visualization.
- Location-specific market data for various Indian crops.

### 5. Image Analysis
- Analyze crop health, pests, and soil conditions via image uploads.
- Powered by Gemini 1.5 Flash for fast and accurate vision analysis.

### 6. Seasonal Tips
- Monthly agricultural tips tailored to the Indian farming cycle.

## 🚀 Getting Started

### 1. Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/greengrok.git
cd greengrok
```

### 2. Configuration
GreenGrok features an in-app **API Settings** panel. No `.env` file is required.

1. Open `index.html` in your browser.
2. Click the **Gear icon (⚙️)** in the header.
3. Enter your API keys:
   - **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - **OpenWeatherMap API Key** (from [OpenWeatherMap](https://openweathermap.org/api))
   - **OGD India API Key** (from [Data.gov.in](https://data.gov.in/))
4. Click **Save Settings**. Your keys are stored securely in your browser's local storage.

### 3. Running the Application
Simply open `index.html` in any modern web browser. For the best experience, use a local server like "Live Server" in VS Code.

## 📱 Usage Guide
- **Chat**: Type or use the microphone to ask agricultural questions.
- **New Chat**: Click the **+** icon to clear history and start fresh.
- **Export**: Click the download icon to save your conversation.
- **Images**: Upload photos of your crops for AI diagnosis.
- **Market**: Search for crops to see price trends and charts.

## 🔒 Security
- All API keys are stored only in your browser's `localStorage`.
- No server-side storage of personal data.

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

---
Made with ❤️ by the BINERY BEAST TEAM
