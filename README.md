# Lazorkit Starter (Vite + React) 

A modern, production-ready starter template for building Solana applications with **Biometric Passkeys** and **Gasless Transactions** using the [Lazorkit SDK](https://docs.lazorkit.com/).

## Features

* **Passkey Authentication:** distinct login implementation using TouchID/FaceID (WebAuthn).
* **Gasless Transactions:** Smart wallet integration where the app sponsors transaction fees (Paymaster).
* **Session Persistence:** Securely manages user sessions across page reloads.
* **Modern UI:** Built with Tailwind CSS, Lucide Icons, and a glassmorphism design system.

## Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Blockchain SDK:** `@lazorkit/wallet`, `@solana/web3.js`
* **Language:** TypeScript

---

## Quick Start

### 1. Prerequisites

Ensure you have the following installed:

* Node.js v18+
* npm or yarn

### 2. Clone the Repository

```bash
git clone https://github.com/ammagofficials/Lazorkit.git
cd Lazorkit

```

### 3. Install Dependencies

```bash
npm install
# or
yarn install

```

### 4. Configure Environment

Create a `.env` file in the root directory if you not .env in repo . You can duplicate the example file:

```bash
cp .env.example .env

```

### 5. Run the Application

Start the local development server:

```bash
npm run dev

```

Open [http://localhost:5173] in your browser.

---

## 📂 Project Structure

A quick look at the top-level files and directories:

```text
.
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── ActionPanel.tsx         # Action buttons container
│   │   ├── ActivityLog.tsx         # Activity log display component
│   │   ├── AuthStatus.tsx          # Authentication status indicator
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Card.tsx                # Glassmorphism card container
│   │   ├── ConnectWallet.tsx       # Handles Passkey Login/Logout logic
│   │   ├── Header.tsx              # Application header
│   │   ├── SendTransaction.tsx     # Transaction form handling
│   │   ├── TransactionActivity.tsx # Transaction history view
│   │   ├── WalletPanel.tsx         # Main wallet interface panel
│   │   └── index.ts                # Component exports
│   ├── context/
│   │   └── LazorProvider.tsx       # Global SDK Configuration wrapper
│   ├── ActivityLog.tsx             # (Alternate) Activity log component
│   ├── App.tsx                     # Main application component
│   ├── index.css                   # Global styles & Tailwind directives
│   └── main.tsx                    # Vite entry point
├── .env.example                 # Template for environment variables
├── tailwind.config.js           # Styling configuration
└── README.md

```

## 📚 Key Integration Examples

### 1. Initializing the Provider (`src/context/LazorProvider.tsx`)

We wrap the app in the `LazorkitProvider` to give all components access to the smart wallet.

### 2. Passkey Login (`src/components/ConnectWallet.tsx`)

Uses the `connect()` hook to trigger the device's native biometric prompt.

### 3. Gasless Transaction (`src/components/GaslessDemo.tsx`)

Demonstrates how to send a transaction where the `feeToken` is set to paymaster or USDC, removing the need for the user to hold SOL.

```typescript
// Example of Gasless Config
const tx = await signAndSendTransaction({
  instructions: [...],
  transactionOptions: {
    sponsored: true // The app pays the gas!
  }
});

```