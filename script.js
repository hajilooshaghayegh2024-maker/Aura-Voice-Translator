// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Secure Context Check (Required for Speech API on Chrome/Edge)
if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    alert("Speech Recognition requires a Secure Context (HTTPS or localhost).\n\nIf you are accessing this via an IP address (like 172.x.x.x), the microphone will be blocked by the browser.");
}

if (!recognition) {
    alert("Sorry, your browser does not support Speech Recognition. Please use Chrome or Edge.");
}

// Elements
const micBtn = document.getElementById('mic-btn');
const langToggle = document.getElementById('lang-toggle');
const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const sourceTitle = document.getElementById('source-title');
const statusDot = document.getElementById('status-dot');
const labelEn = document.getElementById('label-en');
const labelFi = document.getElementById('label-fi');

let isListening = false;
let currentLanguage = 'en-US'; // Default input
let targetLanguage = 'fi';      // Default target
let debounceTimer;

// Set up Speech Recognition
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = currentLanguage;

const updateLanguageConfig = () => {
    if (langToggle.checked) {
        // FI -> EN
        currentLanguage = 'fi-FI';
        targetLanguage = 'en';
        labelEn.classList.remove('active');
        labelFi.classList.add('active');
        sourceTitle.textContent = isListening ? "Listening (Finnish)..." : "Finnish to English";
    } else {
        // EN -> FI
        currentLanguage = 'en-US';
        targetLanguage = 'fi';
        labelEn.classList.add('active');
        labelFi.classList.remove('active');
        sourceTitle.textContent = isListening ? "Listening (English)..." : "English to Finnish";
    }
    recognition.lang = currentLanguage;
    
    // If it was listening, restart it with new language
    if(isListening) {
        recognition.stop();
        setTimeout(() => recognition.start(), 300);
    }
};

langToggle.addEventListener('change', updateLanguageConfig);

const translateText = async (text) => {
    if (!text || text.trim().length === 0) return;
    
    // MyMemory API: Free translation API
    // Format: https://api.mymemory.translated.net/get?q=TEXT&langpair=FROM|TO
    const from = currentLanguage.split('-')[0];
    const to = targetLanguage;
    
    try {
        targetText.style.opacity = '0.5';
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        
        if (data && data.responseData) {
            targetText.textContent = data.responseData.translatedText;
        } else {
            targetText.textContent = "Translation failed. Please try again.";
        }
    } catch (error) {
        console.error("Translation Error:", error);
        targetText.textContent = "Error: Could not connect to translation server.";
    } finally {
        targetText.style.opacity = '1';
    }
};

recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('active');
    statusDot.classList.add('listening');
    sourceTitle.textContent = "Listening...";
};

recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('active');
    statusDot.classList.remove('listening');
    if (!sourceText.value.trim()) {
        sourceTitle.textContent = "Tap to start";
    }
};

recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    isListening = false;
    micBtn.classList.remove('active');
    statusDot.classList.remove('listening');
    
    if (event.error === 'not-allowed') {
        alert("Speech Recognition Error: Microphone access is blocked.\n\nMake sure your site is using HTTPS, or accessed via 'localhost'. Browsers do not allow microphone usage over insecure HTTP connections (like an IP address).");
    } else {
        alert(`Speech Recognition Error: ${event.error}`);
    }
};

recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript = event.results[i][0].transcript;
            sourceText.value = finalTranscript;
            translateText(finalTranscript);
        } else {
            interimTranscript += event.results[i][0].transcript;
            sourceText.value = interimTranscript;
        }
    }
};

// Typing Event with Debounce
sourceText.addEventListener('input', (e) => {
    const text = e.target.value;
    
    // Reset status title if user starts typing
    if (text.length > 0 && !isListening) {
        sourceTitle.textContent = "Typing...";
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (text.trim().length > 0) {
            translateText(text);
            if (!isListening) {
                sourceTitle.textContent = langToggle.checked ? "Finnish to English" : "English to Finnish";
            }
        }
    }, 800); // Wait 800ms after last keystroke before translating
});

micBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
        sourceText.value = "";
        targetText.textContent = "...";
    }
});

// Initialize State
updateLanguageConfig();
