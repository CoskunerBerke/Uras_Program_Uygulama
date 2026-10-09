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
  Gauge, 
  Zap, 
  Clock, 
  Layers, 
  Percent,
  Activity,
  Maximize2,
  Minimize2
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
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className={`rounded-xl border transition-all ${
      weekData.completed
        ? 'bg-slate-900/60 border-emerald-500/40 shadow-sm'
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-md'
    }`}>
      
      {/* Üst Başlık & Hızlı Parametre Barı */}
      <div className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Sol: Sıra, Tamamlama, Hareket Adı */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          
          {/* Tamamlandı Butonu */}
          <button
            onClick={toggleCompleted}
            title={weekData.completed ? "Tamamlandı olarak işaretlendi" : "Tamamla"}
            className="flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
          >
            {weekData.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
            ) : (
              <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
            )}
          </button>

          {/* Numara */}
          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center border border-slate-700/60 flex-shrink-0">
            {index + 1}
          </span>

          {/* Hareket İsmi */}
          <div className="flex-1 min-w-0">
            {viewMode === 'coach' ? (
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full bg-transparent font-bold text-sm sm:text-base text-white focus:outline-none focus:border-b focus:border-emerald-500 px-1 py-0.5 rounded transition-all"
                placeholder="Hareket İsmi..."
              />
            ) : (
              <h4 className="font-bold text-sm sm:text-base text-white truncate">
                {exercise.name}
              </h4>
            )}

            {/* Alt Bilgi: Tempo, Dinlenme, Koç İpucu Özeti */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                <Clock className="w-3 h-3 text-emerald-400" />
                Tempo: <strong>{exercise.tempo || '2-1-0'}</strong>
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                Dinlenme: <strong>{exercise.rest || '90 sn'}</strong>
              </span>
              {exercise.coachNotes && (
                <span className="hidden sm:inline text-slate-400 truncate max-w-xs italic">
                  💬 {exercise.coachNotes}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sağ: Temel Parametre Rozetleri (Set x Tekrar, Ağırlık, RIR/RPE) */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          
          {/* Set x Tekrar Rozeti */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-inner">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Set x Tekrar:</span>
            <span className="font-bold text-white">{exercise.sets || 2} x {exercise.targetReps || '8-10'}</span>
          </div>

          {/* RIR / RPE Rozeti */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-inner">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">RIR:</span>
            <span className="font-bold text-amber-300">{exercise.rir || '0-1'}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">RPE:</span>
            <span className="font-bold text-amber-300">{exercise.rpe || '9'}</span>
          </div>

          {/* Percentage / Yükleme Tipi */}
          {exercise.percentage && (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-inner text-teal-300">
              <Percent className="w-3 h-3 text-teal-400" />
              <span className="font-semibold">{exercise.percentage}</span>
            </div>
          )}

          {/* Detay Aç / Kapat */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
            title={isExpanded ? "Daralt" : "Tüm Parametreleri Göster / Düzenle"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Koç Aksiyonları: Sırala, Çoğalt, Sil */}
          {viewMode === 'coach' && (
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                disabled={index === 0}
                onClick={onMoveUp}
                className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-30"
                title="Yukarı Taşı"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                disabled={index === totalCount - 1}
                onClick={onMoveDown}
                className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-30"
                title="Aşağı Taşı"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={onDuplicateExercise}
                className="p-1 text-slate-500 hover:text-slate-200"
                title="Hareketi Çoğalt"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDeleteExercise}
                className="p-1 text-slate-500 hover:text-rose-400"
                title="Hareketi Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Genişletilmiş Parametre Düzenleme & Hafta Takip Paneli */}
      {isExpanded && (
        <div className="border-t border-slate-800/80 p-3.5 sm:p-4 bg-slate-950/40 rounded-b-xl space-y-4">
          
          {/* Koç Parametreleri Izgarası */}
          {viewMode === 'coach' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              
              {/* Set */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Set Sayısı</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={exercise.sets || 2}
                  onChange={(e) => handleFieldChange('sets', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tekrar */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Hedef Tekrar</label>
                <input
                  type="text"
                  placeholder="örn: 5, 8-12, 6-10"
                  value={exercise.targetReps || ''}
                  onChange={(e) => handleFieldChange('targetReps', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Ağırlık */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Hedef Ağırlık</label>
                <input
                  type="text"
                  placeholder="örn: 80kg, +20kg, Top"
                  value={exercise.targetWeight || ''}
                  onChange={(e) => handleFieldChange('targetWeight', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* RIR */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">RIR (Cep Tekrar)</label>
                <input
                  type="text"
                  placeholder="örn: 0-1, 1, 2"
                  value={exercise.rir || ''}
                  onChange={(e) => handleFieldChange('rir', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* RPE */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">RPE (Zorluk 1-10)</label>
                <input
                  type="text"
                  placeholder="örn: 8, 8.5, 9, 10"
                  value={exercise.rpe || ''}
                  onChange={(e) => handleFieldChange('rpe', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Percentage */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Percentage / Tip</label>
                <input
                  type="text"
                  placeholder="örn: 70% e1RM, -20% drop"
                  value={exercise.percentage || ''}
                  onChange={(e) => handleFieldChange('percentage', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tempo */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tempo (İniş-Bekle-Kalk)</label>
                <input
                  type="text"
                  placeholder="örn: 2-1-0, 3-0-1-0"
                  value={exercise.tempo || ''}
                  onChange={(e) => handleFieldChange('tempo', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hedef Set x Tekrar</span>
                <span className="text-emerald-400 font-bold text-sm">{exercise.sets} Set x {exercise.targetReps} Tekrar</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Önerilen Yük & RPE</span>
                <span className="text-white font-bold text-sm">{exercise.targetWeight || '-'} | RPE: {exercise.rpe || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempo & Dinlenme</span>
                <span className="text-cyan-400 font-medium">{exercise.tempo || '2-1-0'} tempo / {exercise.rest || '90 sn'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Yükleme Metodu</span>
                <span className="text-amber-300 font-medium">{exercise.percentage || 'Sabit Yük'}</span>
              </div>
            </div>
          )}

          {/* Koç Notları & Video Linki */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                Koçun Form İpucu & Notu
              </label>
              {viewMode === 'coach' ? (
                <input
                  type="text"
                  placeholder="örn: dirsekleri daha fazla yana verelim, avuç içleri yukarı baksın..."
                  value={exercise.coachNotes || ''}
                  onChange={(e) => handleFieldChange('coachNotes', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-xs text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                  💡 {exercise.coachNotes || "Standart form kurallarına uyun."}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Video className="w-3 h-3 text-cyan-400" />
                Video Form Linki (Opsiyonel)
              </label>
              {viewMode === 'coach' ? (
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={exercise.videoUrl || ''}
                  onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              ) : exercise.videoUrl ? (
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline bg-slate-800 px-3 py-2 rounded-lg"
                >
                  <Video className="w-3.5 h-3.5" />
                  Form Videosunu İzle
                </a>
              ) : (
                <span className="text-xs text-slate-500 block py-1.5">Video linki yok</span>
              )}
            </div>
          </div>

          {/* Hafta Takibi: ÖNERİLEN vs YAPILAN (Google Sheets'teki gibi) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Hafta {activeWeek} Performans Kaydı
              </span>
              <span className="text-[11px] text-slate-500">
                (Google Sheets'teki "Önerilen" vs "Yapılan" sütunları)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Önerilen (Koçun Belirlediği) */}
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">📌 Önerilen (Hedef)</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Ağırlık</span>
                    {viewMode === 'coach' ? (
                      <input
                        type="text"
                        placeholder={exercise.targetWeight || "Hedef kg"}
                        value={weekData.targetWeight || ''}
                        onChange={(e) => handleWeekDataChange('targetWeight', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    ) : (
                      <span className="font-bold text-slate-200">{weekData.targetWeight || exercise.targetWeight || '-'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Tekrar</span>
                    {viewMode === 'coach' ? (
                      <input
                        type="text"
                        placeholder={exercise.targetReps || "Tekrar"}
                        value={weekData.targetReps || ''}
                        onChange={(e) => handleWeekDataChange('targetReps', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    ) : (
                      <span className="font-bold text-slate-200">{weekData.targetReps || exercise.targetReps || '-'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Hedef RPE</span>
                    {viewMode === 'coach' ? (
                      <input
                        type="text"
                        placeholder={exercise.rpe || "RPE"}
                        value={weekData.targetRpe || ''}
                        onChange={(e) => handleWeekDataChange('targetRpe', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    ) : (
                      <span className="font-bold text-amber-300">{weekData.targetRpe || exercise.rpe || '-'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Yapılan (Sporcunun Salonda Girdiği Gerçek Değerler) */}
              <div className="bg-emerald-950/10 p-2.5 rounded-lg border border-emerald-500/20 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">⚡ Yapılan (Gerçekleşen Log)</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-emerald-400/70 block text-[9px]">Gerçekleşen Kg</span>
                    <input
                      type="text"
                      placeholder="örn: 67.5kg"
                      value={weekData.actualWeight || ''}
                      onChange={(e) => handleWeekDataChange('actualWeight', e.target.value)}
                      className="w-full bg-slate-800/90 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <span className="text-emerald-400/70 block text-[9px]">Gerçekleşen Tekrar</span>
                    <input
                      type="text"
                      placeholder="örn: 8, 8"
                      value={weekData.actualReps || ''}
                      onChange={(e) => handleWeekDataChange('actualReps', e.target.value)}
                      className="w-full bg-slate-800/90 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <span className="text-emerald-400/70 block text-[9px]">Hissedilen RPE</span>
                    <input
                      type="text"
                      placeholder="örn: 9"
                      value={weekData.actualRpe || ''}
                      onChange={(e) => handleWeekDataChange('actualRpe', e.target.value)}
                      className="w-full bg-slate-800/90 border border-emerald-500/30 rounded px-2 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Sporcu notu (örn: Son tekrar zorladı, dirsek ağrısı yoktu)"
                    value={weekData.actualNotes || ''}
                    onChange={(e) => handleWeekDataChange('actualNotes', e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded px-2 py-1 text-[11px] text-slate-300 placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
