import { Terminal } from 'lucide-react';

export const Header = () => {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-xl shadow-lg">
          <Terminal size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Lazorkit Starter
          </h1>
          <p className="text-xs text-zinc-500 font-medium tracking-wide">PREMIUM DEMO</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-emerald-400 tracking-wide">Devnet Active</span>
      </div>
    </div>
  );
};
