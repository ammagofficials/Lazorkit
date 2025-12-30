import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ActionPanelProps {
  onAction: () => Promise<void>;
}

export const ActionPanel = ({ onAction }: ActionPanelProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onAction();
    setLoading(false);
  };

  return (
    <div className="border-t border-white/5 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Zap size={14} className="text-indigo-400" />
          </div>
          Gasless Demo
        </h3>
        <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          SPONSORED
        </span>
      </div>

      <div className="glass-card rounded-2xl p-1">
        <div className="bg-zinc-900/40 rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Action</span>
            <span className="text-xs font-medium text-zinc-300">Transfer Token</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-zinc-500">Amount</span>
            <span className="text-sm font-bold text-white font-mono">0.1 USDC</span>
          </div>
          
          <button 
            onClick={handleClick}
            disabled={loading}
            className="btn-action w-full relative overflow-hidden group"
          >
             {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              <>
                Send 0.1 USDC
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <div className="flex justify-center mt-3 gap-1.5 align-middle">
            <Zap size={10} className="text-indigo-500 mt-0.5" />
            <p className="text-[10px] text-zinc-500 text-center">
              Network fees paid by Lazorkit Relayer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
