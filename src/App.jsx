import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WorkoutBuilder from './components/WorkoutBuilder/WorkoutBuilder';
import NutritionPlanner from './components/NutritionPlanner/NutritionPlanner';
import WarmupSection from './components/WorkoutBuilder/WarmupSection';
import MeasurementTracker from './components/Measurements/MeasurementTracker';
import ClientPortal from './components/ClientView/ClientPortal';
import PrintExportView from './components/PrintView/PrintExportView';
import AuthModal from './components/Auth/AuthModal';
import { DEFAULT_CLIENT } from './data/defaultData';
import { Menu, Sun, Moon, Eye, Edit3, Lock, LogOut } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'coachfit_clients_v3';
const THEME_STORAGE_KEY = 'coachfit_theme';
const COACH_AUTH_KEY = 'coachfit_current_coach';

export default function App() {
  // Tema (Açık / Koyu)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Koç Oturumu
  const [currentCoach, setCurrentCoach] = useState(() => {
    try {
      const saved = localStorage.getItem(COACH_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Danışanlar
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }
    return [DEFAULT_CLIENT];
  });

  const [activeClientId, setActiveClientId] = useState(() => {
    return clients[0]?.id || DEFAULT_CLIENT.id;
  });

  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'nutrition' | 'warmup' | 'measurements'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(COACH_AUTH_KEY) ? 'coach' : 'client';
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  }, [clients]);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0] || DEFAULT_CLIENT;

  const handleLoginSuccess = (coach) => {
    setCurrentCoach(coach);
    setViewMode('coach');
  };

  const handleLogout = () => {
    localStorage.removeItem(COACH_AUTH_KEY);
    setCurrentCoach(null);
    setViewMode('client');
  };

  const handleUpdateActiveClient = (updated) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddNewClient = (name, goal) => {
    const newId = `client-${Date.now()}`;
    const newClient = {
      ...DEFAULT_CLIENT,
      id: newId,
      name,
      goal,
      startDate: new Date().toISOString().split('T')[0],
      workoutProgram: {
        ...DEFAULT_CLIENT.workoutProgram,
        splitName: `${name} - Programı`,
        activeWeek: 1
      },
      nutritionPlan: {
        ...DEFAULT_CLIENT.nutritionPlan,
        dietType: `${name} - Beslenme Planı`
      }
    };

    setClients(prev => [...prev, newClient]);
    setActiveClientId(newId);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CoachFit_Programlar_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e) => {
    const fileReader = new FileReader();
    if (!e.target.files?.[0]) return;
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClients(parsed);
          setActiveClientId(parsed[0].id);
          alert("Program başarıyla yüklendi!");
        } else {
          alert("Geçersiz dosya!");
        }
      } catch (err) {
        alert("Hata: " + err.message);
      }
    };
  };

  const handleResetData = () => {
    if (window.confirm("Tüm değişiklikleri sıfırlayıp e-tablodaki orijinal Berke antrenman & beslenme verilerine dönmek istiyor musunuz?")) {
      setClients([DEFAULT_CLIENT]);
      setActiveClientId(DEFAULT_CLIENT.id);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'workout': return 'Antrenman Programı';
      case 'nutrition': return 'Diyet & Makrolar';
      case 'warmup': return 'Isınma & Bar Piramidi';
      case 'measurements': return 'Ölçüm & Kilo Takibi';
      default: return 'CoachFit';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      
      {/* 1. Sol Seçenek Menüsü (Sidebar) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        clients={clients}
        activeClientId={activeClientId}
        setActiveClientId={setActiveClientId}
        isCoachLoggedIn={!!currentCoach}
        currentCoach={currentCoach}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onAddNewClient={handleAddNewClient}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetData={handleResetData}
        onPrint={handlePrint}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* 2. Sağ Ana İçerik Alanı (Sidebar genişliği kadar sola boşluklu: lg:pl-72) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Mobil Üst Bar */}
        <header className="lg:hidden h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30 no-print">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
              {getPageTitle()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {viewMode === 'coach' ? 'Koç' : 'Danışan'}
            </span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Ana İçerik Canvas */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 no-print">
          
          {/* TAB 1: ANTRENMAN PROGRAMI */}
          {activeTab === 'workout' && (
            viewMode === 'client' ? (
              <ClientPortal
                client={activeClient}
                onUpdateClient={handleUpdateActiveClient}
              />
            ) : (
              <WorkoutBuilder
                workoutProgram={activeClient.workoutProgram}
                onUpdateWorkoutProgram={(updated) => handleUpdateActiveClient({ ...activeClient, workoutProgram: updated })}
                viewMode={viewMode}
              />
            )
          )}

          {/* TAB 2: DİYET & MAKROLAR (Danışan ve Koç Modu) */}
          {activeTab === 'nutrition' && (
            <NutritionPlanner
              client={activeClient}
              nutritionPlan={activeClient.nutritionPlan}
              onUpdateNutritionPlan={(updated) => handleUpdateActiveClient({ ...activeClient, nutritionPlan: updated })}
              viewMode={viewMode}
            />
          )}

          {/* TAB 3: ISINMA & BAR PİRAMİDİ (Danışan ve Koç Modu) */}
          {activeTab === 'warmup' && (
            <WarmupSection
              warmupPlan={activeClient.workoutProgram.warmupPlan}
              onUpdateWarmupPlan={(updated) => handleUpdateActiveClient({
                ...activeClient,
                workoutProgram: {
                  ...activeClient.workoutProgram,
                  warmupPlan: updated
                }
              })}
            />
          )}

          {/* TAB 4: ÖLÇÜM & KİLO TAKİBİ (Danışan ve Koç Modu) */}
          {activeTab === 'measurements' && (
            <MeasurementTracker
              measurements={activeClient.measurements}
              onUpdateMeasurements={(updated) => handleUpdateActiveClient({ ...activeClient, measurements: updated })}
            />
          )}

        </main>

        {/* Yazdırma / PDF Çıktı Görünümü */}
        <PrintExportView client={activeClient} />

      </div>

      {/* Koç Giriş & Kayıt Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
