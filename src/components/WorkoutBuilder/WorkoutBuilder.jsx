import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Copy, 
  Layers, 
  Coffee,
  CheckCircle
} from 'lucide-react';
import ExerciseRow from './ExerciseRow';
import ExercisePickerModal from './ExercisePickerModal';
import WarmupSection from './WarmupSection';

export default function WorkoutBuilder({
  workoutProgram,
  onUpdateWorkoutProgram,
  viewMode // 'coach' | 'client'
}) {
  const [activeDayId, setActiveDayId] = useState(workoutProgram?.days?.[0]?.id || 'day-1');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);

  const activeWeek = workoutProgram.activeWeek || 1;
  const totalWeeks = workoutProgram.totalWeeks || 10;
  const days = workoutProgram.days || [];
  const currentDay = days.find(d => d.id === activeDayId) || days[0];

  // Hafta Değiştirme
  const handleSelectWeek = (weekNum) => {
    onUpdateWorkoutProgram({
      ...workoutProgram,
      activeWeek: weekNum
    });
  };

  // Progresif Aşırı Yüklenme
  const handleCloneWeekToNext = () => {
    if (activeWeek >= totalWeeks) return;
    const nextWeek = activeWeek + 1;

    const updatedDays = days.map(day => ({
      ...day,
      exercises: (day.exercises || []).map(ex => {
        const currentW = ex.weeks?.[activeWeek] || {};
        const baseWeight = currentW.actualWeight || currentW.targetWeight || ex.targetWeight || '';
        
        let nextTargetWeight = baseWeight;
        const numMatch = baseWeight.match(/^(\d+(?:\.\d+)?)/);
        if (numMatch) {
          const num = parseFloat(numMatch[1]);
          const restStr = baseWeight.substring(numMatch[1].length);
          nextTargetWeight = `${(num + 2.5).toFixed(1)}${restStr}`;
        }

        return {
          ...ex,
          weeks: {
            ...(ex.weeks || {}),
            [nextWeek]: {
              targetSet: currentW.targetSet || ex.sets || 2,
              targetWeight: nextTargetWeight,
              targetReps: currentW.actualReps || currentW.targetReps || ex.targetReps || '',
              targetRpe: currentW.targetRpe || ex.rpe || '9',
              actualWeight: '',
              actualReps: '',
              actualRpe: '',
              actualNotes: '',
              completed: false
            }
          }
        };
      })
    }));

    onUpdateWorkoutProgram({
      ...workoutProgram,
      activeWeek: nextWeek,
      days: updatedDays
    });
  };

  // Hareket Güncelleme
  const handleUpdateExercise = (exerciseId, updatedExercise) => {
    const updatedDays = days.map(day => {
      if (day.id !== activeDayId) return day;
      return {
        ...day,
        exercises: day.exercises.map(ex => ex.id === exerciseId ? updatedExercise : ex)
      };
    });
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Hareket Silme
  const handleDeleteExercise = (exerciseId) => {
    const updatedDays = days.map(day => {
      if (day.id !== activeDayId) return day;
      return {
        ...day,
        exercises: day.exercises.filter(ex => ex.id !== exerciseId)
      };
    });
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Hareket Çoğaltma
  const handleDuplicateExercise = (exercise) => {
    const newEx = {
      ...exercise,
      id: `ex-${Date.now()}`,
      name: `${exercise.name} (Kopya)`,
    };
    const updatedDays = days.map(day => {
      if (day.id !== activeDayId) return day;
      return {
        ...day,
        exercises: [...day.exercises, newEx]
      };
    });
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Hareket Sıralama
  const handleMoveExercise = (fromIndex, toIndex) => {
    const updatedDays = days.map(day => {
      if (day.id !== activeDayId) return day;
      const list = [...day.exercises];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...day, exercises: list };
    });
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Yeni Hareket Ekleme
  const handleAddExerciseFromPicker = (exData) => {
    const newEx = {
      id: `ex-${Date.now()}`,
      name: exData.name,
      sets: 2,
      targetReps: "8-10",
      targetWeight: "50 kg",
      rir: exData.defaultRir || "1",
      rpe: exData.defaultRpe || "8.5",
      percentage: "Hipertrofi",
      tempo: exData.defaultTempo || "2-1-0",
      rest: "90 sn",
      coachNotes: exData.cue || "",
      videoUrl: "",
      weeks: {
        [activeWeek]: {
          targetSet: 2,
          targetWeight: "50 kg",
          targetReps: "8-10",
          targetRpe: exData.defaultRpe || "8.5",
          actualWeight: "",
          actualReps: "",
          actualRpe: "",
          actualNotes: "",
          completed: false
        }
      }
    };

    const updatedDays = days.map(day => {
      if (day.id !== activeDayId) return day;
      return {
        ...day,
        exercises: [...(day.exercises || []), newEx]
      };
    });
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Yeni Gün Ekleme
  const handleAddDay = () => {
    const newDay = {
      id: `day-${Date.now()}`,
      dayName: `Gün ${days.length + 1}`,
      title: "Yeni Antrenman Günü",
      focus: "Hedef Bölge",
      isRestDay: false,
      exercises: []
    };
    onUpdateWorkoutProgram({
      ...workoutProgram,
      days: [...days, newDay]
    });
    setActiveDayId(newDay.id);
  };

  const handleUpdateCurrentDay = (field, value) => {
    const updatedDays = days.map(d => d.id === activeDayId ? { ...d, [field]: value } : d);
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  const totalDaySets = (currentDay?.exercises || []).reduce((acc, ex) => acc + (parseInt(ex.sets) || 1), 0);
  const completedExercises = (currentDay?.exercises || []).filter(ex => ex.weeks?.[activeWeek]?.completed).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* 1. Sade Üst Çubuk: Program İsmi, Hafta & Progresyon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        
        {/* Sol: Split Adı ve Hafta Butonları */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Program
            </span>
            <input
              type="text"
              value={workoutProgram.splitName || ''}
              onChange={(e) => onUpdateWorkoutProgram({ ...workoutProgram, splitName: e.target.value })}
              className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500"
              placeholder="Split İsmi..."
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Hafta:
            </span>
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => handleSelectWeek(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeWeek === w
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                H.{w}
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Sade Aksiyon Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowWarmup(!showWarmup)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showWarmup
                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{showWarmup ? 'Isınmayı Kapat' : 'Isınma & Piramit'}</span>
          </button>

          {viewMode === 'coach' && (
            <button
              onClick={handleCloneWeekToNext}
              disabled={activeWeek >= totalWeeks}
              title="Ağırlıkları +2.5kg artırarak sonraki haftaya kopyalar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 hover:bg-emerald-500 shadow-sm transition-all disabled:opacity-40"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Hafta {activeWeek + 1}'e Kopyala (+2.5kg)</span>
            </button>
          )}
        </div>

      </div>

      {/* Isınma Alanı */}
      {showWarmup && (
        <WarmupSection
          warmupPlan={workoutProgram.warmupPlan}
          onUpdateWarmupPlan={(plan) => onUpdateWorkoutProgram({ ...workoutProgram, warmupPlan: plan })}
        />
      )}

      {/* 2. Gün Seçim Sekmeleri (Minimal Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {days.map((day) => {
          const isActive = day.id === activeDayId;
          const isRest = day.isRestDay;
          const exCount = (day.exercises || []).length;

          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-emerald-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/80 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                isRest ? 'bg-amber-400' : isActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
              <div className="text-left">
                <span className="block font-bold">{day.dayName}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  {isRest ? 'Dinlenme' : `${exCount} Hareket`}
                </span>
              </div>
            </button>
          );
        })}

        {viewMode === 'coach' && (
          <button
            onClick={handleAddDay}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-emerald-400 border border-dashed border-slate-300 dark:border-slate-700 transition-all flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Gün</span>
          </button>
        )}
      </div>

      {/* 3. Gün Kartı & Hareket Listesi */}
      {currentDay && (
        <div className="space-y-3">
          
          {/* Gün Başlık & Bilgi Barı */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm transition-colors">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentDay.dayName}
                </span>

                {viewMode === 'coach' ? (
                  <input
                    type="text"
                    value={currentDay.title}
                    onChange={(e) => handleUpdateCurrentDay('title', e.target.value)}
                    className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500"
                    placeholder="Gün Başlığı (Örn: Upper / Push)..."
                  />
                ) : (
                  <h2 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {currentDay.title}
                  </h2>
                )}

                {viewMode === 'coach' && (
                  <button
                    onClick={() => handleUpdateCurrentDay('isRestDay', !currentDay.isRestDay)}
                    className={`text-[11px] px-2 py-0.5 rounded border font-semibold transition-all ${
                      currentDay.isRestDay
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}
                  >
                    {currentDay.isRestDay ? '💤 Dinlenme Günü' : 'İdman Günü'}
                  </button>
                )}
              </div>

              {viewMode === 'coach' ? (
                <input
                  type="text"
                  value={currentDay.focus || ''}
                  onChange={(e) => handleUpdateCurrentDay('focus', e.target.value)}
                  className="text-xs text-slate-500 dark:text-slate-400 bg-transparent w-full focus:outline-none focus:border-b focus:border-slate-300 dark:focus:border-slate-700 mt-1"
                  placeholder="Hedef Bölge (Örn: Göğüs, Sırt, Omuz, Kollar)..."
                />
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Odak: {currentDay.focus || 'Genel Kuvvet'}
                </p>
              )}
            </div>

            {/* Sağ: İstatistik & Hareket Ekle */}
            <div className="flex items-center gap-3">
              {!currentDay.isRestDay && (
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  <span><strong>{currentDay.exercises?.length || 0}</strong> Hareket</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span><strong>{totalDaySets}</strong> Set</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{completedExercises}/{currentDay.exercises?.length || 0} Tamam</span>
                </div>
              )}

              {viewMode === 'coach' && !currentDay.isRestDay && (
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-500 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Hareket Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* Dinlenme Günü Kartı */}
          {currentDay.isRestDay ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Dinlenme & Toparlanma Günü (Rest Day)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Kas gelişimi dinlenme ve beslenme ile olur. Su tüketimini tamamlayın ve yürüyüş yapın.
              </p>
            </div>
          ) : (
            /* Hareket Listesi */
            <div className="space-y-2.5">
              {(currentDay.exercises || []).length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <p className="text-xs text-slate-500">Bu günde henüz hareket yok.</p>
                  {viewMode === 'coach' && (
                    <button
                      onClick={() => setIsPickerOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-lg text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Hareket Ekle
                    </button>
                  )}
                </div>
              ) : (
                currentDay.exercises.map((exercise, index) => (
                  <ExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    totalCount={currentDay.exercises.length}
                    activeWeek={activeWeek}
                    viewMode={viewMode}
                    onUpdateExercise={handleUpdateExercise}
                    onDeleteExercise={() => handleDeleteExercise(exercise.id)}
                    onDuplicateExercise={() => handleDuplicateExercise(exercise)}
                    onMoveUp={() => handleMoveExercise(index, index - 1)}
                    onMoveDown={() => handleMoveExercise(index, index + 1)}
                  />
                ))
              )}
            </div>
          )}

        </div>
      )}

      {/* Hareket Seçici Modal */}
      <ExercisePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectExercise={handleAddExerciseFromPicker}
      />

    </div>
  );
}
