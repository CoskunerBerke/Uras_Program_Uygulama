import React, { useState } from 'react';
import { Search, Plus, X, Dumbbell, Sparkles } from 'lucide-react';
import { exerciseCategories, allFlatExercises } from '../../data/exerciseDatabase';

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
      cue: "Forma ve kasa odaklan.",
      category: "Özel"
    });
    setCustomName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg">Hareket Kütüphanesinden Ekle</h3>
              <p className="text-xs text-slate-400">Hazır bilimsel hareketleri seçin veya özel bir hareket ekleyin</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Hareket ara (örn: Bench, Pull-Up, T-Bar, Curl)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Göğüs', 'Sırt', 'Omuz', 'Kollar', 'Bacak', 'Karın'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[45vh]">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Eşleşen hareket bulunamadı. Aşağıdan özel olarak ekleyebilirsiniz.
            </div>
          ) : (
            filtered.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectExercise(ex);
                  onClose();
                }}
                className="group p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {ex.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300">
                      {ex.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Tempo: <strong className="text-slate-300">{ex.defaultTempo}</strong></span>
                    <span>Hedef RIR: <strong className="text-slate-300">{ex.defaultRir}</strong></span>
                    <span>RPE: <strong className="text-slate-300">{ex.defaultRpe}</strong></span>
                  </div>
                  {ex.cue && (
                    <p className="text-[11px] text-slate-500 italic">💡 {ex.cue}</p>
                  )}
                </div>
                <button className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Custom Exercise Adder */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form onSubmit={handleCustomAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="Listede yok mu? Özel hareket ismi yazın..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Özel Ekle
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
