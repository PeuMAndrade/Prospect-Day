import { motion } from 'motion/react';
import { Target } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  goal: number;
}

export function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="w-full bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Info Total */}
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="flex items-center gap-2 text-zinc-400 text-xs md:text-sm font-medium uppercase tracking-widest mb-1">
            <Target size={14} className="text-yellow-500 md:w-4 md:h-4" />
            Meta Coletiva
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-black text-white tabular-nums leading-none">
              {current}
            </span>
            <span className="text-xl md:text-2xl font-bold text-zinc-500">
              / {goal}
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="flex-1 w-full flex flex-col gap-2 md:gap-3">
          <div className="h-6 md:h-8 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50 shadow-inner relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 relative shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Percentage Label Inside */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-tighter text-white drop-shadow-md">
                {percentage}% da Meta Alcançada
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
            <span>Início</span>
            <span>PRA CIMAAAA</span>
            <span>Meta Atingida!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
