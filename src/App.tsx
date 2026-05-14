import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, LayoutDashboard, Calendar as CalendarIcon, Settings, User, Trophy, Flame, BookOpen, Clock } from 'lucide-react';
import { StudySession, UserStats } from './types';
import { PomodoroTimer } from './components/PomodoroTimer';
import { StudySessionItem } from './components/StudySessionItem';
import { AddSessionForm } from './components/AddSessionForm';
import { getStudyAdvice } from './lib/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('study_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('study_stats');
    return saved ? JSON.parse(saved) : { sessionsCompleted: 0, totalStudyTime: 0, currentStreak: 0 };
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('study_sessions', JSON.stringify(sessions));
    localStorage.setItem('study_stats', JSON.stringify(stats));
  }, [sessions, stats]);

  const handleAddSession = (newSession: Omit<StudySession, 'id' | 'completed'>) => {
    const session: StudySession = {
      ...newSession,
      id: Math.random().toString(36).substring(7),
      completed: false,
    };
    setSessions([session, ...sessions]);
  };

  const handleToggleSession = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        const newState = !s.completed;
        if (newState) {
          setStats(prev => ({
            ...prev,
            sessionsCompleted: prev.sessionsCompleted + 1,
            totalStudyTime: prev.totalStudyTime + s.duration
          }));
        } else {
          setStats(prev => ({
            ...prev,
            sessionsCompleted: Math.max(0, prev.sessionsCompleted - 1),
            totalStudyTime: Math.max(0, prev.totalStudyTime - s.duration)
          }));
        }
        return { ...s, completed: newState };
      }
      return s;
    }));
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const fetchAdvice = async () => {
    setIsAdviceLoading(true);
    const result = await getStudyAdvice(sessions);
    setAdvice(result);
    setIsAdviceLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar - Navigation */}
      <nav className="w-full md:w-24 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex md:flex-col items-center justify-between p-4 md:py-10 sticky top-0 z-40">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-[1.25rem] shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
          <BookSquare className="text-white" size={24} />
        </div>
        
        <div className="flex md:flex-col gap-8">
          <NavItem icon={<LayoutDashboard size={22} />} active />
          <NavItem icon={<CalendarIcon size={22} />} />
          <NavItem icon={<Trophy size={22} />} />
          <NavItem icon={<Settings size={22} />} />
        </div>

        <div className="hidden md:block">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden hover:border-indigo-200 transition-colors cursor-pointer">
             <User size={18} className="text-slate-400" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Estudos de Hoje</h1>
            <p className="text-slate-500 font-medium font-sans">Você tem {sessions.filter(s => !s.completed).length} sessões pendentes. Vamos lá!</p>
          </div>
          <div className="flex gap-3">
            <div className="hidden sm:flex bg-white border border-slate-200 px-5 py-2 rounded-full shadow-sm text-sm font-bold text-slate-700 items-center gap-2 font-sans">
              <Trophy size={16} className="text-amber-500" />
              Meta: {stats.sessionsCompleted}/10
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-sm font-sans"
            >
              <Plus size={18} />
              Novo Bloco
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6">
          {/* Main Schedule Container */}
          <div className="md:col-span-7 md:row-span-4 bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">Cronograma</h2>
              <span className="text-indigo-600 font-bold text-sm cursor-pointer hover:underline">Ver tudo</span>
            </div>
            
            <div className="space-y-4 flex-1">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                    <BookOpen className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-400 font-medium max-w-[200px]">Sua lista de estudos está vazia por enquanto.</p>
                </div>
              ) : (
                sessions.map(session => (
                  <StudySessionItem 
                    key={session.id} 
                    session={session} 
                    onToggle={handleToggleSession}
                    onDelete={handleDeleteSession}
                  />
                ))
              )}
            </div>
          </div>

          {/* Pomodoro Timer Bento Cell */}
          <div className="md:col-span-5 md:row-span-2">
            <PomodoroTimer />
          </div>

          {/* Stats Cells */}
          <div className="md:col-span-2 md:row-span-2">
            <StatCard 
              label="Ofensiva" 
              value="5 Dias" 
              icon={<Flame size={20} />} 
              color="orange" 
            />
          </div>
          <div className="md:col-span-3 md:row-span-2">
            <StatCard 
              label="Completadas" 
              value={stats.sessionsCompleted.toString()} 
              icon={<BookOpen size={20} />} 
              color="blue" 
            />
          </div>

          {/* AI Advisor Bento Cell */}
          <section className="md:col-span-5 md:row-span-2 bg-slate-900 text-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-indigo-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Mentor Estratégico</h3>
              </div>
              
              <p className="text-lg font-medium leading-relaxed italic text-slate-100 h-24 overflow-y-auto custom-scrollbar">
                {advice || "\"A persistência é o único caminho para o êxito que nunca falha.\""}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
              <button 
                onClick={fetchAdvice}
                disabled={isAdviceLoading}
                className="px-4 py-2 bg-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-900/20"
              >
                {isAdviceLoading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Insights
              </button>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gemini AI</p>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
          </section>

          {/* Resources Bento Cell (Added for visual balance to match the design style) */}
          <div className="md:col-span-7 md:row-span-2 bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex gap-10 items-center overflow-hidden">
            <div className="flex-1 space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ferramentas</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="block text-xl mb-1 group-hover:scale-125 transition-transform">📚</span>
                  <span className="text-[10px] font-bold text-slate-600">LIVROS</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="block text-xl mb-1 group-hover:scale-125 transition-transform">🧪</span>
                  <span className="text-[10px] font-bold text-slate-600">LAB</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="block text-xl mb-1 group-hover:scale-125 transition-transform">📝</span>
                  <span className="text-[10px] font-bold text-slate-600">NOTAS</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
            <div className="hidden lg:flex w-48 flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest text-center">Foco Semanal</span>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={cn("w-3 h-3 rounded-full", i <= 3 ? "bg-indigo-600" : "bg-slate-200")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <AddSessionForm 
            onAdd={handleAddSession} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "p-3 rounded-2xl transition-all relative group",
      active ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
    )}>
      {icon}
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full hidden md:block" />}
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'blue' | 'purple' | 'orange' }) {
  const colors = {
    blue: "text-indigo-600 bg-indigo-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-indigo-100 transition-all cursor-default">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 group-hover:rotate-6", colors[color])}>
        {icon}
      </div>
      <span className="text-2xl font-black text-slate-900">{value}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{label}</span>
    </div>
  );
}

function BookSquare({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
    </svg>
  );
}
