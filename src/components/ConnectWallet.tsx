import { useState, useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Fingerprint, Wallet, LogOut } from 'lucide-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface ConnectWalletProps {
  onLog: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function ConnectWallet({ onLog }: ConnectWalletProps) {
  const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  
  const address = smartWalletPubkey?.toBase58();

  useEffect(() => {
    if (smartWalletPubkey) {
      const connection = new Connection(import.meta.env.VITE_LAZORKIT_RPC_URL);
      connection.getBalance(smartWalletPubkey).then(lamports => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      }).catch(err => console.error("Balance fetch error:", err));
    } else {
      setBalance(null);
    }
  }, [smartWalletPubkey]);

  const handleConnect = async () => {
    try {
      onLog("Initiating Passkey authentication...", "info");
      await connect();
      onLog("Biometric verification successful!", "success");
    } catch (err) {
      onLog(`Connection failed: ${(err as Error).message}`, "error");
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    onLog("Wallet disconnected.", "info");
  };

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-center gap-1">
          <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
            <Wallet className="text-white h-8 w-8" />
          </div>
          <h2 className="text-zinc-100 font-medium text-lg">Wallet Connected</h2>
          <button 
            onClick={() => {
              if (address) {
                navigator.clipboard.writeText(address);
                onLog("Address copied to clipboard", "success");
              }
            }}
            className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group"
            title="Click to copy address"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-200 break-all text-left">
              {address}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Balance</p>
            <p className="text-xl font-bold text-white">
              {balance ? balance.toFixed(4) : '0.00'} <span className="text-sm font-normal text-zinc-500">SOL</span>
            </p>
          </div>
          <button 
            onClick={handleDisconnect}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-zinc-900/50 hover:bg-rose-900/10 border border-zinc-800 hover:border-rose-500/30 rounded-lg transition-all group"
          >
            <LogOut size={18} className="text-zinc-400 group-hover:text-rose-400 transition-colors" />
            <span className="text-xs text-zinc-500 group-hover:text-rose-400">Disconnect</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="group relative w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black font-semibold py-4 px-6 rounded-xl transition-all shadow-xl shadow-white/5 active:scale-95"
    >
      <div className="bg-black/10 p-2 rounded-full">
        <Fingerprint className="w-5 h-5" />
      </div>
      <span className="text-lg">Log in with Passkey</span>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
    </button>
  );
}