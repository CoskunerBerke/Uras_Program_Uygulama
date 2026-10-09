import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Dumbbell, 
  Utensils, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { WORKOUT_TEMPLATES, NUTRITION_TEMPLATES } from '../../data/workoutTemplates';

export default function AssignProgramModal({
  isOpen,
  onClose,
  clients,
  activeClient,
  onAssignToClient
}) {
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientNameInput, setClientNameInput] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('current'); // 'current' or template ID
  const [selectedDietId, setSelectedDietId] = useState('current'); // 'current' or diet ID

  const [assignedResult, setAssignedResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Girilen ID listede var mı?
  const matchedClient = clients.find(c => 
    (c.clientCode && c.clientCode.toLowerCase() === clientIdInput.trim().toLowerCase()) ||
    c.id.toLowerCase() === clientIdInput.trim().toLowerCase()
  );

  const handleAssign = (e) => {
    e.preventDefault();
    const cleanId = clientIdInput.trim().toUpperCase();
    if (!cleanId) return;

    // 1. Programı belirle
    let finalWorkout = activeClient.workoutProgram;
    if (selectedTemplateId !== 'current') {
      const t = WORKOUT_TEMPLATES.find(t => t.id === selectedTemplateId);
      if (t) finalWorkout = t.program;
    }

    // 2. Diyeti belirle
    let finalNutrition = activeClient.nutritionPlan;
    if (selectedDietId !== 'current') {
      const d = NUTRITION_TEMPLATES.find(d => d.id === selectedDietId);
      if (d) {
        finalNutrition = {
          ...activeClient.nutritionPlan,
          targetKcal: d.targetKcal,
          macroTargets: d.macroTargets,
          waterLiters: d.waterLiters,
          dietType: d.title
        };
      }
    }

    const assignedName = matchedClient ? matchedClient.name : (clientNameInput.trim() || `Danışan (${cleanId})`);

    // 3. App state'e aktar
    const result = onAssignToClient({
      clientId: cleanId,
      name: assignedName,
      workoutProgram: finalWorkout,
      nutritionPlan: finalNutrition
    });

    // 4. Paylaşım linki ve kodu üret
    const payload = {
      clientId: cleanId,
      name: assignedName,
      workoutProgram: finalWorkout,
      nutritionPlan: finalNutrition,
      assignedAt: new Date().toISOString()
    };

    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const shareUrl = `${window.location.origin}${window.location.pathname}?assign=${cleanId}&p=${encodedData}`;

    setAssignedResult({
      clientName: assignedName,
      clientId: cleanId,
      shareUrl,
      code: encodedData
    });
  };

  const handleCopyLink = () => {
    if (!assignedResult?.shareUrl) return;
    navigator.clipboard.writeText(assignedResult.shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!assignedResult?.code) return;
    navigator.clipboard.writeText(assignedResult.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!assignedResult) return;
    const msg = `Merhaba ${assignedResult.clientName}, Uras Hoca tarafından sana özel hazırlanan fitness ve diyet programın hazır! 🎯\n\nDoğrudan telefonundan programına başlamak için tıkla:\n${assignedResult.shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-900 dark:text-white max-h-[92vh] flex flex-col">
        
        {/* Üst Başlık */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">
                Danışan Koduyla (Client ID) Program Ata
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Danışanın kodunu girerek hazırladığınız veya şablon programı saniyeler içinde tanımlayın
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* DURUM 1: Henüz Atanmadı (Form Ekranı) */}
          {!assignedResult ? (
            <form onSubmit={handleAssign} className="space-y-4">
              
              {/* 1. Danışan Kodu (Client ID) Inputu */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Danışan Kodu (Client ID)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Örn: CF-101 veya AHMET"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  {/* Hızlı Seçim Dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const c = clients.find(cl => cl.id === e.target.value);
                        if (c) {
                          setClientIdInput(c.clientCode || c.id);
                          setClientNameInput(c.name);
                        }
                      }
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Kayıtlılardan Seç...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.clientCode ? `${c.clientCode} - ` : ''}{c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Eşleşen Danışan Bildirimi */}
                {matchedClient ? (
                  <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>✓ Kayıtlı Danışan: <strong>{matchedClient.name}</strong> ({matchedClient.goal || 'Hipertrofi'})</span>
                  </div>
                ) : clientIdInput.trim() ? (
                  <div className="mt-2.5 space-y-1.5 animate-in fade-in">
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block">
                      + Yeni bir danışan kodu girildi. Adını belirtiniz:
                    </span>
                    <input
                      type="text"
                      placeholder="Danışan Adı Soyadı (Örn: Mehmet Öz)"
                      value={clientNameInput}
                      onChange={(e) => setClientNameInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ) : null}
              </div>

              {/* 2. Atanacak Antrenman Programı */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Atanacak Antrenman Programı
                </label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedTemplateId === 'current'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="workoutTemplate"
                      checked={selectedTemplateId === 'current'}
                      onChange={() => setSelectedTemplateId('current')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Şu Anki Hazırladığım Program ({activeClient.workoutProgram.splitName})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Ekranda hazırladığınız tüm hareketler, alternatifli seçenekler, RIR/RPE ve notlar bu danışana aktarılır.
                      </p>
                    </div>
                  </label>

                  {WORKOUT_TEMPLATES.map(t => (
                    <label key={t.id} className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedTemplateId === t.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                      <input
                        type="radio"
                        name="workoutTemplate"
                        checked={selectedTemplateId === t.id}
                        onChange={() => setSelectedTemplateId(t.id)}
                        className="mt-1 accent-emerald-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{t.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                            {t.daysCount} Gün
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Atanacak Diyet Planı */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  3. Atanacak Diyet & Makro Planı
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs ${
                    selectedDietId === 'current'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="dietTemplate"
                      checked={selectedDietId === 'current'}
                      onChange={() => setSelectedDietId('current')}
                      className="accent-emerald-600"
                    />
                    <span>Mevcut Diyet Planı</span>
                  </label>

                  {NUTRITION_TEMPLATES.map(d => (
                    <label key={d.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs ${
                      selectedDietId === d.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="dietTemplate"
                        checked={selectedDietId === d.id}
                        onChange={() => setSelectedDietId(d.id)}
                        className="accent-emerald-600"
                      />
                      <span>{d.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kaydet & Ata Butonu */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.99] mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Programı Bu Danışana Ata & Paylaş</span>
              </button>

            </form>
          ) : (
            /* DURUM 2: Başarıyla Atandı (Paylaşım Ekranı) */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-black text-base text-slate-900 dark:text-white">
                  Program Başarıyla Atandı!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <strong>{assignedResult.clientName}</strong> ({assignedResult.clientId}) için antrenman ve beslenme programı hazırlandı.
                </p>
              </div>

              {/* WhatsApp ile Gönder Butonu */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>📲 WhatsApp ile Danışana Gönder (Tek Tık)</span>
              </button>

              {/* Bağlantıyı Kopyala */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 block">
                  Danışanın Otomatik Yükleme Bağlantısı:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={assignedResult.shareUrl}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-400 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>

              {/* Kod Olarak Kopyala */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleCopyCode}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Program Kodu Kopyalandı' : 'Alternatif: Ham Program Kodunu Kopyala'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setAssignedResult(null);
                  onClose();
                }}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center"
              >
                Kapat
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
