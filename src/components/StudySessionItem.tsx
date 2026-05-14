import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { StudySession } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudySessionItemProps {
  session: StudySession;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StudySessionItem: React.FC<StudySessionItemProps> = ({ session, onToggle, onDelete }) => {
  return (
    <div className={cn(
      "group flex items-center gap-6 p-4 rounded-3xl border transition-all",
      session.completed 
        ? "bg-slate-50 border-slate-100 opacity-60" 
        : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 ring-indigo-500/10 hover:ring-2"
    )}>
      <div className="w-16 hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
        {format(new Date(session.startTime), "HH:mm")}
      </div>

      <div className={cn(
        "w-1 h-10 rounded-full shrink-0",
        session.completed ? "bg-slate-300" : 
        session.priority === 'high' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" : 
        "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
      )} />

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-bold text-slate-800 truncate",
          session.completed && "line-through text-slate-400"
        )}>
          {session.title}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <span className={cn(
            "text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md",
            session.completed ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"
          )}>
            {session.subject}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <Clock size={10} />
            {session.duration}min
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onToggle(session.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            session.completed 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white"
          )}
        >
          {session.completed ? "Feito" : "Concluir"}
        </button>
        
        <button 
          onClick={() => onDelete(session.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
