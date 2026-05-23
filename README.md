# SpendWise 🪙

SpendWise is a secure, local-first personal financial ledger matrix built as a desktop application. It operates entirely in isolation on your machine, leveraging a local SQLite database engine without any external transit loops or third-party cloud data persistence.

## 🛠️ Architecture Stack

- **Frontend Core:** React 19 + TypeScript + Tailwind CSS v4
- **App Shell Engine:** Electron 42 (Context-Isolated Bridge Pipeline)
- **Database Engine:** Native C++ SQLite3 (Isolated Instance Mapping)
- **Bundler Pipeline:** Vite 8 + Vite Electron Plugins

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your local computer environment. Because `sqlite3` uses native C++ bindings, your machine will build the binaries specifically matching your OS architecture during installation.

### Local Installation

1. Clone this repository down to your terminal directory:
   ```bash
   git clone <your-repository-url>
   cd spendwise
   ```
2. Install the package dependencies:
  ```bash
  npm install
  ```
3. Force-rebuild the native SQLite modules specifically bound to your current system architecture:
  ```bash
  npm rebuild sqlite3
  ```

### Running the Application

To spin up the hot-reloading development environment window frame, execute:

```bash
npm run dev
```

🔒 Security Matrix
All inputs committed through the ledger tabs write immediately onto your local filesystem SQLite instance mapped inside your machine's system `userData` application directory. No data leaves your hardware layer.