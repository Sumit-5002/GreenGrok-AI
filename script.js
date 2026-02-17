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

// Cache Configuration
const CACHE_CONFIG = {
    location: {
        ttl: 3600000, // 1 hour
        data: null,
        timestamp: null
    },
    weather: {
        ttl: 1800000, // 30 minutes
        data: null,
        timestamp: null
    },
    market: {
        ttl: 3600000, // 1 hour
        data: {},
        timestamp: null
    }
};

// Persistent Cache Helpers
function setCache(key, data, ttl) {
    const cacheData = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl
    };
    localStorage.setItem(`greengrok_cache_${key}`, JSON.stringify(cacheData));
}

function getCache(key) {
    const cached = localStorage.getItem(`greengrok_cache_${key}`);
    if (!cached) return null;

    try {
        const { data, timestamp, ttl } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
            return data;
        }
        localStorage.removeItem(`greengrok_cache_${key}`);
    } catch (e) {
        console.error(`Error parsing cache for ${key}:`, e);
    }
    return null;
}

// API Configuration - Load from localStorage
const API_CONFIG = {
    WEATHER_API_KEY: localStorage.getItem('weather_api_key') || "",
    GEMINI_API_KEY: localStorage.getItem('gemini_api_key') || "",
    OGD_API_KEY: localStorage.getItem('ogd_api_key') || ""
};

// API Timeout Configuration
const API_TIMEOUT = {
    location: 20000,    // 20 seconds for location detection
    weather: 20000,     // 20 seconds for weather data
    market: 20000,      // 20 seconds for market data
    gemini: 20000       // 20 seconds for AI responses
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
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let currentLanguage = 'en'; // Default language

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

// Simplified configuration
const CONFIG = {
    model: 'gemini-1.5-flash',
    voice: 'en-IN',
    name: 'GreenGrok'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecognition();
    getLocationAndUpdateWeather();
    setupEventListeners();
    setupSettingsModal();
    addSeasonalTips();

    if (chatHistory.length > 0) {
        chatHistory.forEach(msg => addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai', false));
    } else {
        addWelcomeMessage();
    }
});

// Add message to chat with better formatting
function addMessage(text, sender, save = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (sender === 'user') {
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
    } else {
        // Use marked for markdown rendering
        const rawHtml = window.marked ? marked.parse(text) : text;
        // Sanitize HTML content to prevent XSS. Fallback to escaped text if DOMPurify is missing.
        const htmlContent = window.DOMPurify ? DOMPurify.sanitize(rawHtml, {
            ADD_TAGS: ['canvas'],
            ADD_ATTR: ['id']
        }) : text.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });

        if (save) {
            // Typing effect for new AI messages
            contentDiv.innerHTML = '';
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);

            // Fade in effect
            contentDiv.style.opacity = '0';
            contentDiv.innerHTML = htmlContent;
            setTimeout(() => {
                contentDiv.style.transition = 'opacity 0.5s ease';
                contentDiv.style.opacity = '1';
            }, 50);
        } else {
            contentDiv.innerHTML = htmlContent;
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
        }
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (save) {
        chatHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content: text });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
}

// Initialize Web Speech API
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = CONFIG.voice;

        recognition.onstart = function() {
            isListening = true;
            if (voiceBtn) {
                voiceBtn.classList.add('voice-active');
                voiceBtn.setAttribute('aria-pressed', 'true');
            }
            userInput.placeholder = "Listening...";
            userInput.classList.add('listening');
        };

        recognition.onend = function() {
            isListening = false;
            if (voiceBtn) {
                voiceBtn.classList.remove('voice-active');
                voiceBtn.setAttribute('aria-pressed', 'false');
            }
            userInput.placeholder = `Ask GreenGrok about agriculture...`;
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
                handleUserInput(finalTranscript);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            if (voiceBtn) voiceBtn.classList.remove('voice-active');
            userInput.placeholder = `Ask GreenGrok about agriculture...`;
            userInput.classList.remove('listening');
        };
    }

    if ('speechSynthesis' in window) {
        synthesis = window.speechSynthesis;
        synthesis.onvoiceschanged = () => {
            const voices = synthesis.getVoices();
            if (voices.length > 0) {
                const defaultVoice = voices.find(v => v.lang.includes('en-IN')) || voices[0];
                CONFIG.voice = defaultVoice.lang;
            }
        };
    }
}

// Initialize two-way communication
function initializeTwoWayCommunication() {
    if ('webkitSpeechRecognition' in window) {
        twoWayRecognition = new webkitSpeechRecognition();
        twoWayRecognition.continuous = true;
        twoWayRecognition.interimResults = true;
        twoWayRecognition.lang = CONFIG.voice;

        twoWayRecognition.onstart = function() {
            isTwoWayListening = true;
            addMessage('<div class="listening-indicator"><i class="fas fa-microphone"></i> Listening...</div>', 'ai');
        };

        twoWayRecognition.onend = function() {
            isTwoWayListening = false;
            const chatMessages = document.getElementById('chat-messages');
            const lastMessage = chatMessages.lastChild;
            if (lastMessage && lastMessage.querySelector('.listening-indicator')) {
                chatMessages.removeChild(lastMessage);
            }
        };

        twoWayRecognition.onresult = function(event) {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                if (synthesis) synthesis.cancel();
                handleUserInput(finalTranscript);
            }
        };
    }
}

// Toggle voice mode
function toggleVoiceMode() {
    isVoiceMode = !isVoiceMode;
    const voiceIcon = voiceToggle.querySelector('i');
    voiceToggle.setAttribute('aria-pressed', isVoiceMode);
    
    if (isVoiceMode) {
        voiceIcon.classList.remove('fa-microphone');
        voiceIcon.classList.add('fa-microphone-slash');
        if (synthesis) synthesis.cancel();
        setTimeout(() => speakResponse('Voice mode activated. You can speak now.'), 100);
        if (!twoWayRecognition) initializeTwoWayCommunication();
        twoWayRecognition.start();
    } else {
        voiceIcon.classList.remove('fa-microphone-slash');
        voiceIcon.classList.add('fa-microphone');
        if (synthesis) synthesis.cancel();
        if (twoWayRecognition) twoWayRecognition.stop();
        setTimeout(() => speakResponse('Voice mode deactivated.'), 100);
    }
}

// Speak response
function speakResponse(text) {
    if (synthesis) {
        synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text.replace(/\*/g, '');
        utterance.rate = 0.95;
        const voices = synthesis.getVoices();
        const voice = voices.find(v => v.lang.includes('en-IN')) || voices[0];
        if (voice) utterance.voice = voice;
        synthesis.speak(utterance);
    }
}

// Weather update
async function updateWeather() {
    try {
        if (!API_CONFIG.WEATHER_API_KEY || API_CONFIG.WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            throw new Error('Weather API key not configured');
        }

        if (!userLocation) return;

        // Optimized: Check persistent cache before network request
        const cachedWeather = getCache('weather');
        if (cachedWeather) {
            updateWeatherUI(cachedWeather);
            return;
        }

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`
        );
        
        if (!weatherResponse.ok) throw new Error('Weather API request failed');
        const data = await weatherResponse.json();

        // Cache successful response
        setCache('weather', data, CACHE_CONFIG.weather.ttl);

        updateWeatherUI(data);
    } catch (error) {
        console.error('Weather error:', error);
        document.querySelector('.temperature').textContent = 'N/A';
        document.querySelector('.condition').textContent = 'Check API Key';
        document.querySelector('.recommendation p').textContent = 'Please configure your OpenWeatherMap API key in settings to see local weather and recommendations.';
    }
}

function updateWeatherUI(data) {
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.condition').textContent = data.weather[0].description;
    document.querySelector('.humidity').innerHTML = `<i class="fas fa-tint"></i> ${data.main.humidity}%`;
    document.querySelector('.wind').innerHTML = `<i class="fas fa-wind"></i> ${Math.round(data.wind.speed * 3.6)} km/h`;
    document.querySelector('.pressure').innerHTML = `<i class="fas fa-compress-arrows-alt"></i> ${data.main.pressure} hPa`;
    document.querySelector('.visibility').innerHTML = `<i class="fas fa-eye"></i> ${data.visibility / 1000} km`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.sunrise').textContent = sunrise;
    document.querySelector('.sunset').textContent = sunset;

    const recommendation = getAgriculturalRecommendation(data);
    document.querySelector('.recommendation p').textContent = recommendation;
    
    const iconMap = { 'Clear': 'fa-sun', 'Clouds': 'fa-cloud', 'Rain': 'fa-cloud-rain', 'Thunderstorm': 'fa-bolt' };
    document.querySelector('.weather-icon i').className = `fas ${iconMap[data.weather[0].main] || 'fa-cloud'}`;
}

function getAgriculturalRecommendation(data) {
    const condition = data.weather[0].main.toLowerCase();
    const temp = data.main.temp;

    if (condition.includes('rain')) return "Rainy weather detected. Avoid spraying pesticides or fertilizers today. Ensure proper drainage in fields.";
    if (temp > 35) return "High temperature alert. Increase irrigation frequency and provide shade for young saplings where possible.";
    if (temp < 10) return "Cold weather warning. Protect sensitive crops from frost and maintain optimal moisture.";
    if (condition.includes('cloud')) return "Cloudy skies. Good time for manual weeding and soil preparation.";
    return "Weather looks favorable for most agricultural activities. Ideal time for general maintenance and harvesting.";
}

function getLocationAndUpdateWeather() {
    // Optimized: Check persistent cache before requesting geolocation
    const cachedLocation = getCache('location');
    if (cachedLocation) {
        userLocation = cachedLocation;
        updateWeather();
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
            // Cache location data
            setCache('location', userLocation, CACHE_CONFIG.location.ttl);
            updateWeather();
        }, (error) => {
            console.log('Location access error:', error.message);
            document.querySelector('.condition').textContent = 'Location denied';
            document.querySelector('.recommendation p').textContent = 'Please enable location access and check your weather API key to see local weather and recommendations.';
        }, {
            timeout: 10000
        });
    } else {
        document.querySelector('.condition').textContent = 'Unsupported';
    }
}

// Event Listeners
function setupEventListeners() {
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = modeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    voiceToggle.addEventListener('click', () => toggleVoiceMode());

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings-modal').style.display = 'flex';
    });

    document.getElementById('new-chat-btn').addEventListener('click', () => {
        if (confirm('Clear chat history?')) {
            chatHistory = [];
            localStorage.removeItem('chatHistory');
            chatMessages.innerHTML = '';
            addWelcomeMessage();
        }
    });

    document.getElementById('export-chat-btn').addEventListener('click', () => {
        const text = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'greengrok-chat.txt';
        a.click();
    });

    sendBtn.addEventListener('click', () => {
        const msg = userInput.value.trim();
        if (msg) { handleUserInput(msg); userInput.value = ''; }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const msg = userInput.value.trim();
            if (msg) { handleUserInput(msg); userInput.value = ''; }
        }
    });

    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            if (!recognition) initializeVoiceRecognition();
            isListening ? recognition.stop() : recognition.start();
        });
    }

    imageUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        addMessage('<div class="loading">Analyzing image...</div>', 'ai');
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64Image = e.target.result.split(',')[1];
            try {
                if (!API_CONFIG.GEMINI_API_KEY) throw new Error('Missing Gemini API Key');
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Analyze this agricultural image. Provide a description and recommendations." }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }] }]
                    })
                });
                const data = await response.json();
                const analysis = data.candidates[0].content.parts[0].text;
                chatMessages.removeChild(chatMessages.lastChild);
                addMessage(`<div class="image-analysis"><img src="${e.target.result}" alt="Uploaded agricultural image for analysis" style="width:100%; border-radius:8px; margin-bottom:10px;"><p>${analysis}</p></div>`, 'ai');
            } catch (err) {
                chatMessages.removeChild(chatMessages.lastChild);
                addMessage('Error analyzing image: ' + err.message, 'ai');
            }
        };
        reader.readAsDataURL(file);
    });

    // Market Search
    const cropSearch = document.getElementById('cropSearch');
    const searchCrop = document.getElementById('searchCrop');
    const cropTags = document.querySelectorAll('.crop-tag');

    if (searchCrop) {
        searchCrop.addEventListener('click', () => {
            const crop = cropSearch.value.trim().toLowerCase();
            if (crop) updateMarketPrediction(crop);
        });
    }

    cropTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const crop = tag.textContent.trim().toLowerCase();
            cropSearch.value = crop;
            updateMarketPrediction(crop);
        });
    });
}

// AI Handling
async function handleUserInput(input) {
    addMessage(input, 'user');
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ai-message');
    typingIndicator.innerHTML = '<div class="message-content typing">GreenGrok is typing...</div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        if (!API_CONFIG.GEMINI_API_KEY) throw new Error('Gemini API key not configured');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: `You are GreenGrok, an agricultural assistant. User asks: ${input}` }] }] })
        });
        const data = await response.json();
        chatMessages.removeChild(typingIndicator);
        const text = data.candidates[0].content.parts[0].text;
        addMessage(text, 'ai');
        if (isVoiceMode) speakResponse(text);
    } catch (error) {
        chatMessages.removeChild(typingIndicator);
        addMessage('Error: ' + error.message, 'ai');
    }
}

function addWelcomeMessage() {
    addMessage("Hello! I'm GreenGrok, your agricultural assistant. How can I help you today?", 'ai', false);
}

// Settings
function setupSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const geminiInput = document.getElementById('gemini-key');
    const weatherInput = document.getElementById('weather-key');
    const ogdInput = document.getElementById('ogd-key');

    geminiInput.value = API_CONFIG.GEMINI_API_KEY;
    weatherInput.value = API_CONFIG.WEATHER_API_KEY;
    ogdInput.value = API_CONFIG.OGD_API_KEY;

    const closeModal = document.querySelector('.close-modal');
    const closeSettings = () => modal.style.display = 'none';
    closeModal.onclick = closeSettings;
    closeModal.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeSettings();
        }
    };
    document.getElementById('save-settings').onclick = () => {
        API_CONFIG.GEMINI_API_KEY = geminiInput.value.trim();
        API_CONFIG.WEATHER_API_KEY = weatherInput.value.trim();
        API_CONFIG.OGD_API_KEY = ogdInput.value.trim();

        localStorage.setItem('gemini_api_key', API_CONFIG.GEMINI_API_KEY);
        localStorage.setItem('weather_api_key', API_CONFIG.WEATHER_API_KEY);
        localStorage.setItem('ogd_api_key', API_CONFIG.OGD_API_KEY);

        modal.style.display = 'none';
        updateWeather();
        alert('Settings saved!');
    };
}

// Market Logic
async function updateMarketPrediction(crop) {
    addMessage('<div class="loading">Fetching market data for ' + crop + '...</div>', 'ai');
    try {
        // In a real app, use API_CONFIG.OGD_API_KEY here to fetch from data.gov.in
        // Example: const resp = await fetch(`https://api.data.gov.in/resource/...&api-key=${API_CONFIG.OGD_API_KEY}`);
        
        const data = INDIAN_MARKET_DATA[crop] || Object.values(INDIAN_MARKET_DATA).find(d => d.market.toLowerCase().includes(crop));
        chatMessages.removeChild(chatMessages.lastChild);

        if (data) {
            displayMarketData(crop, data);
        } else {
            addMessage('No specific data found for ' + crop + '. Showing general agricultural trends.', 'ai');
        }
    } catch (err) {
        chatMessages.removeChild(chatMessages.lastChild);
        addMessage('Error: ' + err.message, 'ai');
    }
}

function displayMarketData(crop, marketData) {
    const chartId = `chart-${Date.now()}`;
    const html = `
        <div class="market-analysis-container">
            <div class="market-header" style="background:var(--primary-color); color:white; padding:10px; border-radius:8px 8px 0 0;">
                <h4>Market Analysis: ${crop.toUpperCase()}</h4>
                <small>${marketData.market}, ${marketData.state}</small>
            </div>
            <div style="padding:15px; background:var(--card-bg); border:1px solid var(--border-color); border-top:none; border-radius:0 0 8px 8px;">
                <canvas id="${chartId}" height="150" role="img" aria-label="Price trend chart for ${crop}"></canvas>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                    <div><strong>Current:</strong> ₹${marketData.currentPrice}</div>
                    <div><strong>Predicted:</strong> ₹${marketData.predictedPrice}</div>
                </div>
                <p style="margin-top:10px; font-size:0.9rem;">${marketData.recommendation}</p>
            </div>
        </div>
    `;
    addMessage(html, 'ai');

    setTimeout(() => {
        const el = document.getElementById(chartId);
        if (el && window.Chart) {
            new Chart(el.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Past', 'Current', 'Future'],
                    datasets: [{
                        data: [parseFloat(marketData.lastWeekPrice.replace(/,/g,'')), parseFloat(marketData.currentPrice.replace(/,/g,'')), parseFloat(marketData.predictedPrice.replace(/,/g,''))],
                        borderColor: '#10b981',
                        tension: 0.4
                    }]
                },
                options: { plugins: { legend: { display: false } } }
            });
        }
    }, 100);
}

function addSeasonalTips() {
    const seasonalTips = {
        0: "January: Harvest sugarcane, sow late wheat.",
        1: "February: Plant summer vegetables.",
        2: "March: Wheat harvesting begins.",
        3: "April: Peak wheat harvesting.",
        4: "May: Prepare soil for Kharif.",
        5: "June: Rice sowing starts.",
        6: "July: Rice transplanting.",
        7: "August: Apply fertilizers.",
        8: "September: Harvest short crops.",
        9: "October: Sow Rabi crops (wheat, mustard).",
        10: "November: Peak wheat sowing.",
        11: "December: Irrigate wheat."
    };
    const month = new Date().getMonth();
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.innerHTML = `<h3><i class="fas fa-calendar"></i> Seasonal Tips</h3><p>${seasonalTips[month]}</p>`;
    document.querySelector('.sidebar').appendChild(widget);
}
