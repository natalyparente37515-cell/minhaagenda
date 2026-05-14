import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Priority, StudySession } from '../types';
import { cn } from '../lib/utils';

interface AddSessionFormProps {
  onAdd: (session: Omit<StudySession, 'id' | 'completed'>) => void;
  onClose: () => void;
}

export function AddSessionForm({ onAdd, onClose }: AddSessionFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(45);
  const [priority, setPriority] = useState<Priority>('medium');
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    onAdd({
      title,
      subject,
      duration,
      priority,
      startTime: new Date(time).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border-2 border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agendar Estudo</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">O que você vai estudar?</label>
            <input
              autoFocus
              type="text"
              required
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-indigo-100 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300"
              placeholder="Ex: Revisão de Álgebra"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Matéria</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-indigo-100 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300"
              placeholder="Ex: Matemática"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Duração (min)</label>
              <input
                type="number"
                required
                min="5"
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-indigo-100 focus:bg-white transition-all font-medium text-slate-900"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Horário</label>
              <input
                type="datetime-local"
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-indigo-100 focus:bg-white transition-all font-medium text-slate-900 text-sm"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Prioridade</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    priority === p 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={20} />
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
}
