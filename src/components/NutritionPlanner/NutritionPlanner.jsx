import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Droplet, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Check, 
  Sliders, 
  AlertTriangle, 
  Heart, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Apple
} from 'lucide-react';
import { foodDatabase } from '../../data/foodDatabase';
import { calculateBmrFormulas } from '../../data/defaultData';

export default function NutritionPlanner({
  client,
  nutritionPlan,
  onUpdateNutritionPlan,
  viewMode // 'coach' | 'client'
}) {
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' | 'calculator' | 'micros'
  const [selectedMealForFood, setSelectedMealForFood] = useState(null);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [customFood, setCustomFood] = useState({ name: '', amount: 100, unit: 'g', protein: 20, carb: 0, fat: 2, kcal: 100 });

  const stats = client.stats || { weightKg: 70, heightCm: 175, age: 25, gender: 'male', activityMultiplier: 1.6 };
  const bmrData = calculateBmrFormulas(stats);
  const maintenanceKcal = Math.round(bmrData.averageBmr * (stats.activityMultiplier || 1.6));

  const macroTargets = nutritionPlan.macroTargets || { proteinG: 160, carbG: 380, fatG: 65 };
  const targetKcal = nutritionPlan.targetKcal || 2700;

  // Hesaplanan toplamlar
  const calculatedKcalFromMacros = (macroTargets.proteinG * 4) + (macroTargets.carbG * 4) + (macroTargets.fatG * 9);

  // Öğünlerden gelen gerçek toplamlar
  const totalMealMacros = (nutritionPlan.meals || []).reduce((acc, meal) => {
    (meal.items || []).forEach(item => {
      acc.protein += (parseFloat(item.protein) || 0);
      acc.carb += (parseFloat(item.carb) || 0);
      acc.fat += (parseFloat(item.fat) || 0);
      acc.kcal += (parseFloat(item.kcal) || 0);
    });
    return acc;
  }, { protein: 0, carb: 0, fat: 0, kcal: 0 });

  // Makro Hedeflerini Güncelleme
  const handleMacroChange = (field, value) => {
    const val = parseFloat(value) || 0;
    const updated = {
      ...macroTargets,
      [field]: val,
    };
    if (field === 'proteinG') {
      updated.proteinPerKg = (val / stats.weightKg).toFixed(2);
    }
    const newKcal = (updated.proteinG * 4) + (updated.carbG * 4) + (updated.fatG * 9);

    onUpdateNutritionPlan({
      ...nutritionPlan,
      targetKcal: newKcal,
      macroTargets: updated
    });
  };

  // Öğün Güncelleme
  const handleUpdateMeal = (mealIndex, updatedMeal) => {
    const updatedMeals = [...(nutritionPlan.meals || [])];
    updatedMeals[mealIndex] = updatedMeal;
    onUpdateNutritionPlan({ ...nutritionPlan, meals: updatedMeals });
  };

  // Yeni Öğün Ekleme
  const handleAddMeal = () => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: `Öğün ${(nutritionPlan.meals || []).length + 1}`,
      time: "14:00",
      notes: "Öğün notu ve zamanlama",
      items: []
    };
    onUpdateNutritionPlan({
      ...nutritionPlan,
      meals: [...(nutritionPlan.meals || []), newMeal]
    });
  };

  // Öğün Silme
  const handleDeleteMeal = (mealIndex) => {
    const updatedMeals = (nutritionPlan.meals || []).filter((_, idx) => idx !== mealIndex);
    onUpdateNutritionPlan({ ...nutritionPlan, meals: updatedMeals });
  };

  // Öğüne Besin Ekleme (Kütüphaneden)
  const handleAddFoodToMeal = (food, mealIndex) => {
    const meal = nutritionPlan.meals[mealIndex];
    // Varsayılan 100g veya 1 porsiyon
    const ratio = 1;
    const newItem = {
      name: food.name,
      amount: 100,
      unit: food.unit.includes('adet') ? 'adet' : 'g',
      protein: Math.round(food.protein * ratio * 10) / 10,
      carb: Math.round(food.carb * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      kcal: Math.round(food.kcal * ratio)
    };

    handleUpdateMeal(mealIndex, {
      ...meal,
      items: [...(meal.items || []), newItem]
    });
    setSelectedMealForFood(null);
  };

  // Öğünden Besin Çıkarma
  const handleRemoveFoodFromMeal = (mealIndex, itemIndex) => {
    const meal = nutritionPlan.meals[mealIndex];
    const updatedItems = meal.items.filter((_, idx) => idx !== itemIndex);
    handleUpdateMeal(mealIndex, { ...meal, items: updatedItems });
  };

  // Besin Miktarı Değiştirildiğinde Makroları Otomatik Yeniden Hesaplama
  const handleItemAmountChange = (mealIndex, itemIndex, newAmount) => {
    const meal = nutritionPlan.meals[mealIndex];
    const item = meal.items[itemIndex];
    const parsedAmount = parseFloat(newAmount) || 0;
    
    // Orijinal veritabanında ara
    const dbFood = foodDatabase.find(f => f.name.toLowerCase() === item.name.toLowerCase());
    
    let p = item.protein;
    let c = item.carb;
    let f = item.fat;
    let k = item.kcal;

    if (dbFood) {
      const factor = item.unit === 'adet' ? parsedAmount : parsedAmount / 100;
      p = Math.round(dbFood.protein * factor * 10) / 10;
      c = Math.round(dbFood.carb * factor * 10) / 10;
      f = Math.round(dbFood.fat * factor * 10) / 10;
      k = Math.round(dbFood.kcal * factor);
    }

    const updatedItems = [...meal.items];
    updatedItems[itemIndex] = {
      ...item,
      amount: parsedAmount,
      protein: p,
      carb: c,
      fat: f,
      kcal: k
    };

    handleUpdateMeal(mealIndex, { ...meal, items: updatedItems });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Üst Makro Paneli & Hedef Durumu */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Beslenme Stratejisi
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Danışan: <strong className="text-white">{client.name}</strong> ({stats.weightKg} kg, {stats.heightCm} cm)
              </span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white mt-1">
              {nutritionPlan.dietType || 'Hipertrofi Beslenme & Makro Planı'}
            </h2>
          </div>

          {/* Sekmeler: Öğün Listesi, Kalori Hesaplayıcı, Mikro & Su */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('meals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'meals'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🥗 Günlük Öğün Listesi
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧮 BMR & Kalori Hesaplayıcı
            </button>
            <button
              onClick={() => setActiveTab('micros')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'micros'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💧 Mikro, Su & Takviyeler
            </button>
          </div>
        </div>

        {/* Makro Hedef Kartları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Toplam Kalori */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400">Hedef Kalori</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">{targetKcal}</span>
              <span className="text-xs text-slate-400 font-bold">kcal</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Öğünlerden Gelen:</span>
              <strong className={totalMealMacros.kcal > targetKcal ? 'text-amber-400' : 'text-emerald-400'}>
                {Math.round(totalMealMacros.kcal)} kcal
              </strong>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalMealMacros.kcal / (targetKcal || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">Protein (Kas Gelişimi)</span>
              <span className="text-[10px] text-slate-400">
                {(macroTargets.proteinG / (stats.weightKg || 70)).toFixed(2)} g/kg
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.proteinG}
                  onChange={(e) => handleMacroChange('proteinG', e.target.value)}
                  className="w-20 bg-transparent text-2xl sm:text-3xl font-black text-emerald-400 focus:outline-none focus:border-b focus:border-emerald-500"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{macroTargets.proteinG}</span>
              )}
              <span className="text-xs text-slate-400 font-bold">g</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Öğünlerdeki:</span>
              <strong className="text-emerald-300">{Math.round(totalMealMacros.protein)}g / {macroTargets.proteinG}g</strong>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalMealMacros.protein / (macroTargets.proteinG || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Karbonhidrat */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-400">Karbonhidrat (Enerji)</span>
              <span className="text-[10px] text-slate-400">
                {(macroTargets.carbG / (stats.weightKg || 70)).toFixed(1)} g/kg
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.carbG}
                  onChange={(e) => handleMacroChange('carbG', e.target.value)}
                  className="w-20 bg-transparent text-2xl sm:text-3xl font-black text-cyan-400 focus:outline-none focus:border-b focus:border-cyan-500"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-cyan-400">{macroTargets.carbG}</span>
              )}
              <span className="text-xs text-slate-400 font-bold">g</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Öğünlerdeki:</span>
              <strong className="text-cyan-300">{Math.round(totalMealMacros.carb)}g / {macroTargets.carbG}g</strong>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalMealMacros.carb / (macroTargets.carbG || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Yağ */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-rose-400">Yağ (Hormon Desteği)</span>
              <span className="text-[10px] text-slate-400">
                {(macroTargets.fatG / (stats.weightKg || 70)).toFixed(2)} g/kg
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.fatG}
                  onChange={(e) => handleMacroChange('fatG', e.target.value)}
                  className="w-20 bg-transparent text-2xl sm:text-3xl font-black text-rose-400 focus:outline-none focus:border-b focus:border-rose-500"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-rose-400">{macroTargets.fatG}</span>
              )}
              <span className="text-xs text-slate-400 font-bold">g</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Öğünlerdeki:</span>
              <strong className="text-rose-300">{Math.round(totalMealMacros.fat)}g / {macroTargets.fatG}g</strong>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-rose-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalMealMacros.fat / (macroTargets.fatG || 1)) * 100)}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* 2. TAB İÇERİKLERİ */}

      {/* TAB 1: ÖĞÜN ÖĞÜN DİYET LİSTESİ */}
      {activeTab === 'meals' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-400" />
              Öğün Planı & Besin Dağılımı
            </h3>
            {viewMode === 'coach' && (
              <button
                onClick={handleAddMeal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni Öğün Ekle
              </button>
            )}
          </div>

          {/* Öğün Kartları */}
          <div className="space-y-4">
            {(nutritionPlan.meals || []).map((meal, mealIdx) => {
              const mealP = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.protein) || 0), 0);
              const mealC = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.carb) || 0), 0);
              const mealF = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.fat) || 0), 0);
              const mealKcal = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.kcal) || 0), 0);

              return (
                <div key={meal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  
                  {/* Öğün Başlık Satırı */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center">
                        {mealIdx + 1}
                      </span>
                      {viewMode === 'coach' ? (
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => handleUpdateMeal(mealIdx, { ...meal, name: e.target.value })}
                          className="font-bold text-sm sm:text-base text-white bg-transparent focus:outline-none focus:border-b focus:border-emerald-500"
                        />
                      ) : (
                        <h4 className="font-bold text-sm sm:text-base text-white">{meal.name}</h4>
                      )}

                      <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {viewMode === 'coach' ? (
                          <input
                            type="text"
                            value={meal.time || ''}
                            onChange={(e) => handleUpdateMeal(mealIdx, { ...meal, time: e.target.value })}
                            className="w-14 bg-transparent text-slate-300 focus:outline-none"
                            placeholder="Saat"
                          />
                        ) : (
                          <span>{meal.time}</span>
                        )}
                      </div>
                    </div>

                    {/* Öğün Makro Özeti */}
                    <div className="flex items-center gap-3 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-amber-400 font-bold">{Math.round(mealKcal)} kcal</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-emerald-400 font-semibold">{Math.round(mealP)}g P</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-cyan-400 font-semibold">{Math.round(mealC)}g C</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-rose-400 font-semibold">{Math.round(mealF)}g F</span>

                      {viewMode === 'coach' && (
                        <button
                          onClick={() => handleDeleteMeal(mealIdx)}
                          className="text-slate-500 hover:text-rose-400 ml-2"
                          title="Öğünü Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Koç Notu */}
                  {viewMode === 'coach' ? (
                    <input
                      type="text"
                      placeholder="Öğün zamanlama veya pişirme notu..."
                      value={meal.notes || ''}
                      onChange={(e) => handleUpdateMeal(mealIdx, { ...meal, notes: e.target.value })}
                      className="w-full text-xs text-slate-400 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-700"
                    />
                  ) : meal.notes ? (
                    <p className="text-xs text-slate-400 italic bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
                      💡 {meal.notes}
                    </p>
                  ) : null}

                  {/* Besin Listesi Tablosu */}
                  <div className="space-y-1.5">
                    {(meal.items || []).map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-semibold text-slate-200 truncate">{item.name}</span>
                          <div className="flex items-center gap-1 text-slate-400">
                            {viewMode === 'coach' ? (
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleItemAmountChange(mealIdx, itemIdx, e.target.value)}
                                className="w-14 bg-slate-700/80 border border-slate-600 rounded px-1.5 py-0.5 text-center text-white font-bold"
                              />
                            ) : (
                              <span className="font-bold text-white">{item.amount}</span>
                            )}
                            <span>{item.unit}</span>
                          </div>
                        </div>

                        {/* Makrolar */}
                        <div className="flex items-center gap-2 sm:gap-4 text-[11px]">
                          <span className="text-emerald-400 font-semibold">{item.protein}g P</span>
                          <span className="text-cyan-400 font-semibold">{item.carb}g C</span>
                          <span className="text-rose-400 font-semibold">{item.fat}g F</span>
                          <span className="text-amber-400 font-bold">{item.kcal} kcal</span>

                          {viewMode === 'coach' && (
                            <button
                              onClick={() => handleRemoveFoodFromMeal(mealIdx, itemIdx)}
                              className="text-slate-500 hover:text-rose-400 ml-1"
                              title="Besini Çıkar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Besin Ekleme Butonu */}
                  {viewMode === 'coach' && (
                    <div className="pt-1">
                      <button
                        onClick={() => setSelectedMealForFood(mealIdx)}
                        className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold py-1 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Bu Öğüne Besin Ekle
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: BMR & KALORİ HESAPLAYICI (Orijinal Tablodaki Schofield, Helms, Harris-Benedict Formülleri) */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              E-Tablodaki Bilimsel Kalori & BMR Formülleri
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Google Sheets'teki Schofield, Eric Helms, Harris-Benedict (1984 Revize) ve Aktivite Çarpanı algoritmaları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Schofield Formülü</span>
              <div className="text-2xl font-black text-white">{bmrData.schofield} <span className="text-xs font-normal text-slate-400">kcal BMR</span></div>
              <p className="text-[11px] text-slate-400 pt-1">Dünya Sağlık Örgütü (WHO) bazal metabolizma modeli.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harris-Benedict (1984)</span>
              <div className="text-2xl font-black text-white">{bmrData.harrisBenedict} <span className="text-xs font-normal text-slate-400">kcal BMR</span></div>
              <p className="text-[11px] text-slate-400 pt-1">Revize edilmiş boy, kilo ve yaş parametreli klinik hesap.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Eric Helms Formülü</span>
              <div className="text-2xl font-black text-white">{bmrData.ericHelms} <span className="text-xs font-normal text-slate-400">kcal BMR</span></div>
              <p className="text-[11px] text-slate-400 pt-1">Yağsız kas kütlesi (FFM x 22) bazlı doğal sporcu modeli.</p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">3 Formülün Ortalaması</span>
              <div className="text-2xl font-black text-emerald-400">{bmrData.averageBmr} <span className="text-xs font-normal text-slate-400">kcal BMR</span></div>
              <p className="text-[11px] text-slate-300 pt-1">Tablodaki standart referans alınan bazal kalori.</p>
            </div>

          </div>

          {/* Aktivite Çarpanı & Bakım Kalorisi */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white block">Aktivite Çarpanı (PAL): {stats.activityMultiplier || 1.6}</span>
                <span className="text-xs text-slate-400">
                  (Az Hareket: 1.3-1.6 | Orta Hareket: 1.6-1.9 | Çok Hareket: 1.9-2.2)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Hesaplanan Bakım Kalorisi (Maintenance):</span>
                <span className="text-xl font-black text-white">{maintenanceKcal} kcal / gün</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/70 rounded-lg text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-400">💡 Deneyim Seviyesine Göre Kalori Fazlası (Surplus) Tavsiyeleri:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-700/60">
                  <strong className="text-white block">0-6 Ay (Beginner):</strong>
                  Vücut ağırlığının %1 - %1.5 fazlası (+190 - 285 kcal)
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-700/60">
                  <strong className="text-white block">6 Ay - 1 Yıl (Intermediate):</strong>
                  Vücut ağırlığının %0.5 - %1 fazlası (+95 - 190 kcal)
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-700/60">
                  <strong className="text-white block">1+ Yıl (Advanced):</strong>
                  Vücut ağırlığının %0.5 fazlası (+95 kcal)
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MİKRO, SU, TUZ & TAKVİYELER */}
      {activeTab === 'micros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Su & Hidrasyon */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Günlük Sıvı & Su Tavsiyesi</h4>
                <p className="text-xs text-slate-400">Hücresel dolgunluk ve kuvvet aktarımı</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Hedeflenen Minimum Sıvı:</span>
                <span className="text-2xl font-black text-blue-400">{nutritionPlan.waterTargetLiters || 3.5} Litre</span>
              </div>
              <div className="text-right text-xs text-slate-400">
                <span>İdrar Skalası:</span>
                <strong className="block text-emerald-400">1 - 3 (Çok İyi Hidrasyon)</strong>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              💧 <strong>Kural:</strong> Antrenman sırasında kaybedilen her 1 kg ter için 1.25 litre su takviyesi yapılmalıdır.
            </p>
          </div>

          {/* Tuz & Sodyum & Lif */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Tuz & Sodyum / Lif Rehberi</h4>
                <p className="text-xs text-slate-400">Tablodaki hayati elektrolit ve sindirim referansı</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Tuz (Sodyum) Tavsiyesi:</span>
                <span className="text-sm font-bold text-amber-400">{nutritionPlan.saltTargetGrams || '8 - 15 gr'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Günlük Minimum Lif (Fiber):</span>
                <span className="text-sm font-bold text-emerald-400">{nutritionPlan.fiberTargetGrams || 35} gr</span>
              </div>
            </div>

            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>
                <strong>DİP NOT:</strong> {nutritionPlan.saltNotice || '8 gr altı tuz alımına sakınlıkla düşmeyin! Tuzsuz diyet kas pompalamasını ve sinirsel iletimi felç eder.'}
              </span>
            </div>
          </div>

          {/* Supplement / Takviye Listesi */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Kişiselleştirilmiş Takviye & Supplement Planı
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(nutritionPlan.supplements || []).map((sup, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{sup.name}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {sup.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {sup.timing}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    💡 {sup.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Besin Seçici Modal */}
      {selectedMealForFood !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-heading font-bold text-white text-base">
                Öğün {selectedMealForFood + 1}'e Besin Ekle
              </h3>
              <button
                onClick={() => setSelectedMealForFood(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-slate-800">
              <input
                type="text"
                placeholder="Besin ara (örn: Tavuk, Pirinç, Yulaf, Yumurta)..."
                value={foodSearchTerm}
                onChange={(e) => setFoodSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 overflow-y-auto max-h-[50vh] space-y-2">
              {foodDatabase
                .filter(f => f.name.toLowerCase().includes(foodSearchTerm.toLowerCase()))
                .map((food, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddFoodToMeal(food, selectedMealForFood)}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-sm text-white block">{food.name}</span>
                      <span className="text-[11px] text-slate-400">{food.unit} porsiyon</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-semibold">{food.protein}g P</span>
                      <span className="text-cyan-400 font-semibold">{food.carb}g C</span>
                      <span className="text-rose-400 font-semibold">{food.fat}g F</span>
                      <span className="text-amber-400 font-bold">{food.kcal} kcal</span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
