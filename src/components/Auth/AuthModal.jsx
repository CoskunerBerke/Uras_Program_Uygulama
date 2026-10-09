import React, { useState } from 'react';
import { Lock, User, KeyRound, UserPlus, LogIn, X, ShieldCheck } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [coachFullName, setCoachFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }

    // LocalStorage'dan kayıtlı koçları al
    const storedCoaches = JSON.parse(localStorage.getItem('coachfit_accounts') || '[]');
    
    // Varsayılan hesap veya kayıtlı hesap kontrolü
    const matched = storedCoaches.find(
      c => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password
    );

    // İlk açılışta varsayılan "admin" / "1234" veya "koc" / "1234" kabulü
    const isDefault = (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'koc') && password === '1234';

    if (matched || isDefault) {
      const activeUser = matched || { username: username.trim(), name: 'Antrenör' };
      localStorage.setItem('coachfit_current_coach', JSON.stringify(activeUser));
      onLoginSuccess(activeUser);
      onClose();
    } else {
      setErrorMsg('Kullanıcı adı veya şifre hatalı! (Varsayılan test hesabı: kullanıcı: admin, şifre: 1234)');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Şifreler birbiriyle uyuşmuyor.');
      return;
    }

    const storedCoaches = JSON.parse(localStorage.getItem('coachfit_accounts') || '[]');
    const exists = storedCoaches.some(c => c.username.toLowerCase() === username.trim().toLowerCase());

    if (exists) {
      setErrorMsg('Bu kullanıcı adı zaten kayıtlı. Lütfen giriş yapın.');
      return;
    }

    const newCoach = {
      id: `coach-${Date.now()}`,
      username: username.trim(),
      name: coachFullName.trim() || username.trim(),
      password: password
    };

    storedCoaches.push(newCoach);
    localStorage.setItem('coachfit_accounts', JSON.stringify(storedCoaches));
    localStorage.setItem('coachfit_current_coach', JSON.stringify(newCoach));

    onLoginSuccess(newCoach);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">
                {isRegisterMode ? 'Koç Hesabı Oluştur' : 'Koç Girişi'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Program ve diyet düzenlemek için giriş yapın
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-3">
          
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Örn: Uras Hoca"
                  value={coachFullName}
                  onChange={(e) => setCoachFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Kullanıcı Adı veya E-posta
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="Örn: admin veya uras"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Şifre
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Şifre Tekrar
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-2"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                Kayıt Ol ve Giriş Yap
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Giriş Yap
              </>
            )}
          </button>
        </form>

        {/* Alt Geçiş Linki */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          {isRegisterMode ? (
            <p className="text-slate-500">
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMsg('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Giriş Yap
              </button>
            </p>
          ) : (
            <p className="text-slate-500">
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMsg('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Yeni Hesap Oluştur
              </button>
            </p>
          )}

          {!isRegisterMode && (
            <p className="text-[10px] text-slate-400 mt-2">
              💡 Hızlı test hesabı: <strong>admin</strong> / şifre: <strong>1234</strong>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
