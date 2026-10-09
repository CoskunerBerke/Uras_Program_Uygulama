import React, { useState } from 'react';
import { 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Plus,
  X,
  Split
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
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');

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

  // Alternatif Seçenek Ekleme
  const handleAddOptionSubmit = (e) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;
    const currentOptions = exercise.options || [exercise.name];
    const updatedOptions = [...currentOptions, newOptionName.trim()];
    
    onUpdateExercise(exercise.id, {
      ...exercise,
      isChoice: true,
      options: updatedOptions,
      selectedOption: exercise.selectedOption || updatedOptions[0]
    });
    setNewOptionName('');
    setIsAddingOption(false);
  };

  // Alternatif Seçenek Silme
  const handleRemoveOption = (optToRemove) => {
    const currentOptions = exercise.options || [];
    const updatedOptions = currentOptions.filter(o => o !== optToRemove);
    const newSelected = exercise.selectedOption === optToRemove 
      ? (updatedOptions[0] || exercise.name) 
      : exercise.selectedOption;

    onUpdateExercise(exercise.id, {
      ...exercise,
      isChoice: updatedOptions.length > 1,
      options: updatedOptions,
      selectedOption: newSelected
    });
  };

  // Seçenekli Harekete Dönüştür
  const handleMakeChoice = () => {
    onUpdateExercise(exercise.id, {
      ...exercise,
      isChoice: true,
      options: [exercise.name, `${exercise.name} (Makine/Dumbbell Alternatifi)`],
      selectedOption: exercise.name
    });
  };

  const hasOptions = exercise.isChoice || (exercise.options && exercise.options.length > 0);
  const activeSelectedName = exercise.selectedOption || (hasOptions ? exercise.options[0] : exercise.name);

  return (
    <div className={`rounded-xl border transition-all duration-150 ${
      weekData.completed
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 opacity-90'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
    }`}>
      
      {/* Ana Satır */}
      <div className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Sol: Numara, Checkbox, Başlık ve Seçenekler */}
        <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
          
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

          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            {/* Hareket Adı */}
            <div className="flex items-center gap-2 flex-wrap">
              {viewMode === 'coach' ? (
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="font-bold text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500 px-0.5 py-0.5"
                  placeholder="Hareket Adı (örn: Chest Fly of Choice)..."
                />
              ) : (
                <h4 className={`font-bold text-sm text-slate-900 dark:text-white truncate ${weekData.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                  {hasOptions ? activeSelectedName : exercise.name}
                </h4>
              )}

              {/* Seçenekli Rozeti */}
              {hasOptions && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 flex items-center gap-1">
                  <Split className="w-3 h-3" />
                  Seçenekli
                </span>
              )}
            </div>

            {/* Alternatif Seçenekler (Hap Butonlar) */}
            {hasOptions && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Seçenekler:
                </span>
                {(exercise.options || []).map((opt, oIdx) => {
                  const isSelected = activeSelectedName === opt;
                  return (
                    <div key={oIdx} className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleFieldChange('selectedOption', opt)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {opt}
                      </button>
                      {viewMode === 'coach' && (exercise.options || []).length > 1 && (
                        <button
                          onClick={() => handleRemoveOption(opt)}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                          title="Bu seçeneği sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Koç Modu: Yeni Alternatif Ekleme */}
                {viewMode === 'coach' && (
                  <>
                    {!isAddingOption ? (
                      <button
                        onClick={() => setIsAddingOption(true)}
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-1 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        Seçenek Ekle
                      </button>
                    ) : (
                      <form onSubmit={handleAddOptionSubmit} className="flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Alternatif isim..."
                          value={newOptionName}
                          onChange={(e) => setNewOptionName(e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button type="submit" className="text-xs font-bold text-emerald-600 px-1">Ekle</button>
                        <button type="button" onClick={() => setIsAddingOption(false)} className="text-xs text-slate-400">✕</button>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Seçenekli Olmayan Harekete Alternatif Ekle Butonu (Yalnızca Koç Modunda) */}
            {viewMode === 'coach' && !hasOptions && (
              <button
                onClick={handleMakeChoice}
                className="text-[10px] text-slate-400 hover:text-amber-500 flex items-center gap-1 mt-0.5"
                title="Danışanın bu bölge için farklı makineler/varyasyonlar seçebilmesi için alternatif ekleyin"
              >
                <Split className="w-3 h-3" />
                Alternatifli / Seçenekli Yap
              </button>
            )}

            {/* Koç Notu */}
            {viewMode === 'coach' ? (
              <input
                type="text"
                placeholder="Form ipucu / Koç notu ekleyin..."
                value={exercise.coachNotes || ''}
                onChange={(e) => handleFieldChange('coachNotes', e.target.value)}
                className="w-full text-xs text-slate-500 dark:text-slate-400 bg-transparent placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-b focus:border-slate-400 dark:focus:border-slate-600 mt-0.5"
              />
            ) : exercise.coachNotes ? (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 italic mt-0.5">
                💡 {exercise.coachNotes}
              </p>
            ) : null}
          </div>
        </div>

        {/* Sağ: Parametreler */}
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

          {/* Hafta Günlüğü Butonu */}
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

      {/* Hafta Performans Paneli */}
      {showLogs && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3 bg-slate-50/70 dark:bg-slate-950/40 rounded-b-xl space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Hafta {activeWeek} Performans Karşılaştırması ({activeSelectedName})
            </span>
            <span className="text-[10px]">Önerilen Hedef vs Gerçekleşen Sonuç</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Hedef:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Yük: <strong className="text-slate-900 dark:text-white">{weekData.targetWeight || exercise.targetWeight || '-'}</strong></span>
                <span className="text-slate-600 dark:text-slate-400">Tekrar: <strong className="text-slate-900 dark:text-white">{weekData.targetReps || exercise.targetReps || '-'}</strong></span>
                <span className="text-slate-600 dark:text-slate-400">RPE: <strong className="text-amber-600 dark:text-amber-400">{weekData.targetRpe || exercise.rpe || '-'}</strong></span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Yapılan:</span>
              <input
                type="text"
                placeholder="Kg"
                value={weekData.actualWeight || ''}
                onChange={(e) => handleWeekDataChange('actualWeight', e.target.value)}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tekrar"
                value={weekData.actualReps || ''}
                onChange={(e) => handleWeekDataChange('actualReps', e.target.value)}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="RPE"
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
