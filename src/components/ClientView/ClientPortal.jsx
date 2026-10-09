import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Droplets, 
  Utensils, 
  Video,
  Copy,
  Check,
  DownloadCloud,
  Target
} from 'lucide-react';
import ImportProgramModal from './ImportProgramModal';

export default function ClientPortal({ client, onUpdateClient }) {
  const workout = client.workoutProgram;
  const nutrition = client.nutritionPlan;
  const activeWeek = workout.activeWeek || 1;

  const [selectedDayId, setSelectedDayId] = useState(workout.days?.[0]?.id || 'day-1');
  const currentDay = workout.days?.find(d => d.id === selectedDayId) || workout.days?.[0];

  const [timerSeconds, setTimerSeconds] = useState(90);
  const [initialTimer, setInitialTimer] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [drunkWaterMl, setDrunkWaterMl] = useState(1500);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const clientCode = client.clientCode || client.id;

  const handleCopyClientCode = () => {
    navigator.clipboard.writeText(clientCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleImportProgramSuccess = (importedData) => {
    onUpdateClient({
      ...client,
      workoutProgram: importedData.workoutProgram || client.workoutProgram,
      nutritionPlan: importedData.nutritionPlan || client.nutritionPlan
    });
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds) => {
    setInitialTimer(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleToggleExerciseDone = (exerciseId) => {
    const updatedDays = workout.days.map(day => {
      if (day.id !== selectedDayId) return day;
      return {
        ...day,
        exercises: day.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const currentWeekData = ex.weeks?.[activeWeek] || {};
          return {
            ...ex,
            weeks: {
              ...(ex.weeks || {}),
              [activeWeek]: {
                ...currentWeekData,
                completed: !currentWeekData.completed
              }
            }
          };
        })
      };
    });

    onUpdateClient({
      ...client,
      workoutProgram: { ...workout, days: updatedDays }
    });
  };

  const handleUpdateLog = (exerciseId, field, value) => {
    const updatedDays = workout.days.map(day => {
      if (day.id !== selectedDayId) return day;
      return {
        ...day,
        exercises: day.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const currentWeekData = ex.weeks?.[activeWeek] || {};
          return {
            ...ex,
            weeks: {
              ...(ex.weeks || {}),
              [activeWeek]: {
                ...currentWeekData,
                [field]: value
              }
            }
          };
        })
      };
    });

    onUpdateClient({
      ...client,
      workoutProgram: { ...workout, days: updatedDays }
    });
  };

  const handleUpdateChoiceOption = (exerciseId, option) => {
    const updatedDays = workout.days.map(day => {
      if (day.id !== selectedDayId) return day;
      return {
        ...day,
        exercises: day.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            selectedOption: option
          };
        })
      };
    });

    onUpdateClient({
      ...client,
      workoutProgram: { ...workout, days: updatedDays }
    });
  };

  const completedCount = (currentDay?.exercises || []).filter(ex => ex.weeks?.[activeWeek]?.completed).length;
  const totalCount = currentDay?.exercises?.length || 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 text-slate-900 dark:text-white transition-colors">
      
      {/* 0. Danışan Kodu (Client ID) & Program Yükleme Rozeti */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ID
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Danışan Kodunuz:</span>
              <span className="font-heading font-black text-sm text-emerald-700 dark:text-emerald-400 tracking-wider">
                {clientCode}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Bu kodu Uras Hoca'ya ileterek size özel programınızı atamasını sağlayabilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyClientCode}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Program Yükle</span>
          </button>
        </div>
      </div>

      {/* 1. Sade Başlık & İlerleme Kartı */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              Danışan Modu • Hafta {activeWeek}
            </span>
            <h1 className="text-xl font-black mt-0.5">
              {client.name}
            </h1>
            <p className="text-xs text-slate-500">{client.goal}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tamamlanan</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {completedCount} / {totalCount} ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Günler */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          {(workout.days || []).map(day => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDayId === day.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {day.dayName}: {day.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dinlenme Kronometresi (Rest Timer) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Dinlenme Sayacı</span>
            <div className="text-xl font-black font-mono">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {[60, 90, 120, 180].map((s) => (
            <button
              key={s}
              onClick={() => startTimer(s)}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
            >
              {s < 120 ? `${s}s` : `${s / 60}dk`}
            </button>
          ))}
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-lg bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 ml-1"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(initialTimer);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Günün Hareketleri */}
      <div className="space-y-2.5">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
          {currentDay?.dayName} - {currentDay?.title}
        </h3>

        {currentDay?.isRestDay ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
            Bugün Dinlenme Günü. İyi beslenin ve dinlenin.
          </div>
        ) : (
          (currentDay?.exercises || []).map((ex, idx) => {
            const weekData = ex.weeks?.[activeWeek] || {};
            const isDone = weekData.completed;

            const hasOptions = ex.isChoice || (ex.options && ex.options.length > 0);
            const activeSelectedName = ex.selectedOption || (hasOptions ? ex.options[0] : ex.name);

            return (
              <div
                key={ex.id}
                className={`border rounded-2xl p-3.5 transition-all space-y-2.5 ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-500/30 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleExerciseDone(ex.id)}
                      className="text-slate-400 hover:text-emerald-500"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {hasOptions ? activeSelectedName : ex.name}
                        </h4>
                        {hasOptions && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                            Seçenekli
                          </span>
                        )}
                      </div>

                      {/* Seçenekli Hareket Butonları */}
                      {hasOptions && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            Tercihin:
                          </span>
                          {(ex.options || []).map((opt, oIdx) => {
                            const isSelected = activeSelectedName === opt;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleUpdateChoiceOption(ex.id, opt)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                {isSelected ? '✓ ' : ''}{opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {ex.sets} Set x {ex.targetReps} Tekrar
                        </span>
                        <span>•</span>
                        <span>Hedef: <strong>{weekData.targetWeight || ex.targetWeight || '-'}</strong></span>
                        <span>•</span>
                        <span>RIR: <strong>{ex.rir}</strong></span>
                        <span>•</span>
                        <span>Tempo: <strong>{ex.tempo}</strong></span>
                      </div>
                    </div>
                  </div>

                  {ex.videoUrl && (
                    <a
                      href={ex.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Video
                    </a>
                  )}
                </div>

                {ex.coachNotes && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg italic">
                    💡 {ex.coachNotes}
                  </p>
                )}

                {/* Yapılan Giriş */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Yaptığın Kg</span>
                    <input
                      type="text"
                      placeholder="örn: 70kg"
                      value={weekData.actualWeight || ''}
                      onChange={(e) => handleUpdateLog(ex.id, 'actualWeight', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Yaptığın Tekrar</span>
                    <input
                      type="text"
                      placeholder="örn: 8"
                      value={weekData.actualReps || ''}
                      onChange={(e) => handleUpdateLog(ex.id, 'actualReps', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Hissedilen RPE</span>
                    <input
                      type="text"
                      placeholder="örn: 9"
                      value={weekData.actualRpe || ''}
                      onChange={(e) => handleUpdateLog(ex.id, 'actualRpe', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. Su Sayacı */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <div>
            <span className="font-bold block">Günlük Su: {(drunkWaterMl / 1000).toFixed(1)} / {nutrition.waterTargetLiters || 3.5} L</span>
            <span className="text-slate-400 text-[10px]">İdrar açık sarı renkte olmalı</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDrunkWaterMl(w => w + 250)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
          >
            +250 ml
          </button>
          <button
            onClick={() => setDrunkWaterMl(w => w + 500)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
          >
            +500 ml
          </button>
        </div>
      </div>

      {/* Kod İle Program Yükleme Modalı */}
      <ImportProgramModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        client={client}
        onImportSuccess={handleImportProgramSuccess}
      />

    </div>
  );
}
