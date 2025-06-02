# Verto - Language Translation Application

A modern, full-stack language translation application with voice recognition, conversation mode, and support for 100+ languages including comprehensive Indian language support.

## ✨ Features

- **Real-time Translation**: Translate text between 100+ languages
- **Voice Recognition**: Speak to input text with enhanced support for Indian languages
- **Text-to-Speech**: Listen to translations in the target language
- **Conversation Mode**: Enable two people to have conversations in different languages
- **Language Detection**: Automatically detect the source language
- **Translation History**: View and manage your translation history
- **Saved Translations**: Save and organize your favorite translations
- **Offline Language Downloads**: Download languages for offline use
- **Dark/Light Theme**: Toggle between dark and light modes
- **Auto-translate**: Automatically translate as you type
- **Indian Language Focus**: Special emphasis on Hindi, Bengali, Telugu, Tamil, and other Indian languages

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **State Management**: React Context + TanStack Query
- **UI Components**: Shadcn/ui, Radix UI
- **Audio**: Web Speech API for voice recognition and text-to-speech
- **Routing**: Wouter
- **Build Tool**: Vite
- **Database**: In-memory storage (easily replaceable with PostgreSQL)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager
- Git installed
- VS Code (recommended)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/verto-translator.git
   cd verto-translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The app should now be running!

### VS Code Setup (Recommended)

1. **Install recommended extensions**:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

2. **Open the project in VS Code**:
   ```bash
   code .
   ```

3. **Use the integrated terminal**:
   - Press `Ctrl+`` (backtick) to open terminal
   - Run `npm run dev` to start the server

## 📁 Project Structure

```
verto-translator/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Theme, Translation)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
└── components.json         # Shadcn/ui configuration
```

## 🎯 How to Use

### Basic Translation
1. Select source and target languages
2. Enter text to translate or use voice input
3. Click "Translate" or enable auto-translate
4. Copy, save, or listen to the translation

### Conversation Mode
1. Toggle "Conversation Mode" on
2. Translate your message
3. Click the reply button (↩️) to swap languages for response
4. Continue the conversation seamlessly

### Voice Features
- **Voice Input**: Click the microphone icon in the input area
- **Text-to-Speech**: Click the speaker icon in the translation area
- **Enhanced Indian Language Support**: Optimized voice recognition for Hindi, Bengali, Telugu, Tamil, and more

### Language Management
- **Browse Languages**: Click "Browse all" to see all 100+ supported languages
- **Language Detection**: Click "Detect language" to auto-identify source language
- **Indian Languages**: Find all Indian languages grouped together in the language selector

## 🌐 Supported Languages

Over 100 languages including:

**Indian Languages**: Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Assamese, and more

**Major World Languages**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian, Dutch, and many more

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Setup

The application uses in-memory storage by default. For production, you can easily switch to PostgreSQL by updating the storage configuration.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

## 🎉 Acknowledgments

- Built with modern web technologies
- UI components from Shadcn/ui
- Icons from Lucide React
- Voice features powered by Web Speech API

---

**Happy Translating! 🌍**