import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, Star } from 'lucide-react';
import { Participant } from '../types';
import { cn } from '../lib/utils';

interface PodiumProps {
  topThree: Participant[];
}

export function Podium({ topThree }: PodiumProps) {
  // No mobile, exibimos na ordem 1, 2, 3. No desktop, a ordem visual do pódio (2, 1, 3)
  const displayOrder = [...topThree].sort((a, b) => {
    // Ordem personalizada para desktop via CSS 'order' ou reordenando o array
    return (a.rank || 0) - (b.rank || 0);
  });

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 lg:gap-8 min-h-max md:min-h-[450px] mb-12 px-4">
      <AnimatePresence mode="popLayout">
        {displayOrder.map((participant, index) => {
          const isGold = participant.rank === 1;
          const isSilver = participant.rank === 2;
          const isBronze = participant.rank === 3;

          return (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.1 
              }}
              style={{
                // Desktop: Prata (1), Ouro (2), Bronze (3)
                // Mobile: Ouro (1), Prata (2), Bronze (3) - padrão do map
              }}
              className={cn(
                "relative flex flex-col items-center text-center group w-full md:w-auto",
                isGold ? "md:order-2 md:w-80" : isSilver ? "md:order-1 md:w-64" : "md:order-3 md:w-64",
                "max-w-sm md:max-w-none" // Previne que o card fique gigante em telas médias
              )}
            >
              {/* Badge/Icon - Ajustado tamanho para mobile */}
              <div className={cn(
                "mb-4 p-3 md:p-4 rounded-full border-2 transition-transform duration-500 group-hover:scale-110",
                isGold && "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)]",
                isSilver && "bg-zinc-400/20 border-zinc-400 text-zinc-300",
                isBronze && "bg-orange-700/20 border-orange-700 text-orange-400"
              )}>
                {isGold && <Crown className="w-8 h-8 md:w-12 md:h-12" />}
                {isSilver && <Trophy className="w-6 h-6 md:w-8 md:h-8" />}
                {isBronze && <Star className="w-6 h-6 md:w-8 md:h-8" />}
              </div>

              {/* Name & Score Card */}
              <div className={cn(
                "w-full p-5 md:p-6 rounded-2xl backdrop-blur-sm border transition-colors duration-300",
                isGold ? "bg-zinc-900/80 border-yellow-500/50" : "bg-zinc-900/60 border-zinc-800"
              )}>
                <h3 className={cn(
                  "font-black uppercase tracking-tight line-clamp-1 mb-1",
                  isGold ? "text-2xl md:text-3xl text-yellow-500" : "text-lg md:text-xl text-white"
                )}>
                  {participant.nome}
                </h3>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-black text-white tabular-nums",
                    isGold ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                  )}>
                    {participant.pontuacao}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Pontos totais
                  </span>
                </div>
                
                {/* Stats Section - Melhorada para mobile */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center text-zinc-400 px-2 gap-4">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-xs md:text-sm font-bold text-white">{participant.reunioes_marcadas}</span>
                    <span className="text-[8px] md:text-[10px] uppercase font-bold text-zinc-600">Reuniões</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] uppercase font-bold text-zinc-600">Posição</span>
                     <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-xs text-white">
                        {participant.rank}º
                     </div>
                  </div>
                </div>
              </div>

              {/* Base height for podium effect - Oculto no Mobile para economizar espaço */}
              <div className={cn(
                "hidden md:block mt-4 w-full rounded-t-lg bg-zinc-800/20 border-x border-t border-zinc-700/30",
                isGold ? "h-32" : isSilver ? "h-20" : "h-12"
              )} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
