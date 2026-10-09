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
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  theme,
  setTheme,
  clients,
  activeClientId,
  setActiveClientId,
  isCoachLoggedIn,
  currentCoach,
  onOpenLogin,
  onLogout,
  onAddNewClient,
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
                  Pro
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

        {/* 2. Danışan Seçici */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-1 mb-1">
            Aktif Danışan:
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
        </div>

        {/* 3. Mod Switcher (Danışan / Koç Modu) */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-1 mb-1.5">
            Görünüm Modu:
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('client')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'client'
                  ? 'bg-white text-slate-900 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Danışan</span>
            </button>

            <button
              onClick={() => {
                if (isCoachLoggedIn) {
                  setViewMode('coach');
                } else {
                  onOpenLogin();
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'coach'
                  ? 'bg-white text-slate-900 dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isCoachLoggedIn ? <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-slate-950" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
              <span>Koç Modu</span>
            </button>
          </div>

          {/* Koç Oturumu Rozeti */}
          {isCoachLoggedIn ? (
            <div className="mt-2 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="truncate">{currentCoach?.name || 'Koç'}</span>
              </div>
              <button
                onClick={onLogout}
                title="Koç Oturumunu Kapat ve Kilitle"
                className="text-slate-400 hover:text-rose-500 flex items-center gap-0.5 text-[10px]"
              >
                <LogOut className="w-3 h-3" />
                Çıkış
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="mt-2 w-full py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Koç Girişi Yap</span>
            </button>
          )}
        </div>

        {/* 4. Sol Navigasyon Menüsü */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
            Menü:
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

        {/* 5. Alt Araçlar (Tema, Yazdır, Yedek) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center justify-between gap-1">
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

            {/* JSON İndir */}
            <button
              onClick={onExportJson}
              title="Yedek JSON İndir"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* JSON Yükle */}
            <label
              title="Yedek JSON Yükle"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
            </label>

            {/* Sıfırla */}
            <button
              onClick={onResetData}
              title="Örnek Veriye Sıfırla"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-1">
            CoachFit © 2026 • Bilimsel Fitness
          </div>
        </div>

      </aside>

      {/* Yeni Danışan Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-base font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Yeni Danışan Oluştur
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Danışanınız için sıfırdan veya şablon üzerinden program ve diyet hazırlayın.
            </p>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Danışan Adı & Soyadı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hedef & Seviye
                </label>
                <select
                  value={newClientGoal}
                  onChange={(e) => setNewClientGoal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hipertrofi / Kütle (Bulk)">Hipertrofi / Kütle (Bulk)</option>
                  <option value="Definasyon / Yağ Yakımı (Cut)">Definasyon / Yağ Yakımı (Cut)</option>
                  <option value="Güç & Kuvvet (Powerbuilding)">Güç & Kuvvet (Powerbuilding)</option>
                  <option value="Vücut Rekompozisyonu (Recomp)">Vücut Rekompozisyonu (Recomp)</option>
                  <option value="Fonksiyonel Fitness & Kondisyon">Fonksiyonel Fitness & Kondisyon</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white dark:text-slate-950 bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
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
