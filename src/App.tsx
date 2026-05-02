import { motion } from 'motion/react';
import { RefreshCw, Phone, Clock } from 'lucide-react';
import { useSheetData } from './hooks/useSheetData';
import { ProgressBar } from './components/ProgressBar';
import { Podium } from './components/Podium';
import { RankingList } from './components/RankingList';

export default function App() {
  const sheetUrl = (import.meta.env.VITE_GOOGLE_SHEETS_JSON_URL as string | undefined)?.trim();
  const { data, loading, error, refetch } = useSheetData(sheetUrl);

  const topThree = data?.participants.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px]" />
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 flex border-b border-zinc-900 bg-black/50 backdrop-blur-xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-yellow-500 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            <Phone className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
              CIMATECJR
            </h1>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              PROSPECT DAY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {data && (
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Atualizado em</span>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-300">
                {data.lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
          
          <button 
            onClick={() => refetch()}
            disabled={loading}
            className="p-2.5 rounded-full hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={loading ? "animate-spin text-yellow-500" : "text-zinc-400"} size={20} />
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full">
        {/* Top Progress Section */}
        {data && (
          <ProgressBar 
            current={data.totalMeetings} 
            goal={data.goal} 
          />
        )}

        <div className="max-w-7xl mx-auto py-12">
          {/* Central Podium */}
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"
              />
              <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                Carregando dados da batalha...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="p-4 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20">
                <span className="text-red-500 font-bold">Erro: {error}</span>
              </div>
              <button 
                onClick={() => refetch()}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full font-bold transition-all"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {/* Podium Hero */}
              <Podium topThree={topThree} />

              {/* Ranking List Section */}
              <RankingList participants={data.participants} />
            </>
          )}
        </div>
      </main>

      {/* Footer Info for TV */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-zinc-900/50 flex justify-center items-center z-20 md:hidden">
         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
            Prospect Day © 2026 • Live Dashboard
         </p>
      </footer>
    </div>
  );
}
