import React, { useState } from 'react';
import { X, DownloadCloud, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImportProgramModal({
  isOpen,
  onClose,
  client,
  onImportSuccess
}) {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleImport = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    try {
      let rawData = inputCode.trim();
      
      // Eğer tam link yapıştırıldıysa URL'den 'p=' parametresini ayıkla
      if (rawData.includes('?')) {
        const urlParams = new URLSearchParams(rawData.split('?')[1]);
        if (urlParams.has('p')) {
          rawData = urlParams.get('p');
        }
      }

      // Base64 çözümle
      const decodedJson = decodeURIComponent(escape(atob(rawData)));
      const parsed = JSON.parse(decodedJson);

      if (!parsed.workoutProgram) {
        throw new Error("Geçersiz program verisi.");
      }

      onImportSuccess(parsed);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setInputCode('');
        onClose();
      }, 1800);

    } catch (err) {
      setErrorMsg('Geçersiz program kodu veya linki! Lütfen Uras Hoca\'nın gönderdiği bağlantıyı veya kodu eksiksiz yapıştırın.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 dark:text-white">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">Programımı Güncelle / Yükle</h3>
              <p className="text-[11px] text-slate-500">Uras Hoca'nın gönderdiği kod veya link ile güncelleyin</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="my-6 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Program Başarıyla Güncellendi!
            </h4>
            <p className="text-xs text-slate-500">
              Uras Hoca tarafından atanan yeni antrenman ve diyetiniz yüklendi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleImport} className="space-y-3 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Program Linki veya Kodu:
              </label>
              <textarea
                required
                rows={4}
                placeholder="WhatsApp'tan gelen linki veya kodu buraya yapıştırın..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yeni Programı Yükle</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
