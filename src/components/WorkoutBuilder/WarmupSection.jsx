import React, { useState } from 'react';
import { Flame, Calculator, CheckCircle2, Circle, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateWarmupPyramid } from '../../data/defaultData';

export default function WarmupSection({ warmupPlan, onUpdateWarmupPlan }) {
  const [workingWeight, setWorkingWeight] = useState(warmupPlan?.calculator?.workingWeight || 100);
  const [activeTab, setActiveTab] = useState('pyramid'); // 'pyramid' | 'mcgill' | 'leg'

  const pyramid = calculateWarmupPyramid(workingWeight);

  const toggleLegWarmupItem = (index) => {
    const updated = [...(warmupPlan.legWarmup || [])];
    updated[index].done = !updated[index].done;
    onUpdateWarmupPlan({
      ...warmupPlan,
      legWarmup: updated
    });
  };

  const toggleMcgillItem = (index) => {
    const updated = [...(warmupPlan.mcGillBig3 || [])];
    updated[index].done = !updated[index].done;
    onUpdateWarmupPlan({
      ...warmupPlan,
      mcGillBig3: updated
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md shadow-amber-500/5">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
              Isınma Protokolleri & 1-5 RM Piramidi
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Sakatlık Önleme
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              E-Tablodaki McGill Big 3, dinamik bacak hareketleri ve bar yükleme hesaplayıcısı
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('pyramid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pyramid'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Bar Piramit Hesaplayıcı
          </button>
          <button
            onClick={() => setActiveTab('mcgill')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mcgill'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ McGill Big 3
          </button>
          <button
            onClick={() => setActiveTab('leg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leg'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🦵 Bacak & Kalça Isınması
          </button>
        </div>
      </div>

      {/* Tab 1: 1-5 Tekrar Isınma Piramidi Hesaplayıcı */}
      {activeTab === 'pyramid' && (
        <div className="space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-1">
                Çalışma Ağırlığınızı Girin (Working Set Weight):
              </span>
              <p className="text-xs text-slate-400">
                Bench Press, Squat veya Deadlift'te yapacağınız asıl ağırlığı yazın; sistem ısınma setlerinizi otomatik böler.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="500"
                step="2.5"
                value={workingWeight}
                onChange={(e) => setWorkingWeight(parseFloat(e.target.value) || 20)}
                className="w-28 bg-slate-800 border-2 border-amber-500/60 rounded-xl px-3 py-2 text-lg font-bold text-white text-center focus:outline-none focus:border-amber-400"
              />
              <span className="text-sm font-bold text-slate-300">kg</span>
            </div>
          </div>

          {/* Piramit Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pyramid.map((step) => (
              <div
                key={step.step}
                className={`p-4 rounded-xl border transition-all ${
                  step.isWorkingSet
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                    step.isWorkingSet ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    Adım {step.step}: {step.loadDesc}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {step.reps}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className={`text-2xl font-black ${step.isWorkingSet ? 'text-emerald-400' : 'text-white'}`}>
                    {step.weight}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                  {step.weight > 20 && (
                    <span className="text-[11px] text-slate-400 ml-2">
                      (Her yana: <strong>{((step.weight - 20) / 2).toFixed(1)} kg</strong>)
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 mt-2 italic">
                  💡 {step.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: McGill Big 3 */}
      {activeTab === 'mcgill' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-xs text-amber-300">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>
              <strong>Dr. Stuart McGill Protokolü:</strong> Omurga stabilitesini artırmak ve bel sakatlıklarını tamamen önlemek için her ağır idmandan önce zorunludur.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {warmupPlan?.mcGillBig3?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleMcgillItem(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  item.done
                    ? 'bg-slate-900/60 border-emerald-500/40 text-slate-400'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className={`text-sm font-bold block ${item.done ? 'line-through text-slate-500' : 'text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-xs text-amber-400/90 font-medium">
                      {item.reps}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Bacak & Kalça Isınması */}
      {activeTab === 'leg' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 text-xs text-blue-300">
            <Flame className="w-5 h-5 flex-shrink-0 text-blue-400" />
            <span>
              <strong>Bacak ve Kalça Dinamik Mobilizasyonu:</strong> Kalça mobilitesini, ayak bileği açısını ve diz eklemini squats/deadlifts için hazırlar.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {warmupPlan?.legWarmup?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleLegWarmupItem(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  item.done
                    ? 'bg-slate-900/60 border-emerald-500/40 text-slate-400'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className={`text-sm font-bold block ${item.done ? 'line-through text-slate-500' : 'text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      {item.reps}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
