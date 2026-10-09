import React, { useState } from 'react';
import { LineChart, Scale, Footprints, Ruler, TrendingUp, Calendar, Plus } from 'lucide-react';

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

  // Haftalık Tartı Ortalaması
  const weightValues = Object.values(dailyWeights).filter(v => v > 0);
  const avgWeight = weightValues.length > 0 
    ? (weightValues.reduce((a, b) => a + parseFloat(b), 0) / weightValues.length).toFixed(2)
    : 0;

  // Haftalık Adım Ortalaması
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
    <div className="space-y-6">
      
      {/* Üst Kartlar: Haftalık Tartı Ortalaması & Adım Ortalaması */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400">Bu Haftanın Tartı Ortalaması</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-emerald-400">{avgWeight}</span>
              <span className="text-sm font-bold text-slate-400">kg</span>
            </div>
            <span className="text-[11px] text-slate-500">Günlük dalgalanmalar elenmiş net ağırlık</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400">Haftalık Günlük Adım Ortalaması</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-cyan-400">{avgSteps.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-400">adım</span>
            </div>
            <span className="text-[11px] text-slate-500">NEAT & Günlük kalori harcaması takibi</span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <Footprints className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400">Kilo Değişim Trendi</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-400">+0.40</span>
              <span className="text-sm font-bold text-slate-400">kg / hafta</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">✓ Temiz Bulk aralığında (+%0.5 BW)</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Günlük Tartı & Adım Girişi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tartı Takip Tablosu */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Haftalık Günlük Aç Karnına Tartı Kaydı
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 text-center">
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">{day}</span>
                <input
                  type="number"
                  step="0.1"
                  value={dailyWeights[day] || ''}
                  onChange={(e) => handleWeightChange(day, e.target.value)}
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg py-1 px-1.5 text-center text-sm font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Adım Takip Tablosu */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Footprints className="w-5 h-5 text-cyan-400" />
            Günlük Adım Sayısı (NEAT) Takibi
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 text-center">
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">{day}</span>
                <input
                  type="number"
                  step="100"
                  value={dailySteps[day] || ''}
                  onChange={(e) => handleStepChange(day, e.target.value)}
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-lg py-1 px-1.5 text-center text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bölgesel Çevre Ölçümleri (Haftalık Check-In) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
          <Ruler className="w-5 h-5 text-amber-400" />
          Haftalık Bölgesel Vücut Ölçümleri (Mezura)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 rounded-l-lg">Hafta</th>
                <th className="p-2.5">Tarih</th>
                <th className="p-2.5">Kilo (kg)</th>
                <th className="p-2.5">Boyun</th>
                <th className="p-2.5">Göğüs</th>
                <th className="p-2.5">Kol</th>
                <th className="p-2.5">Bel</th>
                <th className="p-2.5">Kalça</th>
                <th className="p-2.5">Bacak</th>
                <th className="p-2.5 rounded-r-lg">Kalf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {history.map((row) => (
                <tr key={row.week} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-emerald-400">Hafta {row.week}</td>
                  <td className="p-2.5 text-slate-400">{row.date}</td>
                  <td className="p-2.5 font-bold text-white">{row.weight} kg</td>
                  <td className="p-2.5 text-slate-300">{row.neck} cm</td>
                  <td className="p-2.5 text-slate-300">{row.chest} cm</td>
                  <td className="p-2.5 text-slate-300">{row.arm} cm</td>
                  <td className="p-2.5 font-bold text-amber-300">{row.waist} cm</td>
                  <td className="p-2.5 text-slate-300">{row.hip} cm</td>
                  <td className="p-2.5 text-slate-300">{row.thigh} cm</td>
                  <td className="p-2.5 text-slate-300">{row.calf} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
