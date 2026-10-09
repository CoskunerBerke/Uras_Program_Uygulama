import React, { useState } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Flame, 
  LineChart, 
  Sun, 
  Moon, 
  Printer, 
  Download, 
  Upload, 
  RotateCcw, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Eye, 
  UserCheck, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Target
} from 'lucide-react';

export default function Sidebar({
  currentUser,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  theme,
  setTheme,
  clients,
  activeClientId,
  setActiveClientId,
  onLogout,
  onAddNewClient,
  onOpenAssignModal,
  onExportJson,
  onImportJson,
  onResetData,
  onPrint,
  mobileOpen,
  setMobileOpen
}) {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientGoal, setNewClientGoal] = useState('Hipertrofi / Kütle');

  const isCoach = currentUser?.role === 'coach';
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    onAddNewClient(newClientName.trim(), newClientGoal);
    setNewClientName('');
    setIsClientModalOpen(false);
  };

  const navItems = [
    { id: 'workout', label: 'Antrenman Programı', icon: Dumbbell, desc: 'Hareketler & Setler' },
    { id: 'nutrition', label: 'Diyet & Makrolar', icon: Utensils, desc: 'Öğünler, Su & Kalori' },
    { id: 'warmup', label: 'Isınma & Piramit', icon: Flame, desc: 'McGill Big 3 & Bar Yükü' },
    { id: 'measurements', label: 'Ölçüm & Takip', icon: LineChart, desc: 'Tartı, Adım & Mezura' },
  ];

  return (
    <>
      {/* Mobil Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sol Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } no-print`}>
        
        {/* 1. Üst Logo & Kapat Butonu */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  CoachFit
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {isCoach ? 'Yönetici' : 'Üye'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Fitness & Diyet Yönetimi</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. KULLANICI PROFİLİ VEYA KOÇ DANIŞAN SEÇİCİSİ */}
        {isCoach ? (
          /* KOÇ GÖRÜNÜMÜ: Danışan Seçici ve Ekleme */
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Koç: {currentUser?.name || 'Uras Hoca'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {clients.length} Danışan
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <select
                value={activeClientId}
                onChange={(e) => {
                  if (e.target.value === '__add__') {
                    setIsClientModalOpen(true);
                  } else {
                    setActiveClientId(e.target.value);
                  }
                }}
                className="flex-1 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer pl-1.5 py-1"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    👤 {c.name} {c.goal ? `(${c.goal})` : ''}
                  </option>
                ))}
                <option value="__add__" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold">
                  + Yeni Danışan Ekle...
                </option>
              </select>

              <button
                onClick={() => setIsClientModalOpen(true)}
                title="Yeni Danışan Ekle"
                className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Koç Önizleme Switcher */}
            <div className="mt-2 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center">
              <button
                onClick={() => setViewMode('coach')}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  viewMode === 'coach'
                    ? 'bg-white text-amber-700 dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Düzenleme</span>
              </button>
              <button
                onClick={() => setViewMode('client')}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  viewMode === 'client'
                    ? 'bg-white text-emerald-700 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Sporcu Önizleme</span>
              </button>
            </div>

            {/* Danışan Koduyla (Client ID) Program Ata Butonu */}
            <button
              onClick={onOpenAssignModal}
              className="mt-2 w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <Target className="w-4 h-4 text-slate-950" />
              <span>Client ID ile Program Ata</span>
            </button>
          </div>
        ) : (
          /* DANIŞAN GÖRÜNÜMÜ: Sadece Kendi Profil Bilgisi (Diğer danışanlar asla görünmez!) */
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Danışan Hesabı</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Sol Navigasyon Menüsü */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
            Program Menüsü:
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <span className="block font-bold">{item.label}</span>
                    <span className={`text-[10px] font-normal block ${isActive ? 'opacity-80' : 'text-slate-400'}`}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-90' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </nav>

        {/* 4. Alt Araçlar & Çıkış Yap */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center justify-between gap-1.5">
            {/* Tema Değiştirici */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Açık Mod</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Koyu Mod</span>
                </>
              )}
            </button>

            {/* Yazdır */}
            <button
              onClick={onPrint}
              title="Yazdır / PDF Olarak Kaydet"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Sadece Koçlar İçin Yedekleme ve Sıfırlama */}
            {isCoach && (
              <>
                <button
                  onClick={onExportJson}
                  title="Yedek JSON İndir"
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <Download className="w-4 h-4" />
                </button>

                <label
                  title="Yedek JSON Yükle"
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
                </label>

                <button
                  onClick={onResetData}
                  title="Örnek Veriye Sıfırla"
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* GÜVENLİ ÇIKIŞ BUTONU */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Güvenli Çıkış Yap</span>
          </button>

        </div>

      </aside>

      {/* Yeni Danışan Ekle Modal (Sadece Koç Modunda Kullanılabilir) */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-xl p-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm">Yeni Danışan Oluştur</h3>
              </div>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Danışan Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Mehmet Demir"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hedef / Odak
                </label>
                <select
                  value={newClientGoal}
                  onChange={(e) => setNewClientGoal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Hipertrofi / Kütle">Hipertrofi / Kütle</option>
                  <option value="Yağ Yakımı / Definasyon">Yağ Yakımı / Definasyon</option>
                  <option value="Güç / Powerlifting">Güç / Powerlifting</option>
                  <option value="Kondisyon / Atletik Performans">Kondisyon / Atletik Performans</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Danışanı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
