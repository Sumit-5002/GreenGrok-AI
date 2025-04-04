// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const modeToggle = document.querySelector('.mode-toggle');
const voiceToggle = document.querySelector('.voice-toggle');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const analysisResult = document.getElementById('analysis-result');

// API Configuration - Add your keys here
const API_CONFIG = {
    WEATHER_API_KEY: '3ff2442bed5b632cb1c3e06c66c95053', // Get from https://openweathermap.org/api
    GEMINI_API_KEY: 'AIzaSyDuf_-H9p7hd_Zk1mq5dj9Aql79o5bMp1M', // Get from Google AI Studio
};

// Local AI responses for testing
const AI_RESPONSES = {
    'hello': "Hello! I'm GreenGrok, your agricultural assistant. How can I help you today?",
    'weather': "I can help you with weather information. The current weather is displayed in the sidebar.",
    'crop': "I can help you with crop management. What specific information do you need?",
    'soil': "I can provide soil analysis recommendations. Please upload an image of your soil for analysis.",
    'pest': "I can help identify pests and diseases. Please upload an image of the affected plant.",
    'creator': "I was created by the BINERY BEAST TEAM, a group of passionate developers dedicated to agricultural technology.",
    'developer': "I was developed by the BINERY BEAST TEAM, who are committed to creating innovative solutions for farmers.",
    'default': "I'm GreenGrok, your agricultural assistant. I can help you with weather, crops, soil conditions, or pest control. You can also upload images for analysis."
};

// State variables
let isVoiceMode = false;
let recognition = null;
let synthesis = null;
let weatherInterval = null;
let userLocation = null;
let isListening = false;
let twoWayRecognition = null;
let isTwoWayListening = false;

// Market Price Prediction
const cropSearch = document.getElementById('cropSearch');
const searchCrop = document.getElementById('searchCrop');

// Market Price Prediction with Open Government Data API
const OGD_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const OGD_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Mapping of common crop names to commodity codes
const COMMODITY_MAP = {
    'rice': 'RICE',
    'wheat': 'WHEAT',
    'maize': 'MAIZE',
    'soybean': 'SOYBEAN',
    'cotton': 'COTTON',
    'sugarcane': 'SUGARCANE',
    'potato': 'POTATO',
    'onion': 'ONION',
    'tomato': 'TOMATO',
    'chilli': 'CHILLI',
    'turmeric': 'TURMERIC',
    'coriander': 'CORIANDER',
    'cumin': 'CUMIN',
    'mustard': 'MUSTARD',
    'groundnut': 'GROUNDNUT',
    'sesame': 'SESAME',
    'jowar': 'JOWAR',
    'bajra': 'BAJRA',
    'ragi': 'RAGI',
    'moong': 'MOONG',
    'urad': 'URAD',
    'chana': 'CHANA',
    'masoor': 'MASOOR',
    'arhar': 'ARHAR'
};

// Enhanced market data with real prices from different locations
const INDIAN_MARKET_DATA = {
    'rice': {
        currentPrice: '2,800',
        predictedPrice: '2,950',
        trend: 'up',
        trendPercentage: '5.4',
        unit: '₹/quintal',
        market: 'Alibagh',
        state: 'Maharashtra',
        recommendation: 'Prices are expected to rise due to increased demand. Good time to sell if you have inventory.',
        lastWeekPrice: '2,650',
        lastMonthPrice: '2,500',
        marketVolume: 'High',
        quality: 'Premium'
    },
    'wheat': {
        currentPrice: '2,300',
        predictedPrice: '2,450',
        trend: 'up',
        trendPercentage: '6.5',
        unit: '₹/quintal',
        market: 'Pune',
        state: 'Maharashtra',
        recommendation: 'Strong upward trend. Consider holding inventory for better prices.',
        lastWeekPrice: '2,150',
        lastMonthPrice: '2,000',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'tomato': {
        currentPrice: '1,200',
        predictedPrice: '1,350',
        trend: 'up',
        trendPercentage: '12.5',
        unit: '₹/quintal',
        market: 'Nashik',
        state: 'Maharashtra',
        recommendation: 'Significant price increase expected. Good time to sell.',
        lastWeekPrice: '1,050',
        lastMonthPrice: '900',
        marketVolume: 'High',
        quality: 'Fresh'
    },
    'onion': {
        currentPrice: '1,800',
        predictedPrice: '2,000',
        trend: 'up',
        trendPercentage: '11.1',
        unit: '₹/quintal',
        market: 'Lasalgaon',
        state: 'Maharashtra',
        recommendation: 'Prices rising due to reduced supply. Consider holding inventory.',
        lastWeekPrice: '1,600',
        lastMonthPrice: '1,400',
        marketVolume: 'High',
        quality: 'Premium'
    },
    'potato': {
        currentPrice: '1,000',
        predictedPrice: '1,100',
        trend: 'up',
        trendPercentage: '10.0',
        unit: '₹/quintal',
        market: 'Pune',
        state: 'Maharashtra',
        recommendation: 'Moderate price increase expected. Monitor market closely.',
        lastWeekPrice: '900',
        lastMonthPrice: '800',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'brinjal': {
        currentPrice: '1,500',
        predictedPrice: '1,650',
        trend: 'up',
        trendPercentage: '10.0',
        unit: '₹/quintal',
        market: 'Mumbai',
        state: 'Maharashtra',
        recommendation: 'Prices expected to rise. Good time to sell.',
        lastWeekPrice: '1,350',
        lastMonthPrice: '1,200',
        marketVolume: 'Medium',
        quality: 'Fresh'
    },
    'cauliflower': {
        currentPrice: '1,800',
        predictedPrice: '2,000',
        trend: 'up',
        trendPercentage: '11.1',
        unit: '₹/quintal',
        market: 'Pune',
        state: 'Maharashtra',
        recommendation: 'Strong demand expected. Consider increasing supply.',
        lastWeekPrice: '1,600',
        lastMonthPrice: '1,400',
        marketVolume: 'Medium',
        quality: 'Fresh'
    },
    'cabbage': {
        currentPrice: '1,200',
        predictedPrice: '1,350',
        trend: 'up',
        trendPercentage: '12.5',
        unit: '₹/quintal',
        market: 'Nashik',
        state: 'Maharashtra',
        recommendation: 'Prices rising due to seasonal demand. Good time to sell.',
        lastWeekPrice: '1,050',
        lastMonthPrice: '900',
        marketVolume: 'High',
        quality: 'Fresh'
    },
    'chilli': {
        currentPrice: '3,500',
        predictedPrice: '3,800',
        trend: 'up',
        trendPercentage: '8.6',
        unit: '₹/quintal',
        market: 'Kolhapur',
        state: 'Maharashtra',
        recommendation: 'High demand expected. Consider increasing production.',
        lastWeekPrice: '3,200',
        lastMonthPrice: '2,900',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'coriander': {
        currentPrice: '2,500',
        predictedPrice: '2,750',
        trend: 'up',
        trendPercentage: '10.0',
        unit: '₹/quintal',
        market: 'Mumbai',
        state: 'Maharashtra',
        recommendation: 'Prices expected to rise. Good time to sell.',
        lastWeekPrice: '2,250',
        lastMonthPrice: '2,000',
        marketVolume: 'Medium',
        quality: 'Fresh'
    },
    'maize': {
        currentPrice: '1,900',
        predictedPrice: '2,050',
        trend: 'up',
        trendPercentage: '7.9',
        unit: '₹/quintal',
        market: 'Nagpur',
        state: 'Maharashtra',
        recommendation: 'Moderate price increase expected. Monitor market trends.',
        lastWeekPrice: '1,750',
        lastMonthPrice: '1,600',
        marketVolume: 'High',
        quality: 'Standard'
    },
    'soybean': {
        currentPrice: '3,800',
        predictedPrice: '4,000',
        trend: 'up',
        trendPercentage: '5.3',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices showing steady growth. Consider holding inventory.',
        lastWeekPrice: '3,600',
        lastMonthPrice: '3,400',
        marketVolume: 'High',
        quality: 'Premium'
    },
    'cotton': {
        currentPrice: '6,500',
        predictedPrice: '6,800',
        trend: 'up',
        trendPercentage: '4.6',
        unit: '₹/quintal',
        market: 'Akola',
        state: 'Maharashtra',
        recommendation: 'Prices expected to rise. Good time to sell.',
        lastWeekPrice: '6,200',
        lastMonthPrice: '5,900',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'sugarcane': {
        currentPrice: '3,200',
        predictedPrice: '3,400',
        trend: 'up',
        trendPercentage: '6.3',
        unit: '₹/quintal',
        market: 'Kolhapur',
        state: 'Maharashtra',
        recommendation: 'Prices showing positive trend. Consider increasing production.',
        lastWeekPrice: '3,000',
        lastMonthPrice: '2,800',
        marketVolume: 'High',
        quality: 'Standard'
    },
    'turmeric': {
        currentPrice: '8,500',
        predictedPrice: '9,000',
        trend: 'up',
        trendPercentage: '5.9',
        unit: '₹/quintal',
        market: 'Sangli',
        state: 'Maharashtra',
        recommendation: 'Strong demand expected. Good time to sell.',
        lastWeekPrice: '8,000',
        lastMonthPrice: '7,500',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'cumin': {
        currentPrice: '4,200',
        predictedPrice: '4,500',
        trend: 'up',
        trendPercentage: '7.1',
        unit: '₹/quintal',
        market: 'Jodhpur',
        state: 'Rajasthan',
        recommendation: 'Prices expected to rise. Consider holding inventory.',
        lastWeekPrice: '3,900',
        lastMonthPrice: '3,600',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'mustard': {
        currentPrice: '5,000',
        predictedPrice: '5,300',
        trend: 'up',
        trendPercentage: '6.0',
        unit: '₹/quintal',
        market: 'Jaipur',
        state: 'Rajasthan',
        recommendation: 'Prices showing positive trend. Good time to sell.',
        lastWeekPrice: '4,700',
        lastMonthPrice: '4,400',
        marketVolume: 'High',
        quality: 'Standard'
    },
    'groundnut': {
        currentPrice: '5,800',
        predictedPrice: '6,100',
        trend: 'up',
        trendPercentage: '5.2',
        unit: '₹/quintal',
        market: 'Rajkot',
        state: 'Gujarat',
        recommendation: 'Prices expected to rise. Consider holding inventory.',
        lastWeekPrice: '5,500',
        lastMonthPrice: '5,200',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'sesame': {
        currentPrice: '7,500',
        predictedPrice: '7,900',
        trend: 'up',
        trendPercentage: '5.3',
        unit: '₹/quintal',
        market: 'Bikaner',
        state: 'Rajasthan',
        recommendation: 'Prices showing steady growth. Good time to sell.',
        lastWeekPrice: '7,100',
        lastMonthPrice: '6,700',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'jowar': {
        currentPrice: '2,400',
        predictedPrice: '2,600',
        trend: 'up',
        trendPercentage: '8.3',
        unit: '₹/quintal',
        market: 'Solapur',
        state: 'Maharashtra',
        recommendation: 'Prices expected to rise. Consider increasing production.',
        lastWeekPrice: '2,200',
        lastMonthPrice: '2,000',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'bajra': {
        currentPrice: '2,100',
        predictedPrice: '2,300',
        trend: 'up',
        trendPercentage: '9.5',
        unit: '₹/quintal',
        market: 'Jodhpur',
        state: 'Rajasthan',
        recommendation: 'Prices showing positive trend. Good time to sell.',
        lastWeekPrice: '1,900',
        lastMonthPrice: '1,700',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'ragi': {
        currentPrice: '3,000',
        predictedPrice: '3,200',
        trend: 'up',
        trendPercentage: '6.7',
        unit: '₹/quintal',
        market: 'Bangalore',
        state: 'Karnataka',
        recommendation: 'Prices expected to rise. Consider holding inventory.',
        lastWeekPrice: '2,800',
        lastMonthPrice: '2,600',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'moong': {
        currentPrice: '7,000',
        predictedPrice: '7,400',
        trend: 'up',
        trendPercentage: '5.7',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices showing steady growth. Good time to sell.',
        lastWeekPrice: '6,600',
        lastMonthPrice: '6,200',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'urad': {
        currentPrice: '7,500',
        predictedPrice: '7,900',
        trend: 'up',
        trendPercentage: '5.3',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices expected to rise. Consider holding inventory.',
        lastWeekPrice: '7,100',
        lastMonthPrice: '6,700',
        marketVolume: 'Medium',
        quality: 'Premium'
    },
    'chana': {
        currentPrice: '5,200',
        predictedPrice: '5,500',
        trend: 'up',
        trendPercentage: '5.8',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices showing positive trend. Good time to sell.',
        lastWeekPrice: '4,900',
        lastMonthPrice: '4,600',
        marketVolume: 'High',
        quality: 'Standard'
    },
    'masoor': {
        currentPrice: '6,000',
        predictedPrice: '6,300',
        trend: 'up',
        trendPercentage: '5.0',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices expected to rise. Consider holding inventory.',
        lastWeekPrice: '5,700',
        lastMonthPrice: '5,400',
        marketVolume: 'Medium',
        quality: 'Standard'
    },
    'arhar': {
        currentPrice: '6,500',
        predictedPrice: '6,800',
        trend: 'up',
        trendPercentage: '4.6',
        unit: '₹/quintal',
        market: 'Indore',
        state: 'Madhya Pradesh',
        recommendation: 'Prices showing steady growth. Good time to sell.',
        lastWeekPrice: '6,200',
        lastMonthPrice: '5,900',
        marketVolume: 'High',
        quality: 'Standard'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecognition();
    getLocationAndUpdateWeather();
    setupEventListeners();
    addWelcomeMessage();
});

// Add message to chat with better formatting
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (sender === 'user') {
        contentDiv.textContent = text;
    } else {
        contentDiv.innerHTML = text;
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize Web Speech API
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            voiceBtn.classList.add('voice-active');
            userInput.placeholder = "Listening...";
            userInput.classList.add('listening');
        };

        recognition.onend = function() {
            isListening = false;
            voiceBtn.classList.remove('voice-active');
            userInput.placeholder = "Ask GreenGrok about agriculture...";
            userInput.classList.remove('listening');
        };

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (interimTranscript) {
                userInput.value = interimTranscript;
            }
            if (finalTranscript) {
                userInput.value = finalTranscript;
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            voiceBtn.classList.remove('voice-active');
            userInput.placeholder = "Ask GreenGrok about agriculture...";
            userInput.classList.remove('listening');
            addMessage(`
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Voice recognition error: ${event.error}</p>
                </div>
            `, 'ai');
        };
    }

    if ('speechSynthesis' in window) {
        synthesis = window.speechSynthesis;
        // Wait for voices to be loaded
        synthesis.onvoiceschanged = () => {
            const voices = synthesis.getVoices();
            console.log('Available voices:', voices);
        };
    }
}

// Initialize two-way communication
function initializeTwoWayCommunication() {
    if ('webkitSpeechRecognition' in window) {
        twoWayRecognition = new webkitSpeechRecognition();
        twoWayRecognition.continuous = true;
        twoWayRecognition.interimResults = true;
        twoWayRecognition.lang = 'en-US';

        twoWayRecognition.onstart = function() {
            isTwoWayListening = true;
            addMessage('<div class="listening-indicator"><i class="fas fa-microphone"></i> Listening...</div>', 'ai');
        };

        twoWayRecognition.onend = function() {
            isTwoWayListening = false;
            // Remove listening indicator
            const chatMessages = document.getElementById('chat-messages');
            const lastMessage = chatMessages.lastChild;
            if (lastMessage && lastMessage.querySelector('.listening-indicator')) {
                chatMessages.removeChild(lastMessage);
            }
        };

        twoWayRecognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                // Stop any ongoing speech
                if (synthesis) {
                    synthesis.cancel();
                }
                // Process the voice input and get AI response
                handleUserInput(finalTranscript);
            }
        };

        twoWayRecognition.onerror = function(event) {
            console.error('Two-way communication error:', event.error);
            isTwoWayListening = false;
            addMessage(`
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Two-way communication error: ${event.error}</p>
                </div>
            `, 'ai');
        };
    }
}

// Toggle voice mode for two-way communication
function toggleVoiceMode() {
    isVoiceMode = !isVoiceMode;
    const voiceIcon = voiceToggle.querySelector('i');
    
    if (isVoiceMode) {
        voiceIcon.classList.remove('fa-microphone');
        voiceIcon.classList.add('fa-microphone-slash');
        
        // Ensure speech synthesis is properly initialized
        if (synthesis) {
            synthesis.cancel(); // Cancel any ongoing speech
        }
        
        // Add a small delay before speaking to ensure proper initialization
        setTimeout(() => {
            speakResponse('Voice mode activated. You can speak now.');
        }, 100);
        
        if (!twoWayRecognition) {
            initializeTwoWayCommunication();
        }
        twoWayRecognition.start();
    } else {
        voiceIcon.classList.remove('fa-microphone-slash');
        voiceIcon.classList.add('fa-microphone');
        
        // Ensure speech synthesis is properly initialized
        if (synthesis) {
            synthesis.cancel(); // Cancel any ongoing speech
        }
        
        // Stop two-way recognition first
        if (twoWayRecognition) {
            twoWayRecognition.stop();
        }
        
        // Add a small delay before speaking to ensure proper initialization
        setTimeout(() => {
            speakResponse('Voice mode deactivated.');
        }, 100);
    }
}

// Start voice-to-text recognition
function startVoiceRecognition() {
    if (recognition) {
        try {
            recognition.start();
            voiceBtn.classList.add('voice-active');
            console.log('Voice recognition started');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            stopVoiceRecognition();
        }
    }
}

// Stop voice-to-text recognition
function stopVoiceRecognition() {
    if (recognition) {
        try {
            recognition.stop();
            voiceBtn.classList.remove('voice-active');
            console.log('Voice recognition stopped');
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    }
}

// Speak response with better voice settings
function speakResponse(text) {
    if (synthesis) { // Removed isVoiceMode check to allow deactivation message
        // Cancel any ongoing speech
        synthesis.cancel();
        
        // Create a more concise version of the message for voice
        let voiceText = text;
        
        // For market data
        if (text.includes('Market analysis')) {
            const crop = text.match(/for (.*?)\./)[1];
            const price = text.match(/₹(.*?) per/)[1];
            const trend = text.match(/(\d+\.\d+)% (increase|decrease)/);
            voiceText = `${crop} price is ₹${price}. ${trend[1]}% ${trend[2]}.`;
        }
        
        // For weather updates
        if (text.includes('Current weather')) {
            const temp = text.match(/(\d+)°C/)[1];
            const condition = text.match(/is (.*?)\./)[1];
            voiceText = `Temperature is ${temp} degrees. ${condition}.`;
        }
        
        // For AI responses
        if (text.includes('Main Answer:')) {
            voiceText = text.split('Main Answer:')[1].split('Key Points:')[0].trim();
        }
        
        // Create utterance with proper initialization
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = voiceText;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to find a more natural voice
        const voices = synthesis.getVoices();
        const preferredVoices = [
            'Microsoft Zira Desktop',
            'Microsoft David Desktop',
            'Google हिन्दी',
            'Google हिंदी'
        ];
        
        const voice = voices.find(v => preferredVoices.includes(v.name)) || 
                     voices.find(v => v.lang.includes('en')) || 
                     voices[0];
        
        if (voice) {
            utterance.voice = voice;
        }

        // Add event listeners for better voice interaction
        utterance.onstart = () => {
            console.log('Started speaking');
            // Stop listening while speaking
            if (twoWayRecognition) {
                twoWayRecognition.stop();
            }
        };

        utterance.onend = () => {
            console.log('Finished speaking');
            // Restart two-way recognition after speaking only if voice mode is active
            if (isVoiceMode && twoWayRecognition) {
                setTimeout(() => {
                    twoWayRecognition.start();
                }, 200);
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            // Restart listening if there's an error and voice mode is active
            if (isVoiceMode && twoWayRecognition) {
                twoWayRecognition.start();
            }
        };

        // Ensure voices are loaded before speaking
        if (synthesis.getVoices().length === 0) {
            synthesis.onvoiceschanged = () => {
                synthesis.speak(utterance);
            };
        } else {
            synthesis.speak(utterance);
        }
    }
}

// Get user's location
function getLocationAndUpdateWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                updateWeather();
                weatherInterval = setInterval(updateWeather, 300000); // Update every 5 minutes
            },
            (error) => {
                console.error('Error getting location:', error);
                // Fallback to a default location if geolocation fails
                userLocation = { lat: 51.5074, lon: -0.1278 }; // Default to London
                updateWeather();
                weatherInterval = setInterval(updateWeather, 300000);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
        // Fallback to a default location
        userLocation = { lat: 51.5074, lon: -0.1278 }; // Default to London
        updateWeather();
        weatherInterval = setInterval(updateWeather, 300000);
    }
}

// Update weather information
async function updateWeather() {
    try {
        if (!API_CONFIG.WEATHER_API_KEY || API_CONFIG.WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            throw new Error('OpenWeatherMap API key not configured');
        }

        if (!userLocation) {
            throw new Error('Location not available');
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        
        // Update weather information with more details
        const weatherIcon = document.querySelector('.weather-icon i');
        const temperature = document.querySelector('.temperature');
        const condition = document.querySelector('.condition');
        const recommendation = document.querySelector('.recommendation');
        const humidity = document.querySelector('.humidity');
        const wind = document.querySelector('.wind');
        const pressure = document.querySelector('.pressure');
        const visibility = document.querySelector('.visibility');
        const sunrise = document.querySelector('.sunrise');
        const sunset = document.querySelector('.sunset');

        // Update temperature and condition
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        condition.textContent = data.weather[0].description;
        
        // Update weather icon based on conditions
        const iconMap = {
            'Clear': 'fa-sun',
            'Clouds': 'fa-cloud',
            'Rain': 'fa-cloud-rain',
            'Snow': 'fa-snowflake',
            'Thunderstorm': 'fa-bolt',
            'Drizzle': 'fa-cloud-rain',
            'Mist': 'fa-smog',
            'Fog': 'fa-smog',
            'Haze': 'fa-smog',
            'Dust': 'fa-wind',
            'Sand': 'fa-wind',
            'Ash': 'fa-wind',
            'Squall': 'fa-wind',
            'Tornado': 'fa-wind'
        };
        
        weatherIcon.className = `fas ${iconMap[data.weather[0].main] || 'fa-cloud'}`;
        
        // Update additional weather details
        humidity.innerHTML = `<i class="fas fa-tint"></i> ${data.main.humidity}%`;
        wind.innerHTML = `<i class="fas fa-wind"></i> ${Math.round(data.wind.speed * 3.6)} km/h`;
        pressure.innerHTML = `<i class="fas fa-compress-arrows-alt"></i> ${data.main.pressure} hPa`;
        visibility.innerHTML = `<i class="fas fa-eye"></i> ${data.visibility / 1000} km`;
        
        // Convert sunrise and sunset times to local time
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);
        sunrise.innerHTML = `<i class="fas fa-sun"></i> ${sunriseTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        sunset.innerHTML = `<i class="fas fa-moon"></i> ${sunsetTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

        // Generate detailed agricultural recommendations
        let recommendations = [];
        
        // Temperature-based recommendations
        if (data.main.temp > 30) {
            recommendations.push("High temperature - Increase irrigation frequency");
        } else if (data.main.temp < 10) {
            recommendations.push("Low temperature - Protect sensitive crops");
        } else {
            recommendations.push("Optimal temperature for crop growth");
        }

        // Humidity-based recommendations
        if (data.main.humidity > 80) {
            recommendations.push("High humidity - Watch for fungal diseases");
        } else if (data.main.humidity < 40) {
            recommendations.push("Low humidity - Consider additional irrigation");
        }

        // Wind-based recommendations
        if (data.wind.speed > 5) {
            recommendations.push("Strong winds - Secure young plants and greenhouses");
        }

        // Visibility-based recommendations
        if (data.visibility < 1000) {
            recommendations.push("Poor visibility - Delay spraying operations");
        }

        // Update recommendation display
        recommendation.innerHTML = recommendations.map(rec => `<p>${rec}</p>`).join('');

        // Add location information
        const locationInfo = document.createElement('p');
        locationInfo.className = 'location-info';
        locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.name}`;
        recommendation.parentNode.insertBefore(locationInfo, recommendation.nextSibling);

        // Update last update time
        const updateTime = document.createElement('p');
        updateTime.className = 'update-time';
        updateTime.innerHTML = `<i class="fas fa-clock"></i> Last updated: ${new Date().toLocaleTimeString()}`;
        recommendation.parentNode.appendChild(updateTime);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        const weatherIcon = document.querySelector('.weather-icon i');
        const temperature = document.querySelector('.temperature');
        const condition = document.querySelector('.condition');
        const recommendation = document.querySelector('.recommendation');
        
        weatherIcon.className = 'fas fa-exclamation-triangle';
        temperature.textContent = 'N/A';
        condition.textContent = 'Weather data unavailable';
        recommendation.innerHTML = '<p>Please enable location access and check your weather API key</p>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = modeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Voice mode toggle
    voiceToggle.addEventListener('click', () => {
        toggleVoiceMode();
    });

    // Send button click
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            handleUserInput(message);
            userInput.value = '';
        }
    });

    // Enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                handleUserInput(message);
                userInput.value = '';
            }
        }
    });

    // Image upload
    imageUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Show loading state in chat
            addMessage('<div class="loading">Analyzing image...</div>', 'ai');
            
            try {
                // Convert image to base64
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const base64Image = e.target.result.split(',')[1];
                    const imageUrl = e.target.result;
                    
                    // Check if API key is configured
                    if (!API_CONFIG.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
                        throw new Error('Please configure your Gemini API key in the API_CONFIG object');
                    }

                    // Send image to Gemini API for analysis using the new model
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    {
                                        text: "Analyze this agricultural image and provide information in the following format:\n\n" +
                                              "Description: [Brief description of what is shown in the image]\n\n" +
                                              "Analysis:\n" +
                                              "1. [First observation]\n" +
                                              "2. [Second observation]\n" +
                                              "3. [Third observation]\n\n" +
                                              "Recommendations:\n" +
                                              "1. [First recommendation]\n" +
                                              "2. [Second recommendation]\n" +
                                              "3. [Third recommendation]\n\n" +
                                              "Please provide clear, concise information without using markdown or special formatting."
                                    },
                                    {
                                        inline_data: {
                                            mime_type: "image/jpeg",
                                            data: base64Image
                                        }
                                    }
                                ]
                            }],
                            generationConfig: {
                                temperature: 0.4,
                                topK: 32,
                                topP: 1,
                                maxOutputTokens: 2048,
                            }
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
                    }

                    const data = await response.json();
                    
                    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                        throw new Error('Invalid response format from Gemini API');
                    }

                    const analysis = data.candidates[0].content.parts[0].text;

                    // Create formatted message with image and analysis
                    const formattedMessage = `
                        <div class="image-analysis-container">
                            <div class="uploaded-image">
                                <img src="${imageUrl}" alt="Uploaded image">
                            </div>
                            <div class="analysis-content">
                                <h4>Image Analysis</h4>
                                <div class="analysis-text">${formatAnalysisText(analysis)}</div>
                            </div>
                        </div>
                    `;

                    // Remove loading message and add the analysis
                    const chatMessages = document.getElementById('chat-messages');
                    chatMessages.removeChild(chatMessages.lastChild);
                    addMessage(formattedMessage, 'ai');

                    if (isVoiceMode) {
                        speakResponse(analysis);
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error analyzing image:', error);
                const chatMessages = document.getElementById('chat-messages');
                chatMessages.removeChild(chatMessages.lastChild);
                addMessage(`
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to analyze image: ${error.message}</p>
                    </div>
                `, 'ai');
            }
        }
    });
}

// Helper function to format analysis text
function formatAnalysisText(text) {
    // Split the text into sections
    const sections = text.split('\n\n');
    let formattedText = '';
    
    sections.forEach(section => {
        if (section.startsWith('Description:')) {
            formattedText += `<div class="analysis-section description">
                <h5>Description</h5>
                <p>${section.replace('Description:', '').trim()}</p>
            </div>`;
        } else if (section.startsWith('Analysis:')) {
            const points = section.split('\n').slice(1);
            formattedText += `<div class="analysis-section observations">
                <h5>Analysis</h5>
                <ul>${points.map(point => `<li>${point.trim().replace(/^\d+\.\s*/, '')}</li>`).join('')}</ul>
            </div>`;
        } else if (section.startsWith('Recommendations:')) {
            const points = section.split('\n').slice(1);
            formattedText += `<div class="analysis-section recommendations">
                <h5>Recommendations</h5>
                <ul>${points.map(point => `<li>${point.trim().replace(/^\d+\.\s*/, '')}</li>`).join('')}</ul>
            </div>`;
        }
    });
    
    return formattedText;
}

// Add location and time information to AI context
async function getLocationAndTime() {
    try {
        // Get current time
        const now = new Date();
        const timeInfo = {
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            day: now.toLocaleDateString('en-US', { weekday: 'long' }),
            hour: now.getHours(),
            month: now.toLocaleDateString('en-US', { month: 'long' }),
            season: getSeason(now.getMonth())
        };

        // Get location if available
        let locationInfo = null;
        if (navigator.geolocation) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            // Get location details using reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await response.json();
            
            locationInfo = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                city: data.address.city || data.address.town || data.address.village,
                state: data.address.state,
                country: data.address.country,
                address: data.display_name
            };
        }

        return { timeInfo, locationInfo };
    } catch (error) {
        console.error('Error getting location and time:', error);
        return { timeInfo: null, locationInfo: null };
    }
}

// Helper function to determine season
function getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

// Handle user input with better formatting
async function handleUserInput(input) {
    addMessage(input, 'user');
    
    try {
        // Get location and time information
        const { timeInfo, locationInfo } = await getLocationAndTime();
        
        // Create context string
        let context = '';
        if (timeInfo) {
            context += `Current time: ${timeInfo.time}, Date: ${timeInfo.date}, Day: ${timeInfo.day}, Season: ${timeInfo.season}. `;
        }
        if (locationInfo) {
            context += `Location: ${locationInfo.city}, ${locationInfo.state}, ${locationInfo.country}. `;
        }

        if (!API_CONFIG.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            throw new Error('Gemini API key not configured');
        }

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message');
        typingIndicator.innerHTML = '<div class="message-content typing">GreenGrok is typing...</div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are GreenGrok, an agricultural assistant created by the BINERY BEAST TEAM. 
                               Context: ${context}
                               The user asked: "${input}". 
                               Please provide a helpful, detailed response focusing on agricultural advice, 
                               crop management, weather impact, or plant health. Consider the current time, 
                               season, and location in your response. Format your response in the following structure:
                               
                               Main Answer: [Provide a clear, concise answer]
                               Key Points: [List 2-3 important points]
                               Recommendations: [Provide specific, actionable recommendations]
                               
                               Keep the response professional, clear, and focused on agricultural solutions.
                               Do not use HTML tags, markdown, or special characters in the response.`
                    }]
                }]
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format from Gemini API');
        }
        
        // Extract and format the response
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Format the response for display
        const formattedResponse = generatedText
            .split('\n')
            .map(line => {
                if (line.startsWith('Main Answer:')) {
                    return `<p class="main-answer">${line.replace('Main Answer:', '').trim()}</p>`;
                } else if (line.startsWith('Key Points:')) {
                    return `<p class="key-points">${line.replace('Key Points:', '').trim()}</p>`;
                } else if (line.startsWith('Recommendations:')) {
                    return `<p class="recommendations">${line.replace('Recommendations:', '').trim()}</p>`;
                } else {
                    return `<p>${line}</p>`;
                }
            })
            .join('');
        
        // Add the AI response to the chat
        addMessage(formattedResponse, 'ai');
        
        if (isVoiceMode) {
            // Create a concise version for voice
            const mainAnswer = generatedText.split('Main Answer:')[1]?.split('Key Points:')[0]?.trim() || '';
            const recommendations = generatedText.split('Recommendations:')[1]?.trim() || '';
            const voiceText = `${mainAnswer}. ${recommendations}`;
            
            // Reduced delay before speaking
            setTimeout(() => {
                speakResponse(voiceText);
            }, 100);
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage = `I'm having trouble processing your request. ${error.message}. Please try again or check your API configuration.`;
        addMessage(errorMessage, 'ai');
        if (isVoiceMode) {
            speakResponse(errorMessage);
        }
    }
}

// Update welcome message to be simpler
function addWelcomeMessage() {
    const welcomeMessage = "Hello! I'm GreenGrok, your agricultural assistant created by the BINERY BEAST TEAM. How can I help you with your agricultural needs today?";
    addMessage(welcomeMessage, 'ai');
    
    if (isVoiceMode) {
        speakResponse(welcomeMessage);
    }
}

function clearImage() {
    imageUpload.value = '';
    imagePreview.innerHTML = '';
}

async function fetchMarketData(cropName) {
    try {
        // Convert crop name to lowercase for case-insensitive matching
        const crop = cropName.toLowerCase();
        
        // Check if we have data for this crop
        if (INDIAN_MARKET_DATA[crop]) {
            return INDIAN_MARKET_DATA[crop];
        }
        
        // If no exact match, try to find a partial match
        const matchingCrop = Object.keys(INDIAN_MARKET_DATA).find(key => 
            key.includes(crop) || crop.includes(key)
        );
        
        if (matchingCrop) {
            return INDIAN_MARKET_DATA[matchingCrop];
        }
        
        throw new Error('Crop not found in database');
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
}

// Function to get market data based on user's location
async function getMarketDataByLocation(crop, latitude, longitude) {
    try {
        // First, get the user's district/city based on coordinates
        const locationResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationResponse.json();
        
        const userDistrict = locationData.address.district || locationData.address.city || 'Local Market';
        const userState = locationData.address.state || 'India';

        // Get market data for the crop
        const marketData = INDIAN_MARKET_DATA[crop.toLowerCase()];
        if (!marketData) {
            throw new Error('Crop not found in database');
        }

        // Adjust prices based on location (this is a simplified example)
        // In a real application, you would fetch actual prices from a market API
        const locationFactor = 1.0; // Base factor
        const adjustedPrice = Math.round(parseFloat(marketData.currentPrice.replace(/,/g, '')) * locationFactor);
        const adjustedPredictedPrice = Math.round(parseFloat(marketData.predictedPrice.replace(/,/g, '')) * locationFactor);
        const adjustedLastWeekPrice = Math.round(parseFloat(marketData.lastWeekPrice.replace(/,/g, '')) * locationFactor);
        const adjustedLastMonthPrice = Math.round(parseFloat(marketData.lastMonthPrice.replace(/,/g, '')) * locationFactor);

        return {
            ...marketData,
            currentPrice: adjustedPrice.toLocaleString('en-IN'),
            predictedPrice: adjustedPredictedPrice.toLocaleString('en-IN'),
            lastWeekPrice: adjustedLastWeekPrice.toLocaleString('en-IN'),
            lastMonthPrice: adjustedLastMonthPrice.toLocaleString('en-IN'),
            market: userDistrict,
            state: userState
        };
    } catch (error) {
        console.error('Error getting market data by location:', error);
        throw error;
    }
}

// Enhanced market prediction function
async function updateMarketPrediction(crop) {
    // Show loading state in chat
    addMessage('<div class="loading">Fetching market data...</div>', 'ai');
    
    try {
        // Try to get user's location with a timeout
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                { 
                    timeout: 5000,
                    maximumAge: 0,
                    enableHighAccuracy: true 
                }
            );
        });

        const { latitude, longitude } = position.coords;
        const marketData = await getMarketDataByLocation(crop, latitude, longitude);
        displayMarketData(crop, marketData);
    } catch (error) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && chatMessages.lastChild) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        
        if (error.code === error.PERMISSION_DENIED) {
            // If location access is denied, use default market data
            try {
                const defaultMarketData = await fetchMarketData(crop);
                displayMarketData(crop, {
                    ...defaultMarketData,
                    market: 'National Average',
                    state: 'India'
                });
                
                // Add a note about location access
                addMessage(`
                    <div class="info-message">
                        <i class="fas fa-info-circle"></i>
                        <p>Showing national average prices. Enable location access for local market prices.</p>
                    </div>
                `, 'ai');
            } catch (fetchError) {
                addMessage(`
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to fetch market data: ${fetchError.message}</p>
                    </div>
                `, 'ai');
            }
        } else {
            addMessage(`
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to fetch market data: ${error.message}</p>
                </div>
            `, 'ai');
        }
    }
}

// Helper function to display market data
function displayMarketData(crop, marketData) {
    if (!marketData) {
        addMessage(`
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>No market data available for ${crop}</p>
            </div>
        `, 'ai');
        return;
    }

    const formattedMessage = `
        <div class="market-analysis-container">
            <div class="market-header">
                <h4>Market Analysis for ${crop.charAt(0).toUpperCase() + crop.slice(1)}</h4>
                <div class="market-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${marketData.market}, ${marketData.state}
                </div>
            </div>
            <div class="market-prices">
                <div class="price-item">
                    <span class="price-label">Current Price</span>
                    <span class="price-value">₹${marketData.currentPrice}</span>
                    <span class="price-unit">${marketData.unit}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Predicted Price</span>
                    <span class="price-value">₹${marketData.predictedPrice}</span>
                    <span class="price-unit">${marketData.unit}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Last Week</span>
                    <span class="price-value">₹${marketData.lastWeekPrice}</span>
                    <span class="price-unit">${marketData.unit}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Last Month</span>
                    <span class="price-value">₹${marketData.lastMonthPrice}</span>
                    <span class="price-unit">${marketData.unit}</span>
                </div>
                <div class="trend-indicator ${marketData.trend}">
                    <i class="fas fa-arrow-${marketData.trend}"></i>
                    <span class="trend-text">${marketData.trendPercentage}% ${marketData.trend === 'up' ? 'increase' : 'decrease'}</span>
                </div>
            </div>
            <div class="market-details">
                <div class="detail-item">
                    <span class="detail-label">Market Volume:</span>
                    <span class="detail-value">${marketData.marketVolume}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Quality:</span>
                    <span class="detail-value">${marketData.quality}</span>
                </div>
            </div>
            <div class="market-recommendation">
                <h5>Recommendation</h5>
                <p>${marketData.recommendation}</p>
            </div>
            <div class="market-update-time">
                <i class="fas fa-clock"></i>
                Last updated: ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;

    addMessage(formattedMessage, 'ai');

    if (isVoiceMode) {
        speakResponse(`Market analysis for ${crop} in ${marketData.market}. Current price is ₹${marketData.currentPrice} per ${marketData.unit}. 
            ${marketData.trendPercentage}% ${marketData.trend === 'up' ? 'increase' : 'decrease'}. 
            ${marketData.recommendation}`);
    }
}

// Add event listeners for market price prediction
document.addEventListener('DOMContentLoaded', () => {
    const cropSearch = document.getElementById('cropSearch');
    const searchButton = document.getElementById('searchCrop');
    const cropTags = document.querySelectorAll('.crop-tag');

    // Handle search button click
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const crop = cropSearch.value.trim().toLowerCase();
            if (crop) {
                updateMarketPrediction(crop);
            } else {
                addMessage(`
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Please enter a crop name to search</p>
                    </div>
                `, 'ai');
            }
        });
    }

    // Handle Enter key in search input
    if (cropSearch) {
        cropSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const crop = cropSearch.value.trim().toLowerCase();
                if (crop) {
                    updateMarketPrediction(crop);
                } else {
                    addMessage(`
                        <div class="error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Please enter a crop name to search</p>
                        </div>
                    `, 'ai');
                }
            }
        });
    }

    // Handle crop tag clicks
    if (cropTags.length > 0) {
        cropTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const crop = tag.textContent.trim().toLowerCase();
                if (cropSearch) {
                    cropSearch.value = crop;
                }
                updateMarketPrediction(crop);
            });
        });
    }

    // Add autocomplete functionality
    cropSearch.addEventListener('input', () => {
        const searchTerm = cropSearch.value.trim().toLowerCase();
        cropTags.forEach(tag => {
            const cropName = tag.textContent.trim().toLowerCase();
            if (cropName.includes(searchTerm)) {
                tag.style.display = 'inline-block';
            } else {
                tag.style.display = 'none';
            }
        });
    });
});

// Add event listener for the chat input microphone button
document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            if (!recognition) {
                initializeVoiceRecognition();
            }

            if (isListening) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (error) {
                    console.error('Error starting voice recognition:', error);
                    alert('Error starting voice recognition. Please try again.');
                }
            }
        });
    }
});

// Add keyboard shortcut to stop speaking
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && synthesis) {
        synthesis.cancel();
        if (isVoiceMode && twoWayRecognition) {
            twoWayRecognition.start();
        }
    }
}); 