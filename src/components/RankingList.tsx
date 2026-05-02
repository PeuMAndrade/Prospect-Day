import { motion, AnimatePresence } from 'motion/react';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { Participant } from '../types';
import { cn } from '../lib/utils';

interface RankingListProps {
  participants: Participant[];
}

export function RankingList({ participants }: RankingListProps) {
  // Pegamos apenas a partir do 4º lugar
  const others = participants.slice(3);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pb-20">
      <div className="flex items-center gap-3 mb-6 px-4">
        <Users className="text-zinc-500" size={20} />
        <h2 className="text-xl font-bold text-zinc-300 uppercase tracking-[0.2em]">
          Ranking Geral
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {others.map((participant, index) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-900/40 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-800/50 transition-all duration-200"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Rank */}
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-zinc-800 flex items-center justify-center rounded-lg font-black text-zinc-500 text-sm md:text-base">
                  {participant.rank}º
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-bold text-zinc-200 uppercase tracking-tight group-hover:text-white transition-colors truncate">
                    {participant.nome}
                  </h4>
                </div>
              </div>

              {/* Stats - Stacks on extra small, goes row on sm+ */}
              <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-8 sm:pr-4 border-t sm:border-t-0 border-zinc-800/50 pt-3 sm:pt-0">
                <div className="flex flex-col items-start sm:items-end">
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-0.5">
                    <Calendar size={12} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Reuniões</span>
                  </div>
                  <span className="text-lg md:text-xl font-black text-white tabular-nums leading-none">
                    {participant.reunioes_marcadas}
                  </span>
                </div>

                <div className="flex flex-col items-end min-w-[80px] md:min-w-[100px]">
                  <div className="flex items-center gap-1.5 text-yellow-500/70 mb-0.5">
                    <TrendingUp size={12} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Pontos</span>
                  </div>
                  <span className="text-xl md:text-2xl font-black text-yellow-500 tabular-nums leading-none">
                    {participant.pontuacao}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {others.length === 0 && (
        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 font-medium italic">Aguardando mais participantes...</p>
        </div>
      )}
    </div>
  );
}
