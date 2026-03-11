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

// Grammar Elements
const grammarOpen = document.getElementById('grammar-open');
const grammarClose = document.getElementById('grammar-close');
const grammarModal = document.getElementById('grammar-modal');
const grammarContent = document.getElementById('grammar-content');
const levelTabs = document.querySelectorAll('.level-tab');

// Vocabulary Elements
const vocabOpen = document.getElementById('vocab-open');
const vocabClose = document.getElementById('vocab-close');
const vocabModal = document.getElementById('vocab-modal');
const vocabList = document.getElementById('vocab-list');
const vocabSearch = document.getElementById('vocab-search');
const vocabTabs = document.querySelectorAll('.vocab-tab');

// Audio Logic for Pronunciation
const speakFinnish = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fi-FI';
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser does not support text-to-speech.");
    }
};

const vocabData = {
    A1: [
        { fi: "Terve", en: "Hello" }, { fi: "Kiitos", en: "Thank you" }, { fi: "Kyllä", en: "Yes" }, 
        { fi: "Ei", en: "No" }, { fi: "Mitä kuuluu?", en: "How are you?" }, { fi: "Hyvää huomenta", en: "Good morning" },
        { fi: "Anteeksi", en: "Sorry / Excuse me" }, { fi: "Näkemiin", en: "Goodbye" }, { fi: "Minä", en: "I" },
        { fi: "Sinä", en: "You" }, { fi: "Hän", en: "He / She" }, { fi: "Me", en: "We" },
        { fi: "He", en: "They" }, { fi: "Kissa", en: "Cat" }, { fi: "Koira", en: "Dog" },
        { fi: "Talote", en: "House" }, { fi: "Kirja", en: "Book" }, { fi: "Vesi", en: "Water" },
        { fi: "Ruoka", en: "Food" }, { fi: "Yksi", en: "One" }, { fi: "Kaksi", en: "Two" }
    ],
    B1: [
        { fi: "Ymmärtää", en: "To understand" }, { fi: "Tarvita", en: "To need" }, { fi: "Mahdollisuus", en: "Opportunity / Chance" },
        { fi: "Päättää", en: "To decide" }, { fi: "Vaikea", en: "Difficult" }, { fi: "Helppo", en: "Easy" },
        { fi: "Tärkeä", en: "Important" }, { fi: "Kehittää", en: "To develop" }, { fi: "Yhteiskunta", en: "Society" },
        { fi: "Ympäristö", en: "Environment" }, { fi: "Osallistua", en: "To participate" }, { fi: "Kokeilla", en: "To try" }
    ],
    C1: [
        { fi: "Edellyttää", en: "To require / To prerequisite" }, { fi: "Riippumaton", en: "Independent" },
        { fi: "Monimutkainen", en: "Complex" }, { fi: "Vaikutusvaltainen", en: "Influential" },
        { fi: "Perusteellinen", en: "Thorough" }, { fi: "Samanaikaisesti", en: "Simultaneously" },
        { fi: "Välttämätön", en: "Essential" }, { fi: "Kattava", en: "Comprehensive" }
    ]
};

const grammarData = {
    elementary: `
        <div class="grammar-section">
            <h3>Nouns: Cases (Elementary)</h3>
            <ul>
                <li><strong>Nominative:</strong> The basic form (e.g., <em>auto</em> - car).</li>
                <li><strong>Genitive:</strong> Shows possession, adds '-n' (e.g., <em>auton</em> - car's).</li>
                <li><strong>Partitive:</strong> Used for indefinite amounts, adds '-a/-ä' (e.g., <em>autoa</em>).</li>
            </ul>
        </div>
        <div class="grammar-section">
            <h3>Verbs: Groups 1-6</h3>
            <ul>
                <li><strong>Type 1:</strong> Ending in two vowels (<em>puhua</em> - to speak).</li>
                <li><strong>Type 2:</strong> Ending in '-da/-dä' (<em>juoda</em> - to drink).</li>
                <li><strong>Personal Endings:</strong> -n, -t, -, -mme, -tte, -vat (minä puhun).</li>
            </ul>
        </div>
    `,
    intermediate: `
        <div class="grammar-section">
            <h3>Consonant Gradation (KPT)</h3>
            <ul>
                <li>Changing consonants in the stem (e.g., <em>kukka</em> -> <em>kukan</em>).</li>
                <li><strong>Strong to Weak:</strong> kk -> k, pp -> p, tt -> t.</li>
                <li>Used in many cases like Genitive and Missä (Inessive).</li>
            </ul>
        </div>
        <div class="grammar-section">
            <h3>Object Rules</h3>
            <ul>
                <li>The object can be Partitive, Genitive, or Nominative.</li>
                <li>Negative sentence -> Always Partitive object.</li>
                <li>Resultative action -> Genitive/Accusative.</li>
            </ul>
        </div>
    `,
    advanced: `
        <div class="grammar-section">
            <h3>The Passive Voice</h3>
            <ul>
                <li>Used when the doer is unknown or unimportant.</li>
                <li>Formal: <em>Täällä puhutaan suomea</em> (Finnish is spoken here).</li>
                <li>Colloquial: We speak (<em>Me puhutaan</em>).</li>
            </ul>
        </div>
        <div class="grammar-section">
            <h3>Participial Phrases</h3>
            <ul>
                <li>Replacing subordinate clauses (e.g., <em>-vAn</em>, <em>-neen</em>).</li>
                <li><em>Näin miehen kävelevän</em> (I saw the man walking).</li>
            </ul>
        </div>
    `
};

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

// Grammar Logic
const loadGrammarLevel = (level) => {
    grammarContent.innerHTML = grammarData[level];
    levelTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.level === level);
    });
};

grammarOpen.addEventListener('click', () => {
    grammarModal.classList.add('active');
    loadGrammarLevel('elementary');
});

grammarClose.addEventListener('click', () => {
    grammarModal.classList.remove('active');
});

grammarModal.addEventListener('click', (e) => {
    if (e.target === grammarModal) grammarModal.classList.remove('active');
});

levelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        loadGrammarLevel(tab.dataset.level);
    });
});

// Vocabulary Logic
let currentVocabLevel = 'A1';

const renderVocabList = (filter = "") => {
    const list = vocabData[currentVocabLevel];
    const filtered = list.filter(item => 
        item.fi.toLowerCase().includes(filter.toLowerCase()) || 
        item.en.toLowerCase().includes(filter.toLowerCase())
    );

    vocabList.innerHTML = filtered.map(item => `
        <div class="vocab-card glass">
            <div class="vocab-header">
                <span class="v-finnish">${item.fi}</span>
                <button class="speaker-btn" onclick="speakFinnish('${item.fi.replace(/'/g, "\\'")}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </div>
            <span class="v-english">${item.en}</span>
        </div>
    `).join('');
};

// Make speakFinnish globally accessible for onclick
window.speakFinnish = speakFinnish;

vocabOpen.addEventListener('click', () => {
    vocabModal.classList.add('active');
    renderVocabList();
});

vocabClose.addEventListener('click', () => {
    vocabModal.classList.remove('active');
});

vocabModal.addEventListener('click', (e) => {
    if (e.target === vocabModal) vocabModal.classList.remove('active');
});

vocabTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        currentVocabLevel = tab.dataset.level;
        vocabTabs.forEach(t => t.classList.toggle('active', t === tab));
        renderVocabList(vocabSearch.value);
    });
});

vocabSearch.addEventListener('input', (e) => {
    renderVocabList(e.target.value);
});
