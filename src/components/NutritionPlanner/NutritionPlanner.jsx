import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Droplet, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck 
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

  const stats = client.stats || { weightKg: 70, heightCm: 175, age: 25, gender: 'male', activityMultiplier: 1.6 };
  const bmrData = calculateBmrFormulas(stats);
  const maintenanceKcal = Math.round(bmrData.averageBmr * (stats.activityMultiplier || 1.6));

  const macroTargets = nutritionPlan.macroTargets || { proteinG: 160, carbG: 380, fatG: 65 };
  const targetKcal = nutritionPlan.targetKcal || 2700;

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

  const handleUpdateMeal = (mealIndex, updatedMeal) => {
    const updatedMeals = [...(nutritionPlan.meals || [])];
    updatedMeals[mealIndex] = updatedMeal;
    onUpdateNutritionPlan({ ...nutritionPlan, meals: updatedMeals });
  };

  const handleAddMeal = () => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: `Öğün ${(nutritionPlan.meals || []).length + 1}`,
      time: "14:00",
      notes: "",
      items: []
    };
    onUpdateNutritionPlan({
      ...nutritionPlan,
      meals: [...(nutritionPlan.meals || []), newMeal]
    });
  };

  const handleDeleteMeal = (mealIndex) => {
    const updatedMeals = (nutritionPlan.meals || []).filter((_, idx) => idx !== mealIndex);
    onUpdateNutritionPlan({ ...nutritionPlan, meals: updatedMeals });
  };

  const handleAddFoodToMeal = (food, mealIndex) => {
    const meal = nutritionPlan.meals[mealIndex];
    const newItem = {
      name: food.name,
      amount: 100,
      unit: food.unit.includes('adet') ? 'adet' : 'g',
      protein: food.protein,
      carb: food.carb,
      fat: food.fat,
      kcal: food.kcal
    };

    handleUpdateMeal(mealIndex, {
      ...meal,
      items: [...(meal.items || []), newItem]
    });
    setSelectedMealForFood(null);
  };

  const handleRemoveFoodFromMeal = (mealIndex, itemIndex) => {
    const meal = nutritionPlan.meals[mealIndex];
    const updatedItems = meal.items.filter((_, idx) => idx !== itemIndex);
    handleUpdateMeal(mealIndex, { ...meal, items: updatedItems });
  };

  const handleItemAmountChange = (mealIndex, itemIndex, newAmount) => {
    const meal = nutritionPlan.meals[mealIndex];
    const item = meal.items[itemIndex];
    const parsedAmount = parseFloat(newAmount) || 0;
    
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
    <div className="space-y-4 sm:space-y-5 text-slate-900 dark:text-white transition-colors">
      
      {/* 1. Sade Makro Hedef Kartları */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                Beslenme
              </span>
              <span className="text-xs text-slate-500">
                {client.name} • {stats.weightKg} kg
              </span>
            </div>
            <h2 className="font-heading font-black text-lg sm:text-xl mt-1">
              {nutritionPlan.dietType || 'Hipertrofi Beslenme Planı'}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('meals')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'meals'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🥗 Öğün Listesi
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🧮 Kalori Formülleri
            </button>
            <button
              onClick={() => setActiveTab('micros')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'micros'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💧 Su, Tuz & Takviyeler
            </button>
          </div>
        </div>

        {/* Makro 4'lü Izgara */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Kalori */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
              <span className="font-bold uppercase text-[10px]">Hedef Kalori</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{targetKcal}</span>
              <span className="text-xs text-slate-500 font-bold">kcal</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Öğün Toplamı: <strong className="text-slate-800 dark:text-slate-200">{Math.round(totalMealMacros.kcal)} kcal</strong>
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
              <span className="font-bold uppercase text-[10px] text-emerald-600 dark:text-emerald-400">Protein</span>
              <span className="text-[10px]">{(macroTargets.proteinG / (stats.weightKg || 70)).toFixed(1)} g/kg</span>
            </div>
            <div className="flex items-baseline gap-1">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.proteinG}
                  onChange={(e) => handleMacroChange('proteinG', e.target.value)}
                  className="w-16 bg-transparent text-2xl font-black text-emerald-600 dark:text-emerald-400 focus:outline-none"
                />
              ) : (
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{macroTargets.proteinG}</span>
              )}
              <span className="text-xs text-slate-500 font-bold">g</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Öğünlerde: <strong>{Math.round(totalMealMacros.protein)}g</strong>
            </div>
          </div>

          {/* Karb */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
              <span className="font-bold uppercase text-[10px] text-cyan-600 dark:text-cyan-400">Karbonhidrat</span>
              <span className="text-[10px]">{(macroTargets.carbG / (stats.weightKg || 70)).toFixed(1)} g/kg</span>
            </div>
            <div className="flex items-baseline gap-1">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.carbG}
                  onChange={(e) => handleMacroChange('carbG', e.target.value)}
                  className="w-16 bg-transparent text-2xl font-black text-cyan-600 dark:text-cyan-400 focus:outline-none"
                />
              ) : (
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{macroTargets.carbG}</span>
              )}
              <span className="text-xs text-slate-500 font-bold">g</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Öğünlerde: <strong>{Math.round(totalMealMacros.carb)}g</strong>
            </div>
          </div>

          {/* Yağ */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
              <span className="font-bold uppercase text-[10px] text-rose-600 dark:text-rose-400">Yağ</span>
              <span className="text-[10px]">{(macroTargets.fatG / (stats.weightKg || 70)).toFixed(1)} g/kg</span>
            </div>
            <div className="flex items-baseline gap-1">
              {viewMode === 'coach' ? (
                <input
                  type="number"
                  value={macroTargets.fatG}
                  onChange={(e) => handleMacroChange('fatG', e.target.value)}
                  className="w-16 bg-transparent text-2xl font-black text-rose-600 dark:text-rose-400 focus:outline-none"
                />
              ) : (
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{macroTargets.fatG}</span>
              )}
              <span className="text-xs text-slate-500 font-bold">g</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Öğünlerde: <strong>{Math.round(totalMealMacros.fat)}g</strong>
            </div>
          </div>

        </div>

      </div>

      {/* TAB 1: ÖĞÜNLER */}
      {activeTab === 'meals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              Günlük Öğün Dağılımı ({nutritionPlan.meals?.length || 0} Öğün)
            </h3>
            {viewMode === 'coach' && (
              <button
                onClick={handleAddMeal}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Öğün Ekle
              </button>
            )}
          </div>

          <div className="space-y-3">
            {(nutritionPlan.meals || []).map((meal, mealIdx) => {
              const mealP = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.protein) || 0), 0);
              const mealC = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.carb) || 0), 0);
              const mealF = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.fat) || 0), 0);
              const mealKcal = (meal.items || []).reduce((acc, it) => acc + (parseFloat(it.kcal) || 0), 0);

              return (
                <div key={meal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
                  
                  {/* Başlık */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                        {mealIdx + 1}
                      </span>
                      {viewMode === 'coach' ? (
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => handleUpdateMeal(mealIdx, { ...meal, name: e.target.value })}
                          className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent focus:outline-none"
                        />
                      ) : (
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{meal.name}</h4>
                      )}

                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {viewMode === 'coach' ? (
                          <input
                            type="text"
                            value={meal.time || ''}
                            onChange={(e) => handleUpdateMeal(mealIdx, { ...meal, time: e.target.value })}
                            className="w-12 bg-transparent text-slate-500 dark:text-slate-400 focus:outline-none"
                            placeholder="Saat"
                          />
                        ) : (
                          meal.time
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-900 dark:text-white">{Math.round(mealKcal)} kcal</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{Math.round(mealP)}g P</span>
                      <span>•</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{Math.round(mealC)}g C</span>
                      <span>•</span>
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">{Math.round(mealF)}g F</span>

                      {viewMode === 'coach' && (
                        <button
                          onClick={() => handleDeleteMeal(mealIdx)}
                          className="text-slate-400 hover:text-rose-500 ml-1.5"
                          title="Öğünü Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Besin Kalemleri */}
                  <div className="space-y-1">
                    {(meal.items || []).map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <div className="flex items-center gap-0.5 text-slate-500">
                            {viewMode === 'coach' ? (
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleItemAmountChange(mealIdx, itemIdx, e.target.value)}
                                className="w-12 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white"
                              />
                            ) : (
                              <strong>{item.amount}</strong>
                            )}
                            <span>{item.unit}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.protein}g P</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{item.carb}g C</span>
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">{item.fat}g F</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.kcal} kcal</span>

                          {viewMode === 'coach' && (
                            <button
                              onClick={() => handleRemoveFoodFromMeal(mealIdx, itemIdx)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {viewMode === 'coach' && (
                    <button
                      onClick={() => setSelectedMealForFood(mealIdx)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      Besin Ekle
                    </button>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KALORİ FORMÜLLERİ */}
      {activeTab === 'calculator' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-base">E-Tablodaki Bilimsel Kalori & BMR Formülleri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Schofield Formülü</span>
              <div className="text-xl font-black mt-1">{bmrData.schofield} kcal</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Harris-Benedict (1984)</span>
              <div className="text-xl font-black mt-1">{bmrData.harrisBenedict} kcal</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Eric Helms Formülü</span>
              <div className="text-xl font-black mt-1">{bmrData.ericHelms} kcal</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">3 Formülün Ortalaması</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{bmrData.averageBmr} kcal</div>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Aktivite Çarpanı ({stats.activityMultiplier}) ile çarpıldığında Bakım Kalorisi: <strong>{maintenanceKcal} kcal</strong>
          </p>
        </div>
      )}

      {/* TAB 3: MİKRO & SU */}
      {activeTab === 'micros' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-blue-500" />
              Sıvı & Su Tavsiyesi
            </h4>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {nutritionPlan.waterTargetLiters || 3.5} Litre / gün
            </div>
            <p className="text-slate-500">İdrar rengi 1-3 skalasında açık sarı/şeffaf olmalı.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Tuz & Sodyum
            </h4>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {nutritionPlan.saltTargetGrams || '8 - 15 gr'}
            </div>
            <p className="text-rose-600 dark:text-rose-400 font-semibold">
              ⚠️ {nutritionPlan.saltNotice || '8 gr altına asla düşmeyin!'}
            </p>
          </div>
        </div>
      )}

      {/* Besin Seçici Modal */}
      {selectedMealForFood !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm">Besin Ekle (Öğün {selectedMealForFood + 1})</h3>
              <button onClick={() => setSelectedMealForFood(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <input
                type="text"
                placeholder="Besin ara (Tavuk, Pirinç, Yulaf, Yumurta)..."
                value={foodSearchTerm}
                onChange={(e) => setFoodSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="p-2 overflow-y-auto max-h-[45vh] space-y-1">
              {foodDatabase
                .filter(f => f.name.toLowerCase().includes(foodSearchTerm.toLowerCase()))
                .map((food, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddFoodToMeal(food, selectedMealForFood)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold block">{food.name}</span>
                      <span className="text-[10px] text-slate-500">{food.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-emerald-600 font-semibold">{food.protein}g P</span>
                      <span className="text-cyan-600 font-semibold">{food.carb}g C</span>
                      <span className="text-rose-600 font-semibold">{food.fat}g F</span>
                      <span className="font-bold">{food.kcal} kcal</span>
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
