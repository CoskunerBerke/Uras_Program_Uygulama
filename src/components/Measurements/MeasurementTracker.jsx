import React, { useState } from 'react';
import { Scale, Footprints, Ruler, TrendingUp } from 'lucide-react';

export default function MeasurementTracker({ measurements, onUpdateMeasurements }) {
  const [dailyWeights, setDailyWeights] = useState(measurements?.dailyWeights || {
    "Pazartesi": 69.1,
    "Salı": 69.0,
    "Çarşamba": 69.2,
    "Perşembe": 69.3,
    "Cuma": 69.1,
    "Cumartesi": 69.4,
    "Pazar": 69.2
  });

  const [dailySteps, setDailySteps] = useState(measurements?.dailySteps || {
    "Pazartesi": 9200,
    "Salı": 10400,
    "Çarşamba": 8500,
    "Perşembe": 9100,
    "Cuma": 11200,
    "Cumartesi": 7800,
    "Pazar": 8100
  });

  const [history, setHistory] = useState(measurements?.history || []);
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  const weightValues = Object.values(dailyWeights).filter(v => v > 0);
  const avgWeight = weightValues.length > 0 
    ? (weightValues.reduce((a, b) => a + parseFloat(b), 0) / weightValues.length).toFixed(2)
    : 0;

  const stepValues = Object.values(dailySteps).filter(v => v > 0);
  const avgSteps = stepValues.length > 0
    ? Math.round(stepValues.reduce((a, b) => a + parseInt(b), 0) / stepValues.length)
    : 0;

  const handleWeightChange = (day, val) => {
    const updated = { ...dailyWeights, [day]: parseFloat(val) || 0 };
    setDailyWeights(updated);
    onUpdateMeasurements({
      ...measurements,
      dailyWeights: updated
    });
  };

  const handleStepChange = (day, val) => {
    const updated = { ...dailySteps, [day]: parseInt(val) || 0 };
    setDailySteps(updated);
    onUpdateMeasurements({
      ...measurements,
      dailySteps: updated
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-slate-900 dark:text-white transition-colors">
      
      {/* 3'lü Özet Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">Haftalık Tartı Ortalaması</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {avgWeight} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">Günlük Adım Ortalaması</span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
              {avgSteps.toLocaleString()} <span className="text-xs font-normal text-slate-500">adım</span>
            </div>
          </div>
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <Footprints className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">Kilo Değişim Trendi</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              +0.40 <span className="text-xs font-normal text-slate-500">kg/hf</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Günlük Tartı & Adım */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-500 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-500" />
            Haftalık Aç Karnına Tartı Kaydı
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center">
                <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">{day}</span>
                <input
                  type="number"
                  step="0.1"
                  value={dailyWeights[day] || ''}
                  onChange={(e) => handleWeightChange(day, e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-500 flex items-center gap-1.5">
            <Footprints className="w-4 h-4 text-cyan-500" />
            Günlük Adım Sayısı (NEAT)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-center">
                <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">{day}</span>
                <input
                  type="number"
                  step="100"
                  value={dailySteps[day] || ''}
                  onChange={(e) => handleStepChange(day, e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bölgesel Ölçümler */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-xs uppercase text-slate-500 flex items-center gap-1.5">
          <Ruler className="w-4 h-4 text-amber-500" />
          Haftalık Bölgesel Vücut Çevre Ölçümleri (cm)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2 rounded-l-lg">Hafta</th>
                <th className="p-2">Tarih</th>
                <th className="p-2">Kilo</th>
                <th className="p-2">Boyun</th>
                <th className="p-2">Göğüs</th>
                <th className="p-2">Kol</th>
                <th className="p-2">Bel</th>
                <th className="p-2">Kalça</th>
                <th className="p-2">Bacak</th>
                <th className="p-2 rounded-r-lg">Kalf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((row) => (
                <tr key={row.week} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2 font-bold text-emerald-600 dark:text-emerald-400">H.{row.week}</td>
                  <td className="p-2 text-slate-500">{row.date}</td>
                  <td className="p-2 font-bold">{row.weight} kg</td>
                  <td className="p-2">{row.neck} cm</td>
                  <td className="p-2">{row.chest} cm</td>
                  <td className="p-2">{row.arm} cm</td>
                  <td className="p-2 font-bold text-amber-600 dark:text-amber-400">{row.waist} cm</td>
                  <td className="p-2">{row.hip} cm</td>
                  <td className="p-2">{row.thigh} cm</td>
                  <td className="p-2">{row.calf} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
