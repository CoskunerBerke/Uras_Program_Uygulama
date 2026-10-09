import React, { useState } from 'react';
import { 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Video, 
  MessageSquare, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ExerciseRow({
  exercise,
  index,
  totalCount,
  activeWeek,
  viewMode, // 'coach' or 'client'
  onUpdateExercise,
  onDeleteExercise,
  onDuplicateExercise,
  onMoveUp,
  onMoveDown
}) {
  const [showLogs, setShowLogs] = useState(false);

  const weekData = exercise.weeks?.[activeWeek] || {
    targetSet: exercise.sets || 2,
    targetWeight: exercise.targetWeight || '',
    targetReps: exercise.targetReps || '',
    targetRpe: exercise.rpe || '',
    actualWeight: '',
    actualReps: '',
    actualRpe: '',
    actualNotes: '',
    completed: false
  };

  const handleFieldChange = (field, value) => {
    onUpdateExercise(exercise.id, {
      ...exercise,
      [field]: value
    });
  };

  const handleWeekDataChange = (field, value) => {
    const updatedWeeks = {
      ...(exercise.weeks || {}),
      [activeWeek]: {
        ...weekData,
        [field]: value
      }
    };
    onUpdateExercise(exercise.id, {
      ...exercise,
      weeks: updatedWeeks
    });
  };

  const toggleCompleted = () => {
    handleWeekDataChange('completed', !weekData.completed);
  };

  return (
    <div className={`rounded-xl border transition-all duration-150 ${
      weekData.completed
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 opacity-90'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
    }`}>
      
      {/* Ana Satır: Çok Sade, Kompakt & Doğrudan Düzenlenebilir */}
      <div className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Sol Bölüm: Sıra No, Checkbox, Hareket İsmi & Not */}
        <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
          
          {/* Tamamlandı Tick */}
          <button
            onClick={toggleCompleted}
            title={weekData.completed ? "Tamamlandı" : "Tamamla"}
            className="mt-0.5 sm:mt-0 flex-shrink-0 text-slate-400 hover:text-emerald-500 dark:text-slate-600 dark:hover:text-emerald-400 transition-colors"
          >
            {weekData.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-500/20" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-slate-500" />
            )}
          </button>

          {/* Numara */}
          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            {index + 1}
          </span>

          {/* Hareket Adı & Koç Notu */}
          <div className="flex-1 min-w-0">
            {viewMode === 'coach' ? (
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-b focus:border-emerald-500 px-0.5 py-0.5"
                placeholder="Hareket Adı..."
              />
            ) : (
              <h4 className={`font-bold text-sm text-slate-900 dark:text-white truncate ${weekData.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                {exercise.name}
              </h4>
            )}

            {/* Koç Notu (Varsa sade alt yazı) */}
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="Form ipucu / Koç notu ekleyin..."
                value={exercise.coachNotes || ''}
                onChange={(e) => handleFieldChange('coachNotes', e.target.value)}
                className="w-full text-xs text-slate-500 dark:text-slate-400 bg-transparent placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-b focus:border-slate-400 dark:focus:border-slate-600"
              />
            ) : exercise.coachNotes ? (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                💡 {exercise.coachNotes}
              </p>
            ) : null}
          </div>
        </div>

        {/* Sağ Bölüm: Sade Parametre Girişleri (Set, Tekrar, Ağırlık, RIR, RPE, Tempo, vb.) */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 justify-end text-xs">
          
          {/* Set */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Set:</span>
            {viewMode === 'coach' ? (
              <input
                type="number"
                min="1"
                max="10"
                value={exercise.sets || 2}
                onChange={(e) => handleFieldChange('sets', parseInt(e.target.value) || 1)}
                className="w-8 bg-transparent text-center font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            ) : (
              <strong className="text-slate-900 dark:text-white">{exercise.sets || 2}</strong>
            )}
          </div>

          {/* Tekrar */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Tekrar:</span>
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="8-10"
                value={exercise.targetReps || ''}
                onChange={(e) => handleFieldChange('targetReps', e.target.value)}
                className="w-12 bg-transparent text-center font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            ) : (
              <strong className="text-slate-900 dark:text-white">{exercise.targetReps || '8-10'}</strong>
            )}
          </div>

          {/* Ağırlık */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Yük:</span>
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="kg / %"
                value={exercise.targetWeight || ''}
                onChange={(e) => handleFieldChange('targetWeight', e.target.value)}
                className="w-16 bg-transparent text-center font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
            ) : (
              <strong className="text-emerald-600 dark:text-emerald-400">{exercise.targetWeight || '-'}</strong>
            )}
          </div>

          {/* RIR & RPE */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">RIR:</span>
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="0-1"
                value={exercise.rir || ''}
                onChange={(e) => handleFieldChange('rir', e.target.value)}
                className="w-8 bg-transparent text-center font-bold text-amber-600 dark:text-amber-300 focus:outline-none"
              />
            ) : (
              <strong className="text-amber-600 dark:text-amber-300">{exercise.rir || '0'}</strong>
            )}
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">RPE:</span>
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="9"
                value={exercise.rpe || ''}
                onChange={(e) => handleFieldChange('rpe', e.target.value)}
                className="w-8 bg-transparent text-center font-bold text-amber-600 dark:text-amber-300 focus:outline-none"
              />
            ) : (
              <strong className="text-amber-600 dark:text-amber-300">{exercise.rpe || '9'}</strong>
            )}
          </div>

          {/* Tempo */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Tempo:</span>
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="2-1-0"
                value={exercise.tempo || ''}
                onChange={(e) => handleFieldChange('tempo', e.target.value)}
                className="w-14 bg-transparent text-center font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            ) : (
              <span className="text-slate-700 dark:text-slate-300 font-medium">{exercise.tempo || '2-1-0'}</span>
            )}
          </div>

          {/* Hafta Günlüğü Aç/Kapat Butonu */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all ${
              showLogs
                ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-500'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Hafta Performansı (Önerilen vs Yapılan)"
          >
            H.{activeWeek} Log
          </button>

          {/* Koç Aksiyonları */}
          {viewMode === 'coach' && (
            <div className="flex items-center gap-0.5 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                disabled={index === 0}
                onClick={onMoveUp}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                title="Yukarı"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={index === totalCount - 1}
                onClick={onMoveDown}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                title="Aşağı"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDuplicateExercise}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Çoğalt"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDeleteExercise}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Sadeleştirilmiş Hafta Performans Paneli (Yalnızca tıklandığında açılır) */}
      {showLogs && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3 bg-slate-50/70 dark:bg-slate-950/40 rounded-b-xl space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Hafta {activeWeek} Performans Karşılaştırması
            </span>
            <span className="text-[10px]">Önerilen Hedef vs Gerçekleşen Sonuç</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Hedef (Önerilen) */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Hedef:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Yük: <strong className="text-slate-900 dark:text-white">{weekData.targetWeight || exercise.targetWeight || '-'}</strong></span>
                <span className="text-slate-600 dark:text-slate-400">Tekrar: <strong className="text-slate-900 dark:text-white">{weekData.targetReps || exercise.targetReps || '-'}</strong></span>
                <span className="text-slate-600 dark:text-slate-400">RPE: <strong className="text-amber-600 dark:text-amber-400">{weekData.targetRpe || exercise.rpe || '-'}</strong></span>
              </div>
            </div>

            {/* Yapılan (Gerçekleşen) */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Yapılan:</span>
              <input
                type="text"
                placeholder="Kg (örn: 67.5)"
                value={weekData.actualWeight || ''}
                onChange={(e) => handleWeekDataChange('actualWeight', e.target.value)}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tekrar (örn: 8)"
                value={weekData.actualReps || ''}
                onChange={(e) => handleWeekDataChange('actualReps', e.target.value)}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="RPE (örn: 9)"
                value={weekData.actualRpe || ''}
                onChange={(e) => handleWeekDataChange('actualRpe', e.target.value)}
                className="w-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
