import React, { useState } from 'react';
import { 
  Dumbbell, 
  UserCheck, 
  Utensils, 
  Flame, 
  Printer, 
  Download, 
  Upload, 
  Plus, 
  RotateCcw, 
  Eye, 
  Edit3, 
  LineChart,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  theme,
  setTheme,
  clients,
  activeClientId,
  setActiveClientId,
  onAddNewClient,
  onExportJson,
  onImportJson,
  onResetData,
  onPrint
}) {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientGoal, setNewClientGoal] = useState('Hipertrofi / Kütle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    onAddNewClient(newClientName.trim(), newClientGoal);
    setNewClientName('');
    setIsClientModalOpen(false);
  };

  const navItems = [
    { id: 'workout', label: 'Antrenman Programı', icon: Dumbbell },
    { id: 'nutrition', label: 'Diyet & Makrolar', icon: Utensils },
    { id: 'warmup', label: 'Isınma & Piramit', icon: Flame },
    { id: 'measurements', label: 'Ölçüm & Takip', icon: LineChart },
  ];

  return (
    <>
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Sol: Logo & Danışan Seçici */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                      CoachFit
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Sade
                    </span>
                  </div>
                </div>
              </div>

              {/* Danışan Dropdown */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 px-2 font-medium hidden sm:inline">Danışan:</span>
                <select
                  value={activeClientId}
                  onChange={(e) => {
                    if (e.target.value === '__add__') {
                      setIsClientModalOpen(true);
                    } else {
                      setActiveClientId(e.target.value);
                    }
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-400 focus:outline-none cursor-pointer pr-1 py-0.5"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {c.name} {c.goal ? `(${c.goal})` : ''}
                    </option>
                  ))}
                  <option value="__add__" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold">
                    + Yeni Danışan Ekle...
                  </option>
                </select>

                <button
                  onClick={() => setIsClientModalOpen(true)}
                  title="Yeni Danışan Ekle"
                  className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Orta: Minimal Navigasyon Sekmeleri */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sağ: Tema (Açık/Koyu) & Mod & Butonlar */}
            <div className="flex items-center gap-2">
              
              {/* Tema Değiştirici (Açık / Koyu Mod) */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title={theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Koç / Danışan Görünümü */}
              <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center">
                <button
                  onClick={() => setViewMode('coach')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'coach'
                      ? 'bg-white text-slate-900 dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Antrenör Düzenleme Modu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Koç Modu</span>
                </button>
                <button
                  onClick={() => setViewMode('client')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'client'
                      ? 'bg-white text-slate-900 dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Danışan Görünümü (Salonda Kullanım)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Danışan</span>
                </button>
              </div>

              {/* Yazdır */}
              <button
                onClick={onPrint}
                title="Yazdır / PDF Olarak Kaydet"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır</span>
              </button>

              {/* Dışa Aktar */}
              <button
                onClick={onExportJson}
                title="JSON Yedek İndir"
                className="hidden sm:flex items-center p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {/* İçe Aktar */}
              <label 
                title="JSON Yedekten Yükle" 
                className="hidden sm:flex items-center cursor-pointer p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={onImportJson}
                />
              </label>

              {/* Sıfırla */}
              <button
                onClick={onResetData}
                title="Örnek Veriye Sıfırla"
                className="hidden sm:flex items-center p-1.5 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Mobil Menü Butonu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={onPrint}
                className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                Yazdır
              </button>
              <button
                onClick={onExportJson}
                className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                Yedek İndir
              </button>
              <button
                onClick={onResetData}
                className="flex items-center gap-1 text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>
          </div>
        )}
      </header>

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
                  className="px-4 py-2 text-xs font-bold text-white dark:text-slate-950 bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-300 rounded-xl transition-colors shadow-sm"
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
