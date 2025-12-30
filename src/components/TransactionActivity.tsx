import { Activity, RefreshCw } from 'lucide-react';

interface LogItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

interface TransactionActivityProps {
  logs: LogItem[];
}

export function TransactionActivity({ logs }: TransactionActivityProps) {
  return (
    <div className="bg-[#1a1d29] border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Transaction Activity</h2>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-zinc-400 hover:text-white" />
        </button>
      </div>

      {/* Activity Log Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1117] rounded-xl p-4 border border-white/5">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic opacity-50">
            <span>Waiting for user interaction...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-fade-in-up">
                <span className="text-zinc-600 shrink-0 select-none font-mono text-xs">[{log.timestamp}]</span>
                <span className={`break-words text-sm ${
                  log.type === 'success' ? 'text-emerald-400' : ''
                }${
                  log.type === 'error' ? 'text-rose-400' : ''
                }${
                  log.type === 'info' ? 'text-blue-300' : ''
                }`}>
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
