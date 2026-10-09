import React, { useState } from 'react';
import { 
  Dumbbell, 
  Lock, 
  User, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Sun, 
  Moon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const CLIENT_ACCOUNTS_KEY = 'coachfit_client_accounts';

export default function AuthPortal({
  onLoginSuccess,
  clients,
  onRegisterClient,
  theme,
  setTheme
}) {
  // 'client' | 'coach'
  const [portalType, setPortalType] = useState('client');
  // 'login' | 'register' (sadece danışanlar için)
  const [clientAuthMode, setClientAuthMode] = useState('login');

  // Ortak form state'leri
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [goal, setGoal] = useState('Hipertrofi / Kütle Kazanımı');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Danışan Girişi
  const handleClientLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || !password) {
      setErrorMessage('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    // Kayıtlı hesapları al
    const storedAccounts = JSON.parse(localStorage.getItem(CLIENT_ACCOUNTS_KEY) || '[]');
    
    // Varsayılan Berke hesabı kontrolü
    const isDefaultBerke = (cleanUser === 'berke' && (password === '123' || password === '1234'));
    
    let matched = storedAccounts.find(
      acc => acc.username.toLowerCase() === cleanUser && acc.password === password
    );

    if (!matched && isDefaultBerke) {
      matched = {
        id: 'acc-default-berke',
        username: 'berke',
        name: 'Berke Coşkuner',
        clientId: clients[0]?.id || 'client-1'
      };
    }

    if (matched) {
      // İlgili client profilini doğrula
      const targetClient = clients.find(c => c.id === matched.clientId) || clients[0];
      
      const sessionUser = {
        role: 'client',
        clientId: targetClient.id,
        name: targetClient.name || matched.name,
        username: matched.username
      };

      onLoginSuccess(sessionUser);
    } else {
      setErrorMessage('Kullanıcı adı veya şifre hatalı. Kayıtlı değilseniz "Kayıt Ol" sekmesinden yeni üyelik oluşturabilirsiniz.');
    }
  };

  // 2. Danışan Kayıt Olma
  const handleClientRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || !cleanUser || !password) {
      setErrorMessage('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (cleanUser === 'admin_123' || cleanUser === 'admin' || cleanUser === 'uras') {
      setErrorMessage('Bu kullanıcı adı sistem yöneticisi için ayrılmıştır, kullanılamaz.');
      return;
    }

    if (password.length < 3) {
      setErrorMessage('Şifreniz en az 3 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle uyuşmuyor.');
      return;
    }

    const storedAccounts = JSON.parse(localStorage.getItem(CLIENT_ACCOUNTS_KEY) || '[]');
    const isTaken = storedAccounts.some(acc => acc.username.toLowerCase() === cleanUser) || cleanUser === 'berke';

    if (isTaken) {
      setErrorMessage('Bu kullanıcı adı zaten alınmış. Lütfen farklı bir kullanıcı adı seçiniz veya giriş yapınız.');
      return;
    }

    // Yeni Danışan oluştur
    const newClientId = `client-${Date.now()}`;
    const newClient = onRegisterClient(newClientId, cleanName, goal);

    // Yeni Hesabı kaydet
    const newAccount = {
      id: `acc-${Date.now()}`,
      username: cleanUser,
      password: password,
      clientId: newClientId,
      name: cleanName
    };

    storedAccounts.push(newAccount);
    localStorage.setItem(CLIENT_ACCOUNTS_KEY, JSON.stringify(storedAccounts));

    // Oturumu başlat
    const sessionUser = {
      role: 'client',
      clientId: newClientId,
      name: cleanName,
      username: cleanUser
    };

    onLoginSuccess(sessionUser);
  };

  // 3. Koç / Yönetici Girişi (Kesin ve Tavizsiz Güvenlik Kontrolü)
  const handleCoachLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanUser = username.trim();

    // Sadece admin_123 ve uras_admin_123 kabul edilir
    if (cleanUser === 'admin_123' && password === 'uras_admin_123') {
      const sessionUser = {
        role: 'coach',
        name: 'Uras Hoca (Yönetici)',
        username: 'admin_123'
      };
      onLoginSuccess(sessionUser);
    } else {
      setErrorMessage('Yetkisiz erişim! Yönetici kullanıcı adı veya şifresi hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 transition-colors duration-200">
      
      {/* Sağ Üst Tema Değiştirici */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Açık Mod</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Koyu Mod</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* Logo & Başlık */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 mb-3">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white">
            CoachFit <span className="text-emerald-600 dark:text-emerald-400">Pro</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bilimsel Antrenman, Beslenme & Danışan Takip Platformu
          </p>
        </div>

        {/* Ana Kart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-7 backdrop-blur-md">
          
          {/* 1. Üst Portal Seçici (Danışan / Koç) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setPortalType('client');
                setErrorMessage('');
                setUsername('');
                setPassword('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                portalType === 'client'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Danışan Portalı</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('coach');
                setErrorMessage('');
                setUsername('');
                setPassword('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                portalType === 'coach'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Koç / Yönetici</span>
            </button>
          </div>

          {/* Hata veya Bilgi Mesajı */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ===================== DANIŞAN GİRİŞİ / KAYDI ===================== */}
          {portalType === 'client' && (
            <div>
              {/* Giriş / Kayıt Geçiş Sekmesi */}
              <div className="flex items-center justify-center gap-6 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setClientAuthMode('login');
                    setErrorMessage('');
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    clientAuthMode === 'login'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Üye Girişi Yap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientAuthMode('register');
                    setErrorMessage('');
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    clientAuthMode === 'register'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Yeni Üyelik Oluştur
                </button>
              </div>

              {/* Danışan Giriş Formu */}
              {clientAuthMode === 'login' && (
                <form onSubmit={handleClientLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Kullanıcı Adı
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: berke"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Şifre
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Danışan Olarak Giriş Yap</span>
                  </button>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                    <p className="text-[11px] text-slate-400">
                      💡 Örnek Giriş: Kullanıcı: <strong className="text-slate-600 dark:text-slate-300">berke</strong> • Şifre: <strong className="text-slate-600 dark:text-slate-300">123</strong>
                    </p>
                  </div>
                </form>
              )}

              {/* Danışan Kayıt Formu */}
              {clientAuthMode === 'register' && (
                <form onSubmit={handleClientRegister} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Adınız Soyadınız
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Kullanıcı Adı (Giriş için)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: ahmetyilmaz"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Şifre
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Şifre Tekrar
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Fitness Hedefiniz
                    </label>
                    <div className="relative">
                      <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Hipertrofi / Kütle Kazanımı">Hipertrofi / Kütle Kazanımı</option>
                        <option value="Yağ Yakımı / Definasyon">Yağ Yakımı / Definasyon</option>
                        <option value="Güç / Powerlifting">Güç / Powerlifting</option>
                        <option value="Genel Sağlık & Kondisyon">Genel Sağlık & Kondisyon</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Kaydı Tamamla & Başla</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ===================== KOÇ / YÖNETİCİ GİRİŞİ ===================== */}
          {portalType === 'coach' && (
            <div>
              <div className="mb-4 text-center">
                <div className="inline-flex p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Yönetici & Koç Girişi
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Antrenör paneline sadece yetkili yönetici erişebilir.
                </p>
              </div>

              <form onSubmit={handleCoachLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Yönetici Kullanıcı Adı
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="admin_123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Yönetici Şifresi
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Koç Olarak Giriş Yap</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Güvenlik Notu */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Tüm oturumlar ve veriler izole edilmiş güvenlik katmanıyla korunmaktadır.</span>
          </p>
        </div>

      </div>

    </div>
  );
}
