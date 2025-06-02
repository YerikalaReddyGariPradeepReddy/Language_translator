# Setup Instructions for Running Verto on Your Laptop

## 📋 Prerequisites

Before you start, make sure you have these installed on your laptop:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - This will also install npm automatically

2. **Git** 
   - Download from: https://git-scm.com/
   - For Windows: Git for Windows
   - For Mac: Usually pre-installed, or via Homebrew
   - For Linux: `sudo apt install git` (Ubuntu) or equivalent

3. **VS Code** (recommended)
   - Download from: https://code.visualstudio.com/

## 🚀 Step-by-Step Setup

### Step 1: Export from Replit to GitHub

1. **In Replit:**
   - Click on the "Version Control" tab (Git icon) in the left sidebar
   - Click "Create a Git repository"
   - Add a commit message like "Initial commit - Verto Translation App"
   - Click "Commit & Push"
   - Click "Connect to GitHub" and follow the prompts
   - Choose a repository name (e.g., "verto-translator")
   - Make it public or private as you prefer

### Step 2: Clone to Your Laptop

1. **Open Terminal/Command Prompt:**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type "terminal", press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Navigate to where you want the project:**
   ```bash
   cd Desktop
   # or wherever you want to store the project
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/verto-translator.git
   cd verto-translator
   ```

### Step 3: Install Dependencies

1. **Install all required packages:**
   ```bash
   npm install
   ```
   
   This will take a few minutes to download all dependencies.

### Step 4: Start the Application

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

🎉 **Your Verto translation app should now be running!**

## 🛠️ VS Code Setup (Recommended)

### Step 1: Open Project in VS Code

1. **Open VS Code**
2. **Open the project folder:**
   - File → Open Folder
   - Select your `verto-translator` folder
   - Or use terminal: `code .` (when inside the project folder)

### Step 2: Install Recommended Extensions

Click on the Extensions icon (square icon in left sidebar) and install:

1. **TypeScript and JavaScript Language Features** (usually pre-installed)
2. **Tailwind CSS IntelliSense** - for CSS autocompletion
3. **ES7+ React/Redux/React-Native snippets** - for React shortcuts
4. **Prettier - Code formatter** - for code formatting
5. **Auto Rename Tag** - for HTML/JSX tag editing

### Step 3: Set Up Integrated Terminal

1. **Open terminal in VS Code:**
   - Press `Ctrl + `` (backtick key)
   - Or go to Terminal → New Terminal

2. **Run the project:**
   ```bash
   npm run dev
   ```

## 🔧 Useful VS Code Shortcuts

- `Ctrl + `` - Toggle terminal
- `Ctrl + P` - Quick file search
- `Ctrl + Shift + P` - Command palette
- `Ctrl + /` - Comment/uncomment lines
- `Alt + Shift + F` - Format document
- `F5` - Start debugging

## 📂 Project Structure Overview

```
verto-translator/
├── client/src/          # React frontend code
│   ├── components/      # UI components
│   ├── pages/          # Different app pages
│   ├── contexts/       # State management
│   └── lib/            # Utilities
├── server/             # Backend API code
├── shared/             # Shared types
└── package.json        # Dependencies
```

## 🐛 Troubleshooting

### Common Issues:

1. **"npm not found" error:**
   - Make sure Node.js is properly installed
   - Restart your terminal/command prompt
   - Try `node --version` to verify installation

2. **Port 5000 already in use:**
   - Try closing other applications using port 5000
   - Or modify the port in `server/index.ts`

3. **Permission errors (Mac/Linux):**
   - Try using `sudo npm install` (not recommended for security)
   - Better: Fix npm permissions following npm docs

4. **Module not found errors:**
   - Delete `node_modules` folder and `package-lock.json`
   - Run `npm install` again

## 🔄 Making Changes

1. **Edit files in VS Code**
2. **Save changes** (`Ctrl + S`)
3. **Changes auto-reload** in browser (hot reloading enabled)
4. **Commit changes to Git:**
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```

## 🎯 Next Steps

Once everything is running:

1. **Test the translation features**
2. **Try the voice recognition** (allow microphone permissions)
3. **Test conversation mode**
4. **Explore the different language options**
5. **Toggle between light/dark themes**

## 📞 Need Help?

If you run into any issues:
1. Check the terminal for error messages
2. Make sure all prerequisites are installed
3. Try restarting the development server
4. Check that your browser allows microphone access for voice features

**Happy coding! 🚀**