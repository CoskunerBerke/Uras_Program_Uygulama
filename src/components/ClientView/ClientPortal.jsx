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
  Flame, 
  Utensils, 
  Layers, 
  MessageSquare, 
  ChevronRight, 
  Award,
  Video
} from 'lucide-react';

export default function ClientPortal({ client, onUpdateClient }) {
  const workout = client.workoutProgram;
  const nutrition = client.nutritionPlan;
  const activeWeek = workout.activeWeek || 1;

  // Gün seçimi
  const [selectedDayId, setSelectedDayId] = useState(workout.days?.[0]?.id || 'day-1');
  const currentDay = workout.days?.find(d => d.id === selectedDayId) || workout.days?.[0];

  // Kronometre / Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [initialTimer, setInitialTimer] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Günlük Su Tüketimi
  const [drunkWaterMl, setDrunkWaterMl] = useState(1500);

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
      workoutProgram: {
        ...workout,
        days: updatedDays
      }
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
      workoutProgram: {
        ...workout,
        days: updatedDays
      }
    });
  };

  const completedCount = (currentDay?.exercises || []).filter(ex => ex.weeks?.[activeWeek]?.completed).length;
  const totalCount = currentDay?.exercises?.length || 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Üst Hoş Geldin & Motivasyon Kartı */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Danışan Portalı
              </span>
              <span className="text-xs text-slate-400 font-medium">Hafta {activeWeek} / 10</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Merhaba, {client.name} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Hedef: <strong>{client.goal}</strong> | Bugün idmanını eksiksiz tamamla ve ağırlıklarını kaydet.
            </p>
          </div>

          {/* İlerleme Çemberi / Barı */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Günün İlerlemesi</span>
              <span className="text-lg font-black text-emerald-400">{completedCount} / {totalCount} Hareket</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center font-bold text-xs text-white relative">
              <span>{progressPct}%</span>
            </div>
          </div>
        </div>

        {/* Gün Seçici */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-5 pt-3 border-t border-slate-800">
          {(workout.days || []).map(day => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDayId === day.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {day.dayName}: {day.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dinlenme Sayacı (Rest Timer / Kronometre) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${
            isTimerRunning ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Set Arası Dinlenme Sayacı</span>
            <div className="text-2xl font-black text-white">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => startTimer(60)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700"
          >
            60 sn
          </button>
          <button
            onClick={() => startTimer(90)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700"
          >
            90 sn
          </button>
          <button
            onClick={() => startTimer(120)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700"
          >
            2 dk
          </button>
          <button
            onClick={() => startTimer(180)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700"
          >
            3 dk
          </button>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-2 rounded-xl text-xs font-bold ml-2 ${
              isTimerRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(initialTimer);
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Günün Hareketleri */}
      <div className="space-y-4">
        <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-emerald-400" />
          {currentDay?.dayName} - {currentDay?.title}
        </h3>

        {currentDay?.isRestDay ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <h4 className="font-bold text-white text-base">Bugün Dinlenme Günü! 💤</h4>
            <p className="text-xs text-slate-400">
              Kaslarını toparla, proteinini al ve bol su iç. Yarın yeni idman için hazır ol.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(currentDay?.exercises || []).map((ex, idx) => {
              const weekData = ex.weeks?.[activeWeek] || {};
              const isDone = weekData.completed;

              return (
                <div
                  key={ex.id}
                  className={`border rounded-2xl p-4 sm:p-5 transition-all space-y-3 ${
                    isDone
                      ? 'bg-slate-900/60 border-emerald-500/40 opacity-80'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleExerciseDone(ex.id)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors mt-0.5"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                          <h4 className={`text-base font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {ex.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-bold">
                            {ex.sets} Set x {ex.targetReps} Tekrar
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            Hedef: <strong>{weekData.targetWeight || ex.targetWeight || 'Belirtilmedi'}</strong>
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                            RIR: {ex.rir} | RPE: {ex.rpe}
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                            Tempo: {ex.tempo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {ex.videoUrl && (
                      <a
                        href={ex.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors"
                        title="Form Videosunu İzle"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Koç Notu */}
                  {ex.coachNotes && (
                    <div className="text-xs text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                      <span>{ex.coachNotes}</span>
                    </div>
                  )}

                  {/* Danışan Ağırlık & Tekrar Giriş Alanı */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Yaptığın Ağırlık
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 72.5 kg"
                        value={weekData.actualWeight || ''}
                        onChange={(e) => handleUpdateLog(ex.id, 'actualWeight', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Yaptığın Tekrar
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 8, 7"
                        value={weekData.actualReps || ''}
                        onChange={(e) => handleUpdateLog(ex.id, 'actualReps', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Hissedilen RPE & Notun
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: RPE 9, rahat çıktı"
                        value={weekData.actualNotes || ''}
                        onChange={(e) => handleUpdateLog(ex.id, 'actualNotes', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Su Sayacı & Öğün Hatırlatıcı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Su Takibi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Günlük Su Tüketimi
            </h4>
            <span className="text-xs font-bold text-blue-400">
              {(drunkWaterMl / 1000).toFixed(1)} / {nutrition.waterTargetLiters || 3.5} Litre
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (drunkWaterMl / ((nutrition.waterTargetLiters || 3.5) * 1000)) * 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setDrunkWaterMl(w => w + 250)}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl"
            >
              +250 ml Bardak
            </button>
            <button
              onClick={() => setDrunkWaterMl(w => w + 500)}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl"
            >
              +500 ml Şişe
            </button>
            <button
              onClick={() => setDrunkWaterMl(0)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-xl"
            >
              Sıfırla
            </button>
          </div>
        </div>

        {/* Öğün Hatırlatıcı */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            Günün Beslenme Planı Özeti
          </h4>
          <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs pr-1">
            {(nutrition.meals || []).map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="font-semibold text-slate-200">{m.name}</span>
                <span className="text-slate-400">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
