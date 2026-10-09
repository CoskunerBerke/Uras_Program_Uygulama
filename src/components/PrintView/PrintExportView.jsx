import React from 'react';
import { Dumbbell, Utensils, Flame, Scale, Clock, Check } from 'lucide-react';

export default function PrintExportView({ client }) {
  const workout = client.workoutProgram;
  const nutrition = client.nutritionPlan;
  const stats = client.stats;

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 min-h-screen text-xs">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            CoachFit Pro - Antrenman & Beslenme Programı
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Özel Hazırlanan Bilimsel Hipertrofi & Makro Raporu
          </p>
        </div>
        <div className="text-right text-xs">
          <p><strong>Danışan:</strong> {client.name}</p>
          <p><strong>Hedef:</strong> {client.goal}</p>
          <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
          <p><strong>Boy / Kilo:</strong> {stats.heightCm} cm / {stats.weightKg} kg</p>
        </div>
      </div>

      {/* 1. Antrenman Programı */}
      <div className="mb-8">
        <h2 className="text-base font-black uppercase border-b border-slate-300 pb-1 mb-3 text-slate-800">
          🏋️ Antrenman Programı: {workout.splitName}
        </h2>

        <div className="space-y-6">
          {(workout.days || []).map((day, dIdx) => (
            <div key={dIdx} className="break-inside-avoid">
              <div className="bg-slate-100 p-2 rounded font-bold text-xs uppercase flex justify-between mb-2">
                <span>{day.dayName}: {day.title}</span>
                <span>{day.focus}</span>
              </div>

              {day.isRestDay ? (
                <p className="italic text-slate-500 py-1">Dinlenme Günü (Rest Day) - 8.000+ adım ve hidrasyon.</p>
              ) : (
                <table className="w-full text-left border-collapse mb-3">
                  <thead>
                    <tr className="border-b border-slate-300 text-[10px] uppercase text-slate-600">
                      <th className="py-1">#</th>
                      <th className="py-1">Hareket İsmi</th>
                      <th className="py-1">Set x Tekrar</th>
                      <th className="py-1">Hedef Ağırlık</th>
                      <th className="py-1">RIR / RPE</th>
                      <th className="py-1">Tempo</th>
                      <th className="py-1">Dinlenme</th>
                      <th className="py-1">Koç Notu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(day.exercises || []).map((ex, eIdx) => (
                      <tr key={eIdx} className="py-1.5">
                        <td className="py-1 text-slate-400 font-bold">{eIdx + 1}</td>
                        <td className="py-1 font-bold text-slate-900">{ex.name}</td>
                        <td className="py-1 font-semibold">{ex.sets} x {ex.targetReps}</td>
                        <td className="py-1 font-bold">{ex.targetWeight || '-'}</td>
                        <td className="py-1">{ex.rir} / {ex.rpe}</td>
                        <td className="py-1">{ex.tempo || '2-1-0'}</td>
                        <td className="py-1">{ex.rest || '90 sn'}</td>
                        <td className="py-1 italic text-slate-600">{ex.coachNotes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Diyet & Makro / Mikro */}
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-base font-black uppercase border-b border-slate-300 pb-1 mb-3 text-slate-800">
          🥗 Beslenme Planı & Makrolar
        </h2>

        <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded mb-4 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Hedef Kalori</span>
            <strong className="text-lg text-slate-900">{nutrition.targetKcal} kcal</strong>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Protein</span>
            <strong className="text-lg text-slate-900">{nutrition.macroTargets?.proteinG}g</strong>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Karbonhidrat</span>
            <strong className="text-lg text-slate-900">{nutrition.macroTargets?.carbG}g</strong>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">Yağ</span>
            <strong className="text-lg text-slate-900">{nutrition.macroTargets?.fatG}g</strong>
          </div>
        </div>

        {/* Öğün Tablosu */}
        <div className="space-y-3">
          {(nutrition.meals || []).map((m, mIdx) => (
            <div key={mIdx} className="border border-slate-200 rounded p-2.5">
              <div className="flex justify-between font-bold text-xs mb-1.5">
                <span>{m.name} ({m.time})</span>
                <span className="text-slate-500">{m.notes}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {(m.items || []).map((it, iIdx) => (
                  <span key={iIdx} className="bg-slate-100 px-2 py-0.5 rounded">
                    <strong>{it.name}:</strong> {it.amount} {it.unit} ({it.protein}g P, {it.carb}g C, {it.kcal} kcal)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[11px] space-y-1">
          <p><strong>💧 Sıvı Tavsiyesi:</strong> {nutrition.waterTargetLiters} Litre / gün</p>
          <p><strong>🧂 Tuz Tavsiyesi:</strong> {nutrition.saltTargetGrams} (8 gr altına asla düşmeyin!)</p>
          <p><strong>💊 Takviyeler:</strong> {nutrition.supplements?.map(s => `${s.name} (${s.dosage})`).join(', ')}</p>
        </div>
      </div>

    </div>
  );
}
