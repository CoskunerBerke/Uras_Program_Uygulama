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
  Activity,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
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
    { id: 'workout', label: 'Antrenman Programı', icon: Dumbbell, desc: 'Hareketler, RIR, RPE, Tempo' },
    { id: 'nutrition', label: 'Diyet & Makro / Mikro', icon: Utensils, desc: 'Kalori, Öğünler, Su, Tuz' },
    { id: 'warmup', label: 'Isınma & Hesaplayıcı', icon: Flame, desc: 'McGill Big 3, Bar Piramidi' },
    { id: 'measurements', label: 'Ölçüm & Kilo Takibi', icon: LineChart, desc: 'Tartı, Adım, Bölgesel' },
  ];

  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Danışan Seçici */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      CoachFit
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Pro
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">Akıllı Koçluk & Program Sistemi</p>
                </div>
              </div>

              {/* Danışan Seçim Dropdown */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg p-1">
                  <span className="text-xs text-slate-400 px-2 font-medium hidden md:inline">Danışan:</span>
                  <select
                    value={activeClientId}
                    onChange={(e) => {
                      if (e.target.value === '__add__') {
                        setIsClientModalOpen(true);
                      } else {
                        setActiveClientId(e.target.value);
                      }
                    }}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-emerald-400 focus:outline-none cursor-pointer pr-1 py-1"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                        👤 {c.name} {c.goal ? `(${c.goal})` : ''}
                      </option>
                    ))}
                    <option value="__add__" className="bg-slate-900 text-emerald-400 font-bold">
                      + Yeni Danışan Ekle...
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => setIsClientModalOpen(true)}
                  title="Yeni Danışan Ekle"
                  className="ml-1.5 p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Nav Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sağ Araçlar: Mod Switch & Yazdır & Dışa Aktar */}
            <div className="flex items-center gap-2">
              
              {/* Görünüm Modu: Koç / Danışan */}
              <div className="bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 flex items-center shadow-inner">
                <button
                  onClick={() => setViewMode('coach')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'coach'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Antrenör Düzenleme Modu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Koç Modu</span>
                </button>
                <button
                  onClick={() => setViewMode('client')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'client'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Danışan Görünümü (Salonda Kullanım)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Danışan Görünümü</span>
                </button>
              </div>

              {/* Yazdır / PDF */}
              <button
                onClick={onPrint}
                title="Yazdır / PDF Olarak Kaydet"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Yazdır</span>
              </button>

              {/* Dışa Aktar */}
              <button
                onClick={onExportJson}
                title="Verileri JSON Yedekle"
                className="hidden sm:flex items-center gap-1 p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* İçe Aktar */}
              <label 
                title="JSON Yedekten Geri Yükle" 
                className="hidden sm:flex items-center cursor-pointer p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
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
                className="hidden sm:flex items-center p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.desc}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-around">
              <button
                onClick={onPrint}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-2 rounded-lg"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Yazdır / PDF
              </button>
              <button
                onClick={onExportJson}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-2 rounded-lg"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                JSON İndir
              </button>
              <button
                onClick={onResetData}
                className="flex items-center gap-1.5 text-xs text-rose-300 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                Sıfırla
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Yeni Danışan Ekleme Modalı */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Yeni Danışan Oluştur
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Danışanınız için sıfırdan veya şablon üzerinden program ve diyet hazırlayabilirsiniz.
            </p>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danışan Adı & Soyadı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hedef & Seviye
                </label>
                <select
                  value={newClientGoal}
                  onChange={(e) => setNewClientGoal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-colors"
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
