# TypeNode ⌨️🚀

**TypeNode** is a modern, privacy-focused typing practice application tailored for developers and avid readers. Instead of typing generic, randomly generated sentences, TypeNode allows you to practice typing directly from your own codebases or personal documents. 

Everything runs 100% locally in your browser. No files are ever uploaded or sent to a server!

## ✨ Features

- **💻 Code Practice Mode**: Select any local Node.js, React, or frontend project folder. TypeNode will intelligently parse through your directory (ignoring `node_modules`, `dist`, `.git`, etc.) and extract random code snippets (`.js`, `.jsx`, `.ts`, `.tsx`) for you to practice.
- **📄 Text / PDF Practice Mode**: Upload `.pdf`, `.md`, or `.txt` files directly into the app. Integrated with `pdfjs-dist`, it extracts text dynamically and generates continuous word chunks for standard reading practice.
- **⚡ Real-time Analytics**: Track your Words Per Minute (WPM), Accuracy percentage, and elapsed time continuously as you type.
- **🎨 Premium UI/UX**: Built with a sleek dark theme, glassmorphism UI elements, and highly polished micro-animations powered by Framer Motion.
- **🔒 100% Local**: Utilizes modern HTML5 File System Directory Access API and local JavaScript workers. Complete privacy with zero server uploads.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Grid, Glassmorphism)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Parsing**: [pdfjs-dist (3.11.174)](https://mozilla.github.io/pdf.js/) for native local PDF processing

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ImaranAnsari/typing-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd typing-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## 💡 How to Use

1. **Launch the App**: Open the app in your browser based on the local server port.
2. **Choose Your Mode**:
   - **Code Folder**: Click this to grant purely local read access to a coding project folder on your computer. It will fetch code files inside to generate snippets.
   - **Text/PDF/MD Files**: Click this to browse and select files to read standard text.
3. **Start Typing**: Once the snippet loads, simply start typing. Your stats will update automatically.
4. **Controls**:
   - Hit `Escape` or the **Skip** button to instantly load a new random snippet from your loaded files.
   - Click the **Back** button to return to the Start Screen and upload new files.

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to check the issues page and open a pull request if you want to help improve TypeNode.
