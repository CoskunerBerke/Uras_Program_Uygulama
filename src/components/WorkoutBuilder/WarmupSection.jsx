import React, { useState } from 'react';
import { Flame, Calculator, CheckCircle2, Circle, ShieldAlert } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 text-slate-900 dark:text-white transition-colors">
      
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Isınma & 1-5 RM Bar Piramidi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">McGill Big 3 ve çalışma ağırlığına göre hesaplanan ısınma basamakları</p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pyramid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pyramid'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔥 Bar Piramidi
          </button>
          <button
            onClick={() => setActiveTab('mcgill')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mcgill'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🛡️ McGill Big 3
          </button>
          <button
            onClick={() => setActiveTab('leg')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leg'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🦵 Bacak Isınması
          </button>
        </div>
      </div>

      {/* Piramit Hesaplayıcı */}
      {activeTab === 'pyramid' && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-amber-400 block">
                Çalışma Ağırlığınız (Working Weight):
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hedef seti yazın, boş bardan itibaren basamaklar otomatik hesaplansın.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="20"
                max="500"
                step="2.5"
                value={workingWeight}
                onChange={(e) => setWorkingWeight(parseFloat(e.target.value) || 20)}
                className="w-20 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 text-base font-bold text-center focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">kg</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {pyramid.map((step) => (
              <div
                key={step.step}
                className={`p-3 rounded-xl border text-xs ${
                  step.isWorkingSet
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    step.isWorkingSet ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {step.loadDesc}
                  </span>
                  <span className="font-semibold text-slate-500">{step.reps}</span>
                </div>
                <div className="text-xl font-black mt-1">
                  {step.weight} <span className="text-xs font-normal text-slate-500">kg</span>
                  {step.weight > 20 && (
                    <span className="text-[10px] text-slate-400 font-normal ml-2">
                      (Yana: {((step.weight - 20) / 2).toFixed(1)} kg)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* McGill Big 3 */}
      {activeTab === 'mcgill' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {warmupPlan?.mcGillBig3?.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleMcgillItem(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                item.done
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-300 dark:border-emerald-500/30 text-slate-400'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
                <div>
                  <span className={`font-bold block ${item.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.name}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">{item.reps}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bacak Isınması */}
      {activeTab === 'leg' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {warmupPlan?.legWarmup?.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleLegWarmupItem(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                item.done
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-300 dark:border-emerald-500/30 text-slate-400'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
                <div>
                  <span className={`font-bold block ${item.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.name}
                  </span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400">{item.reps}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
