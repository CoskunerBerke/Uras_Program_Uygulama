import React, { useState } from 'react';
import { Search, Plus, X, Dumbbell } from 'lucide-react';
import { allFlatExercises } from '../../data/exerciseDatabase';

export default function ExercisePickerModal({ isOpen, onClose, onSelectExercise }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const filtered = allFlatExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || ex.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSelectExercise({
      name: customName.trim(),
      defaultTempo: "2-0-1-0",
      defaultRir: "1",
      defaultRpe: "8.5",
      cue: "Forma odaklan.",
      category: "Özel"
    });
    setCustomName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Başlık */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base">Hareket Kütüphanesinden Ekle</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arama & Kategoriler */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-slate-50 dark:bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Hareket ara (Bench, Pull-Up, T-Bar, Squat, Curl)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
            {['All', 'Göğüs', 'Sırt', 'Omuz', 'Kollar', 'Bacak', 'Karın'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Hareket Listesi */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 max-h-[45vh]">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Hareket bulunamadı. Aşağıdan doğrudan özel isimle ekleyebilirsiniz.
            </div>
          ) : (
            filtered.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectExercise(ex);
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {ex.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {ex.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex gap-2">
                    <span>Tempo: <strong>{ex.defaultTempo}</strong></span>
                    <span>RIR: <strong>{ex.defaultRir}</strong></span>
                    <span>RPE: <strong>{ex.defaultRpe}</strong></span>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Özel Hareket Ekle */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <form onSubmit={handleCustomAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="Özel hareket adı yazın..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs"
            >
              Ekle
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
