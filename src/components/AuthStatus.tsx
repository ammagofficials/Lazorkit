import { Wallet, LogOut, Loader2, CreditCard } from 'lucide-react';

interface AuthStatusProps {
  isConnected: boolean;
  walletAddress: string;
  balance: number;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const AuthStatus = ({ 
  isConnected, 
  walletAddress, 
  balance, 
  isConnecting,
  onConnect, 
  onDisconnect 
}: AuthStatusProps) => {
  if (!isConnected) {
    return (
      <div className="text-center py-16 relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-6 inline-flex p-5 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl shadow-xl">
            <Wallet size={32} className="text-indigo-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Connect Wallet</h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-xs mx-auto leading-relaxed">
            Authenticates strictly via Passkeys. No seed phrases, no extensions.
          </p>
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="btn-connect w-full max-w-xs"
          >
            {isConnecting ? (
              <>
                <Loader2 className="animate-spin text-zinc-600" size={18} />
                <span className="text-zinc-600">Secure Handshake...</span>
              </>
            ) : (
              'Log in with Passkey'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="p-4 glass-card rounded-2xl relative group transition-all hover:bg-zinc-800/60">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block flex items-center gap-1">
          <Wallet size={10} /> Wallet Address
        </label>
        <div className="font-mono text-sm text-zinc-200 truncate group-hover:text-white transition-colors">
          {walletAddress}
        </div>
      </div>
      
      <div className="p-4 glass-card rounded-2xl relative group transition-all hover:bg-zinc-800/60">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block flex items-center gap-1">
          <CreditCard size={10} /> USDC Balance
        </label>
        <div className="font-mono text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors">
          {balance.toFixed(2)} <span className="text-xs text-zinc-600">USDC</span>
        </div>
      </div>
      
      <div className="col-span-2 flex justify-end pt-2">
        <button 
          onClick={onDisconnect}
          className="btn-ghost"
        >
          <LogOut size={14} />
          Disconnect Session
        </button>
      </div>
    </div>
  );
};
