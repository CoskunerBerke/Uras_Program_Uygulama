import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  ArrowRight, 
  Clock, 
  Layers, 
  Zap,
  Coffee,
  CheckCircle,
  HelpCircle
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

  // Progresif Aşırı Yüklenme (Progressive Overload: Haftayı Sonrakine Kopyala)
  const handleCloneWeekToNext = () => {
    if (activeWeek >= totalWeeks) return;
    const nextWeek = activeWeek + 1;

    const updatedDays = days.map(day => ({
      ...day,
      exercises: (day.exercises || []).map(ex => {
        const currentW = ex.weeks?.[activeWeek] || {};
        const baseWeight = currentW.actualWeight || currentW.targetWeight || ex.targetWeight || '';
        
        // Basit sayısal tespit ve +2.5kg artış önerisi
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

  // Yeni Hareket Seçildiğinde Ekleme
  const handleAddExerciseFromPicker = (exData) => {
    const newEx = {
      id: `ex-${Date.now()}`,
      name: exData.name,
      sets: 2,
      targetReps: "8-10",
      targetWeight: "Örn: 50 kg",
      rir: exData.defaultRir || "1",
      rpe: exData.defaultRpe || "8.5",
      percentage: "Hipertrofi Yükleme",
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
      focus: "Hedef Kas Grubu",
      isRestDay: false,
      exercises: []
    };
    onUpdateWorkoutProgram({
      ...workoutProgram,
      days: [...days, newDay]
    });
    setActiveDayId(newDay.id);
  };

  // Gün Başlığı & Dinlenme Günü Değiştirme
  const handleUpdateCurrentDay = (field, value) => {
    const updatedDays = days.map(d => d.id === activeDayId ? { ...d, [field]: value } : d);
    onUpdateWorkoutProgram({ ...workoutProgram, days: updatedDays });
  };

  // Toplam set sayısı hesabı
  const totalDaySets = (currentDay?.exercises || []).reduce((acc, ex) => acc + (parseInt(ex.sets) || 1), 0);
  const completedExercises = (currentDay?.exercises || []).filter(ex => ex.weeks?.[activeWeek]?.completed).length;

  return (
    <div className="space-y-6">
      
      {/* 1. Üst Kontrol Barı: Hafta Seçimi, Progresif Aşırı Yüklenme, Isınma Butonu */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Sol: Split Adı & Hafta Seçici */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Dönem / Blok
            </span>
            <input
              type="text"
              value={workoutProgram.splitName || ''}
              onChange={(e) => onUpdateWorkoutProgram({ ...workoutProgram, splitName: e.target.value })}
              className="font-heading font-black text-lg sm:text-xl text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500"
              placeholder="Split İsmi..."
            />
          </div>

          {/* Hafta Butonları */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Hafta:
            </span>
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => handleSelectWeek(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeWeek === w
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                H.{w}
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Progresif Yükleme Kopyalama & Isınma Açma */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <button
            onClick={() => setShowWarmup(!showWarmup)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showWarmup
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{showWarmup ? 'Isınmayı Gizle' : 'Isınma & Piramit'}</span>
          </button>

          {viewMode === 'coach' && (
            <button
              onClick={handleCloneWeekToNext}
              disabled={activeWeek >= totalWeeks}
              title="Mevcut haftanın ağırlıklarını ve tekrarlarını sonraki haftaya +2.5kg progresif yüklenmeyle kopyalar"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-600/30 transition-all disabled:opacity-40"
            >
              <Copy className="w-4 h-4" />
              <span>Hafta {activeWeek + 1}'e Kopyala (+2.5kg)</span>
            </button>
          )}

        </div>

      </div>

      {/* Isınma Alanı (Açılır/Kapanır) */}
      {showWarmup && (
        <WarmupSection
          warmupPlan={workoutProgram.warmupPlan}
          onUpdateWarmupPlan={(plan) => onUpdateWorkoutProgram({ ...workoutProgram, warmupPlan: plan })}
        />
      )}

      {/* 2. Gün Seçim Sekmeleri (Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {days.map((day) => {
          const isActive = day.id === activeDayId;
          const isRest = day.isRestDay;
          const exCount = (day.exercises || []).length;

          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-slate-800 text-white border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                isRest ? 'bg-amber-400' : isActive ? 'bg-emerald-400' : 'bg-slate-600'
              }`} />
              <div className="text-left">
                <span className="block font-black text-slate-100">{day.dayName}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isRest ? 'Dinlenme' : `${exCount} Hareket`}
                </span>
              </div>
            </button>
          );
        })}

        {viewMode === 'coach' && (
          <button
            onClick={handleAddDay}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-400 bg-slate-900/60 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-emerald-500/50 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Gün</span>
          </button>
        )}
      </div>

      {/* 3. Aktif Gün Detay Kartı & Hareket Listesi */}
      {currentDay && (
        <div className="space-y-4">
          
          {/* Gün Başlığı & Özet Bilgi */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentDay.dayName}
                </span>
                
                {viewMode === 'coach' ? (
                  <input
                    type="text"
                    value={currentDay.title}
                    onChange={(e) => handleUpdateCurrentDay('title', e.target.value)}
                    className="font-heading font-black text-lg sm:text-xl text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500"
                    placeholder="Gün Başlığı (Örn: Upper / Push)..."
                  />
                ) : (
                  <h2 className="font-heading font-black text-lg sm:text-xl text-white">
                    {currentDay.title}
                  </h2>
                )}

                {/* Dinlenme Günü Toggle */}
                {viewMode === 'coach' && (
                  <button
                    onClick={() => handleUpdateCurrentDay('isRestDay', !currentDay.isRestDay)}
                    className={`ml-2 text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                      currentDay.isRestDay
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
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
                  className="text-xs text-slate-400 bg-transparent w-full focus:outline-none focus:border-b focus:border-slate-600"
                  placeholder="Hedef Odak Noktası (örn: Göğüs, Sırt, Omuz, Kollar)..."
                />
              ) : (
                <p className="text-xs text-slate-400">
                  🎯 Odak: {currentDay.focus || 'Genel Kuvvet'}
                </p>
              )}
            </div>

            {/* İstatistikler & Hareket Ekle Butonu */}
            <div className="flex items-center gap-3">
              {!currentDay.isRestDay && (
                <div className="flex items-center gap-3 text-xs bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span><strong>{currentDay.exercises?.length || 0}</strong> Hareket</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Dumbbell className="w-4 h-4 text-cyan-400" />
                    <span><strong>{totalDaySets}</strong> Toplam Set</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span><strong>{completedExercises}/{currentDay.exercises?.length || 0}</strong> Tamamlandı</span>
                  </div>
                </div>
              )}

              {viewMode === 'coach' && !currentDay.isRestDay && (
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Hareket Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* Dinlenme Günü Mesajı */}
          {currentDay.isRestDay ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">Bugün Dinlenme & Toparlanma Günü (Rest Day)</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Kas gelişimi ağırlık çalışırken değil, dinlenirken ve beslenirken gerçekleşir. Bol su için, protein hedefinizi tamamlayın ve en az 8.000 adım atın.
              </p>
            </div>
          ) : (
            /* Hareket Listesi */
            <div className="space-y-3">
              {(currentDay.exercises || []).length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Bu güne henüz hareket eklenmemiş</h4>
                  <p className="text-xs text-slate-400">
                    Yukarıdaki "Hareket Ekle" butonuna basarak kütüphaneden veya özel hareket tanımlayabilirsiniz.
                  </p>
                  {viewMode === 'coach' && (
                    <button
                      onClick={() => setIsPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      İlk Hareketi Ekle
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
