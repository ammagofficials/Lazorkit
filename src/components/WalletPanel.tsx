import { useState, useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Wallet, Copy, LogOut, Fingerprint, Send, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Connection, LAMPORTS_PER_SOL, SystemProgram, PublicKey } from '@solana/web3.js';

interface WalletPanelProps {
  onLog?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function WalletPanel({ onLog }: WalletPanelProps = {}) {
  const { connect, disconnect, isConnected, smartWalletPubkey, signAndSendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Send transaction state
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const address = smartWalletPubkey?.toBase58();


  const fetchBalance = async () => {
    if (smartWalletPubkey) {
      try {
        const connection = new Connection(import.meta.env.VITE_LAZORKIT_RPC_URL);
        const lamports = await connection.getBalance(smartWalletPubkey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    }
  };

  useEffect(() => {
    if (smartWalletPubkey) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [smartWalletPubkey]);

  const handleConnect = async () => {
    try {
      onLog?.("Initiating Passkey authentication...", "info");
      await connect();
      onLog?.("Biometric verification successful!", "success");
    } catch (err) {
      onLog?.(`Connection failed: ${(err as Error).message}`, "error");
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    onLog?.("Wallet disconnected.", "info");
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      onLog?.("Address copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateInputs = () => {
    setError(null);
    try {
      if (!amount || parseFloat(amount) <= 0) throw new Error("Invalid amount");
      new PublicKey(recipient); // Will throw if invalid
      return true;
    } catch (err) {
      setError("Please enter a valid recipient address and amount.");
      return false;
    }
  };

  const handleSend = async () => {
    if (!smartWalletPubkey) return;
    setLoading(true);
    setError(null);

    try {
      onLog?.(`Initiating transfer of ${amount} SOL...`, "info");

      const toPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: toPubkey,
        lamports: Math.floor(lamports),
      });

      onLog?.("Step 1: Asking you to sign with Passkey...", "info");

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: 'USDC',
        }
      });

      onLog?.(`Success! Transfer Complete!`, "success");
      onLog?.(`Signature: ${signature}`, "info");
      
      // Refresh balance after successful transaction
      setTimeout(fetchBalance, 1000); // Small delay to ensure propagation
      setTimeout(fetchBalance, 3000); // Backup refresh
      
      // Reset form
      setAmount('');
      setRecipient('');
      
    } catch (err: any) {
      console.error(err);
      const msg = err.message || JSON.stringify(err);
      
      if (msg.includes("InstructionError") && msg.includes("Custom:1")) {
        onLog?.("Failed: Insufficient funds for transfer.", "error");
        setError("Insufficient funds.");
      } else if (msg.includes("Invalid public key")) {
        onLog?.("Failed: Invalid Recipient Address.", "error");
        setError("Invalid Recipient Address.");
      } else {
        onLog?.(`Failed: ${msg.slice(0, 100)}`, "error");
        setError("Transaction failed. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="bg-[#1a1d29] border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Wallet Connection</h2>
        </div>
        <button
          onClick={handleConnect}
          className="group relative w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-semibold py-4 px-6 rounded-xl transition-all shadow-xl active:scale-95"
        >
          <div className="bg-black/10 p-2 rounded-full">
            <Fingerprint className="w-5 h-5" />
          </div>
          <span className="text-lg">Log in with Passkey</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-4 h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Wallet className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Wallet Connection</h2>
      </div>

      {/* Connected Wallet Section */}
      <div className="mb-3">
        <div className="bg-[#0f1117] border border-white/5 rounded-lg p-3 relative group">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Connected Wallet</span>
              <p className="font-mono text-xs text-zinc-300 break-all">{address}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors shrink-0"
              title="Copy address"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            </button>
          </div>
          {copied && (
            <div className="absolute -top-6 right-0 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">
              Copied!
            </div>
          )}
        </div>
      </div>

      {/* Total Balance Section */}
      <div className="mb-4">
        <div className="bg-[#0f1117] border border-white/5 rounded-lg p-3 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Balance</span>
          <p className="text-lg font-bold text-white tracking-tight">
            {balance !== null ? balance.toFixed(4) : '...'} <span className="text-xs font-medium text-zinc-500 ml-1">SOL</span>
          </p>
        </div>
      </div>

      {/* Send Transaction Section */}
      <div className="border-t border-white/5 pt-4 mb-3 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-zinc-100 font-medium text-sm flex items-center gap-2">
            <Send size={14} className="text-indigo-400" />
            Send SOL
          </h3>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-mono">
            REAL TRANSFER
          </span>
        </div>

        <div className="space-y-3 mb-3">
          {/* Recipient Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana Address"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Amount (SOL)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.000000001"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-[10px]">
            <AlertCircle size={12} />
            {error}
          </div>
        )}

        <button
          onClick={() => {
            if (validateInputs()) setShowConfirm(true);
          }}
          disabled={loading || !recipient || !amount}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Review & Send <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="w-full flex items-center justify-center gap-1.5 bg-transparent hover:bg-red-500/10 text-red-500 font-medium py-2.5 px-4 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all mt-auto text-xs"
      >
        <LogOut className="w-3.5 h-3.5" />
        Disconnect
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-6 ring-1 ring-white/10 animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Transfer</h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-black/40 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Amount</span>
                <span className="text-2xl font-bold text-white max-w-full truncate">{amount} <span className="text-zinc-500 text-base font-normal">SOL</span></span>
              </div>
              
              <div className="p-3 bg-black/40 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">To</span>
                <span className="font-mono text-zinc-300 text-sm break-all text-left">
                  {recipient}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>Network Fee</span>
                <span className="text-emerald-400">Sponsored (Free)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  handleSend();
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-indigo-500/20"
              >
                Sign Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
