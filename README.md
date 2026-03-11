# RAHA Voice Translator & Learning Hub 🎙️✨

A premium, glassmorphic suite for translating and mastering the Finnish language. RAHA combines real-time voice translation with a comprehensive Grammar Guide and a searchable Vocabulary Word Hub.

## 🔗 Project Links
- **Live Local Link:** [http://localhost:3000](http://localhost:3000)
- **GitHub Repository:** [https://github.com/hajilooshaghayegh2024-maker/Aura-Voice-Translator](https://github.com/hajilooshaghayegh2024-maker/Aura-Voice-Translator)

---

## 🚀 Key Modules & Code Logic

### 1. 🎤 Live Voice Translation
Built using the **Web Speech API**, this module handles real-time audio-to-text conversion and instant translation using the MyMemory API.

**Technical Events:**
- `recognition.onstart`: Activation of UI listening indicators and microphone pulse animation.
- `recognition.onresult`: Real-time processing of interim and final transcripts.
- `recognition.onerror`: Handling secure context requirements and microphone permissions.
- `translateText()`: Async fetch event that triggers upon capturing a final transcript or when the user finishes typing (debounced).

### 2. 📖 Finnish Grammar Hub
A structured learning portal accessible via the book icon in the top-left corner.

**Features:**
- **Levels:** Elementary, Intermediate, and Advanced.
- **Switching Logic:** `loadGrammarLevel()` event dynamically injects specialized HTML content based on the selected level tab.
- **Design:** Uses a modal overlay with backdrop-blur for a professional "focus" mode.

### 3. 📚 Vocabulary Word Hub (4000+ Potential)
A massive searchable library of Finnish words with English translations and native audio.

**Technical Events:**
- **Search Event**: An `input` listener on the search bar filters the word array in real-time using `renderVocabList()`.
- **Level Tabs**: Clicking A1, B1, or C1 triggers a state update that re-renders local arrays categorized by difficulty.
- **Pronunciation (Audio)**: `speakFinnish(text)` event utilizes the `SpeechSynthesisUtterance` interface with the `fi-FI` voice profile.

---

## 🎨 Design System (Aura Aesthetics)
- **Glassmorphism:** Cards use `backdrop-filter: blur(15px)` and translucent backgrounds.
- **Dynamic Blobs:** CSS-animated shapes move subtly in the background using `@keyframes move`.
- **RAHA Branding:** Minimalist premium typography using the 'Outfit' and 'Playfair Display' Google Fonts.

---

## 🛠️ Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local server:**
   ```bash
   npm start
   ```

3. **Technical Notes:**
- **Secure Context UI**: The app includes a check (`window.isSecureContext`) to warn users that speech recognition requires HTTPS or localhost.
- **Debouncing**: Manual text input uses an 800ms debounce timer to optimize API usage.

---
Built with ❤️ for Finnish Language Learners.
