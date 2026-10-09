import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WorkoutBuilder from './components/WorkoutBuilder/WorkoutBuilder';
import NutritionPlanner from './components/NutritionPlanner/NutritionPlanner';
import WarmupSection from './components/WorkoutBuilder/WarmupSection';
import MeasurementTracker from './components/Measurements/MeasurementTracker';
import ClientPortal from './components/ClientView/ClientPortal';
import PrintExportView from './components/PrintView/PrintExportView';
import AuthPortal from './components/Auth/AuthPortal';
import AssignProgramModal from './components/CoachView/AssignProgramModal';
import { DEFAULT_CLIENT } from './data/defaultData';
import { Menu, Sun, Moon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'coachfit_clients_v3';
const THEME_STORAGE_KEY = 'coachfit_theme';
const SESSION_AUTH_KEY = 'coachfit_session_user';

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

  // Oturum Yönetimi (SessionStorage: Tarayıcı/Sekme kapandığında silinir, her girişte tekrar şifre ister!)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Danışanlar Veritabanı
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

  // Varsayılan Berke hesabını başlat
  useEffect(() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('coachfit_client_accounts') || '[]');
      if (!accounts.some(a => a.username.toLowerCase() === 'berke')) {
        accounts.push({
          id: 'acc-berke',
          username: 'berke',
          password: '123',
          clientId: DEFAULT_CLIENT.id,
          name: 'Berke Coşkuner'
        });
        localStorage.setItem('coachfit_client_accounts', JSON.stringify(accounts));
      }
    } catch (e) {
      console.error("Account init error:", e);
    }
  }, []);

  // WhatsApp veya Paylaşım Linki ile gelen Programı Otomatik Algıla (?assign=...&p=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const payloadBase64 = urlParams.get('p');
      const assignCode = urlParams.get('assign');

      if (payloadBase64) {
        const decodedJson = decodeURIComponent(escape(atob(payloadBase64)));
        const parsed = JSON.parse(decodedJson);

        if (parsed && parsed.workoutProgram) {
          const targetClientId = parsed.clientId || assignCode || `client-${Date.now()}`;
          const targetName = parsed.name || 'Danışan';

          setClients(prev => {
            const existingIdx = prev.findIndex(c => 
              c.id === targetClientId || (c.clientCode && c.clientCode.toUpperCase() === targetClientId.toUpperCase())
            );
            let updated;
            if (existingIdx >= 0) {
              updated = [...prev];
              updated[existingIdx] = {
                ...updated[existingIdx],
                workoutProgram: parsed.workoutProgram,
                nutritionPlan: parsed.nutritionPlan || updated[existingIdx].nutritionPlan
              };
            } else {
              const newClient = {
                ...DEFAULT_CLIENT,
                id: targetClientId,
                clientCode: targetClientId,
                name: targetName,
                workoutProgram: parsed.workoutProgram,
                nutritionPlan: parsed.nutritionPlan || DEFAULT_CLIENT.nutritionPlan
              };
              updated = [...prev, newClient];
            }
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            } catch (err) {
              console.error(err);
            }
            return updated;
          });

          // Oturumu başlat
          const sessionUser = {
            role: 'client',
            clientId: targetClientId,
            name: targetName,
            username: targetClientId.toLowerCase()
          };
          sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(sessionUser));
          setCurrentUser(sessionUser);
          setCoachActiveClientId(targetClientId);

          alert(`🎉 Tebrikler ${targetName}! Uras Hoca tarafından sana özel hazırlanan yeni program başarıyla yüklendi!`);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (err) {
      console.error("URL import error:", err);
    }
  }, []);

  // Aktif Danışan ID'si
  const [coachActiveClientId, setCoachActiveClientId] = useState(() => {
    return clients[0]?.id || DEFAULT_CLIENT.id;
  });

  // Güvenlik Kuralı: Eğer kullanıcı danışan ise SADECE kendi ID'sini görebilir!
  const activeClientId = currentUser?.role === 'client' 
    ? currentUser.clientId 
    : coachActiveClientId;

  const setActiveClientId = (id) => {
    if (currentUser?.role === 'coach') {
      setCoachActiveClientId(id);
    }
  };

  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'nutrition' | 'warmup' | 'measurements'
  
  // Görünüm Modu: Danışan ise daima 'client'. Koç ise 'coach' veya sporcu önizlemesi için 'client' seçebilir.
  const [coachViewMode, setCoachViewMode] = useState('coach');
  const viewMode = currentUser?.role === 'client' ? 'client' : coachViewMode;
  
  const setViewMode = (mode) => {
    if (currentUser?.role === 'coach') {
      setCoachViewMode(mode);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  }, [clients]);

  // Aktif Danışan Profili
  const activeClient = clients.find(c => 
    c.id === activeClientId || (c.clientCode && c.clientCode.toUpperCase() === activeClientId?.toUpperCase())
  ) || clients[0] || DEFAULT_CLIENT;

  // Başarılı Giriş Yapıldığında
  const handleLoginSuccess = (user) => {
    sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(user));
    setCurrentUser(user);
    if (user.role === 'client') {
      setCoachViewMode('client');
    } else {
      setCoachViewMode('coach');
    }
  };

  // Güvenli Çıkış Yapıldığında
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    setCurrentUser(null);
    setCoachViewMode('coach');
    setActiveTab('workout');
  };

  // Danışan Kayıt Olduğunda Yeni Profil Oluşturma
  const handleRegisterClient = (newClientId, name, goal) => {
    // Şık bir Danışan Kodu oluştur: Örn: CF-102
    const codeNum = 100 + clients.length + 1;
    const clientCode = `CF-${codeNum}`;

    const newClient = {
      ...DEFAULT_CLIENT,
      id: newClientId,
      clientCode: clientCode,
      name,
      goal: goal || 'Hipertrofi / Kütle',
      startDate: new Date().toISOString().split('T')[0],
      workoutProgram: {
        ...DEFAULT_CLIENT.workoutProgram,
        splitName: `${name} - Özel Program`,
        activeWeek: 1
      },
      nutritionPlan: {
        ...DEFAULT_CLIENT.nutritionPlan,
        dietType: `${name} - Beslenme Planı`
      }
    };

    setClients(prev => {
      const updated = [...prev, newClient];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    return newClient;
  };

  // Danışan Güncelleme (Koç veya Danışanın kendisi)
  const handleUpdateActiveClient = (updated) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Koç Tarafından Yeni Danışan Ekleme
  const handleAddNewClient = (name, goal) => {
    const newId = `client-${Date.now()}`;
    handleRegisterClient(newId, name, goal);
    setCoachActiveClientId(newId);
  };

  // Koç Tarafından Client ID ile Program Atama
  const handleAssignToClient = ({ clientId, name, workoutProgram, nutritionPlan }) => {
    let targetId = clientId;
    setClients(prev => {
      const idx = prev.findIndex(c => 
        c.id === clientId || (c.clientCode && c.clientCode.toUpperCase() === clientId.toUpperCase())
      );
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        targetId = updated[idx].id;
        updated[idx] = {
          ...updated[idx],
          name: name || updated[idx].name,
          clientCode: clientId,
          workoutProgram,
          nutritionPlan
        };
      } else {
        const newClient = {
          ...DEFAULT_CLIENT,
          id: clientId,
          clientCode: clientId,
          name: name || `Danışan (${clientId})`,
          workoutProgram,
          nutritionPlan
        };
        updated = [...prev, newClient];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    setCoachActiveClientId(targetId);
    return { targetId };
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
          setCoachActiveClientId(parsed[0].id);
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
      setCoachActiveClientId(DEFAULT_CLIENT.id);
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

  // =========================================================================
  // GÜVENLİK KATMANI: Giriş Yapılmamışsa SADECE AuthPortal Render Edilir!
  // =========================================================================
  if (!currentUser) {
    return (
      <AuthPortal
        onLoginSuccess={handleLoginSuccess}
        clients={clients}
        onRegisterClient={handleRegisterClient}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  // =========================================================================
  // GİRİŞ YAPILMIŞ: Rolüne Uygun İzole Arayüz
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      
      {/* 1. Sol Seçenek Menüsü (Sidebar) */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        clients={clients}
        activeClientId={activeClientId}
        setActiveClientId={setActiveClientId}
        onLogout={handleLogout}
        onAddNewClient={handleAddNewClient}
        onOpenAssignModal={() => setIsAssignModalOpen(true)}
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
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentUser.role === 'coach' ? (viewMode === 'coach' ? 'Koç (Yönetici)' : 'Sporcu Önizleme') : 'Danışan'}
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

      {/* Koç İçin Danışan Koduyla Program Atama Modalı */}
      {currentUser.role === 'coach' && (
        <AssignProgramModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          clients={clients}
          activeClient={activeClient}
          onAssignToClient={handleAssignToClient}
        />
      )}

    </div>
  );
}
