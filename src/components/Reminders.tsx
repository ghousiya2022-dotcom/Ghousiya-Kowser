import { Bell, Check, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface Reminder {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  priority: 'low' | 'high';
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Blood Pressure Check', time: '08:00 AM', completed: false, priority: 'high' },
    { id: '2', text: 'Statin Medication', time: '09:00 PM', completed: false, priority: 'low' },
    { id: '3', text: 'Hydration Goal (2L)', time: 'ALL DAY', completed: true, priority: 'low' },
  ]);

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <h3 className="font-bold text-white uppercase text-[10px] tracking-[0.2em] opacity-50">Health Reminders</h3>
        </div>
        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar flex-grow">
        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              layout
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => toggleComplete(reminder.id)}
              className={cn(
                "group p-4 bg-zinc-950/50 border rounded-2xl cursor-pointer transition-all flex items-center gap-4",
                reminder.completed 
                  ? "border-zinc-800/30 opacity-50" 
                  : reminder.priority === 'high' 
                    ? "border-orange-500/20 hover:border-orange-500/40" 
                    : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                reminder.completed 
                  ? "bg-emerald-500 border-emerald-500 text-white" 
                  : "border-zinc-800 bg-zinc-900 group-hover:border-zinc-600"
              )}>
                {reminder.completed && <Check className="w-3 h-3" />}
              </div>

              <div className="flex-grow">
                <p className={cn(
                  "text-sm font-medium tracking-tight",
                  reminder.completed ? "text-zinc-500 line-through" : "text-white"
                )}>
                  {reminder.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{reminder.time}</span>
                </div>
              </div>

              {!reminder.completed && reminder.priority === 'high' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
