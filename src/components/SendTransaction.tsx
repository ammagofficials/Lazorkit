import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Send, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface SendTransactionProps {
  onLog: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function SendTransaction({ onLog }: SendTransactionProps) {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form State
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      onLog(`Initiating transfer of ${amount} SOL...`, "info");

      const toPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: toPubkey,
        lamports: Math.floor(lamports),
      });

      onLog("Step 1: Asking you to sign with Passkey...", "info");

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: 'USDC', // Optional: Pay fees in USDC if not fully sponsored
        }
      });

      onLog(`Success! Transfer Complete!`, "success");
      onLog(`Signature: ${signature}`, "info");
      
      // Reset form
      setAmount('');
      setRecipient('');
      
    } catch (err: any) {
      console.error(err);
      const msg = err.message || JSON.stringify(err);
      
      if (msg.includes("InstructionError") && msg.includes("Custom:1")) {
        onLog("Failed: Insufficient funds for transfer.", "error");
        setError("Insufficient funds.");
      } else if (msg.includes("Invalid public key")) {
        onLog("Failed: Invalid Recipient Address.", "error");
        setError("Invalid Recipient Address.");
      } else {
        onLog(`Failed: ${msg.slice(0, 100)}`, "error");
        setError("Transaction failed. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-6 pt-6 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-100 font-medium flex items-center gap-2">
          <Send size={16} className="text-indigo-400" />
          Send Solana (Devnet)
        </h3>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
          REAL TRANSFER
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {/* Recipient Input */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana Address (Base58)"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Amount (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.000000001"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
          />
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <button
        onClick={() => {
          if (validateInputs()) setShowConfirm(true);
        }}
        disabled={loading || !recipient || !amount}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Review & Send <ArrowRight size={18} />
          </>
        )}
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
