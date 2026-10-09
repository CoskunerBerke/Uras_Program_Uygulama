import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WorkoutBuilder from './components/WorkoutBuilder/WorkoutBuilder';
import NutritionPlanner from './components/NutritionPlanner/NutritionPlanner';
import WarmupSection from './components/WorkoutBuilder/WarmupSection';
import MeasurementTracker from './components/Measurements/MeasurementTracker';
import ClientPortal from './components/ClientView/ClientPortal';
import PrintExportView from './components/PrintView/PrintExportView';
import { DEFAULT_CLIENT } from './data/defaultData';

const LOCAL_STORAGE_KEY = 'coachfit_clients_v2';

export default function App() {
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
  const [viewMode, setViewMode] = useState('coach'); // 'coach' | 'client'

  // LocalStorage senkronizasyonu
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  }, [clients]);

  // Aktif danışanı bul
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0] || DEFAULT_CLIENT;

  // Danışan Güncelleme
  const handleUpdateActiveClient = (updated) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Yeni Danışan Ekleme
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
        splitName: `${name} - Hipertrofi Programı`,
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

  // JSON Olarak Dışa Aktar (Yedek)
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CoachFit_Programlar_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Yedekten İçe Aktar
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
          alert("Program başarıyla içe aktarıldı!");
        } else {
          alert("Geçersiz yedek dosyası formatı!");
        }
      } catch (err) {
        alert("Dosya okunamadı: " + err.message);
      }
    };
  };

  // Veriyi Orijinal Google Sheet Örneğine Sıfırla
  const handleResetData = () => {
    if (window.confirm("Tüm değişiklikleri sıfırlayıp e-tablodaki orijinal Berke antrenman & beslenme verilerine dönmek istiyor musunuz?")) {
      setClients([DEFAULT_CLIENT]);
      setActiveClientId(DEFAULT_CLIENT.id);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Yazdır / PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Üst Gezinme & Başlık */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        clients={clients}
        activeClientId={activeClientId}
        setActiveClientId={setActiveClientId}
        onAddNewClient={handleAddNewClient}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetData={handleResetData}
        onPrint={handlePrint}
      />

      {/* Ana Gövde */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 no-print">
        
        {/* Mod 1: Danışan Görünümü (Sporcu Modu) */}
        {viewMode === 'client' ? (
          <ClientPortal
            client={activeClient}
            onUpdateClient={handleUpdateActiveClient}
          />
        ) : (
          /* Mod 2: Antrenör Modu (Koç Paneli) */
          <div>
            {activeTab === 'workout' && (
              <WorkoutBuilder
                workoutProgram={activeClient.workoutProgram}
                onUpdateWorkoutProgram={(updated) => handleUpdateActiveClient({ ...activeClient, workoutProgram: updated })}
                viewMode={viewMode}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionPlanner
                client={activeClient}
                nutritionPlan={activeClient.nutritionPlan}
                onUpdateNutritionPlan={(updated) => handleUpdateActiveClient({ ...activeClient, nutritionPlan: updated })}
                viewMode={viewMode}
              />
            )}

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

            {activeTab === 'measurements' && (
              <MeasurementTracker
                measurements={activeClient.measurements}
                onUpdateMeasurements={(updated) => handleUpdateActiveClient({ ...activeClient, measurements: updated })}
              />
            )}
          </div>
        )}

      </main>

      {/* Yazdırma / PDF Çıktı Görünümü (Yalnızca Print anında aktif) */}
      <PrintExportView client={activeClient} />

      {/* Alt Bilgi */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 no-print">
        CoachFit Pro © 2026 • Bilimsel Antrenman, RIR/RPE Progresyonu & Hassas Beslenme Sistemi
      </footer>

    </div>
  );
}
