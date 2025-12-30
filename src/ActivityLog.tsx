import { Terminal } from 'lucide-react';

interface LogItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

export function ActivityLog({ logs }: { logs: LogItem[] }) {
  return (
    <div className="mt-6 w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-mono uppercase tracking-wider">
        <Terminal size={14} />
        <span>Activity Console</span>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-sm shadow-inner">
        {logs.length === 0 ? (
          <div className="text-zinc-700 italic opacity-50 text-center mt-12">
            Waiting for user interaction...
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-pulse-slow">
                <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-rose-400' : ''}
                  ${log.type === 'info' ? 'text-blue-300' : ''}
                  break-all
                `}>
                  {log.type === 'success' && '✓ '}
                  {log.type === 'error' && '✕ '}
                  {log.type === 'info' && 'ℹ '}
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}