import { useState } from 'react';
import { WalletPanel } from './components/WalletPanel';
import { TransactionActivity } from './components/TransactionActivity';

function App() {
  const [logs, setLogs] = useState<any[]>([]);

  const addLog = (message: string, type: 'success' | 'error' | 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), message, type, timestamp }, ...prev]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Left Panel: Wallet Connection */}
        <WalletPanel onLog={addLog} />

        {/* Right Panel: Transaction Activity */}
        <TransactionActivity logs={logs} />
      </div>
    </div>
  );
}

export default App;