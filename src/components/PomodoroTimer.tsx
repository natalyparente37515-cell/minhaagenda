import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (mode === 'study') {
      alert('Sessão de estudos concluída! Hora de um descanso.');
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      alert('Descanso terminado! Vamos voltar ao trabalho.');
      setMode('study');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col justify-between h-full shadow-xl relative overflow-hidden",
      mode === 'study' ? "bg-indigo-950 text-white" : "bg-emerald-950 text-white"
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full -mr-10 -mt-10",
        mode === 'study' ? "bg-indigo-500" : "bg-emerald-500"
      )} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
            {mode === 'study' ? 'Foco Atual' : 'Descanso'}
          </h3>
          {mode === 'study' ? <BookOpen size={16} className="text-indigo-400" /> : <Coffee size={16} className="text-emerald-400" />}
        </div>
        <p className="text-lg font-bold">Concentração</p>
        <p className={cn(
          "text-xs mt-1",
          mode === 'study' ? "text-indigo-300" : "text-emerald-300"
        )}>
          {mode === 'study' ? 'Sessão de Estudo Ativa' : 'Recuperando energias'}
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between mt-8">
        <motion.div 
          key={timeLeft}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-5xl font-mono font-light tracking-tighter"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.div>

        <div className="flex gap-2">
          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 transition-all font-bold text-xs"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95",
              isActive 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-white text-indigo-950"
            )}
          >
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
      </div>
    </div>
  );
}
