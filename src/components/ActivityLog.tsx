import { Terminal } from 'lucide-react';

export interface LogItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

export function ActivityLog({ logs, className = "" }: { logs: LogItem[], className?: string }) {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-3 text-zinc-500 text-xs font-mono uppercase tracking-wider shrink-0">
        <Terminal size={14} />
        <span>Activity Console</span>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-4 flex-1 min-h-[300px] lg:min-h-[500px] max-h-[600px] overflow-y-auto custom-scrollbar font-mono text-sm shadow-inner">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic opacity-50">
            <span>Waiting for user interaction...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-fade-in-up">
                <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`break-words
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-rose-400' : ''}
                  ${log.type === 'info' ? 'text-blue-300' : ''}
                `}>
                  {log.type === 'success' && '✓ '}
                  {log.type === 'error' && '✕ '}
                  {log.type === 'info' && '➜ '}
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
