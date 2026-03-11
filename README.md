# Aura Voice Translator 🎙️✨

A beautiful, glassmorphic multilingual voice translator that converts spoken English to Finnish and vice-versa in real-time.

## 🚀 How to Run Locally

1.  **Open Terminal** in this folder.
2.  **Run the application:**
    ```bash
    npm start
    ```
3.  **Access the app:**
    *   **Local:** [http://localhost:3000](http://localhost:3000)
    *   **Network:** `http://<your-ip>:3000` (Note: Speech recognition will be blocked on non-localhost/non-HTTPS connections)

## ⚠️ Important Note on Speech Recognition
Browsers (Chrome, Edge) require a **Secure Context** for the Speech Recognition API.
- ✅ Works on `http://localhost:3000`
- ✅ Works on `https://` (any domain)
- ❌ **Blocked** on plain IP addresses (e.g., `http://172.20.78.51:3000`)

---

## 🔗 Project Links
- **GitHub Repository:** [https://github.com/hajilooshaghayegh2024-maker/Aura-Voice-Translator](https://github.com/hajilooshaghayegh2024-maker/Aura-Voice-Translator)
- **Live Preview (GitHub Pages):** [https://hajilooshaghayegh2024-maker.github.io/Aura-Voice-Translator/](https://hajilooshaghayegh2024-maker.github.io/Aura-Voice-Translator/)

## ✨ Features
- **Real-time Voice Translation:** Instant English ↔ Finnish conversion.
- **Glassmorphic UI:** Modern, translucent design with dynamic background blobs.
- **Auto-language detection:** Toggle between source and target languages.
- **Debounced Text Input:** Type manually for translation with optimized API calls.

---
Built with ❤️ by [Shagayegh](https://github.com/hajilooshaghayegh2024-maker)
