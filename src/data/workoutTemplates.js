import { DEFAULT_CLIENT } from './defaultData';

export const WORKOUT_TEMPLATES = [
  {
    id: "template-ppl",
    title: "4 Günlük PPL + Upper (Hipertrofi)",
    description: "İtiş, Çekiş, Bacak ve Üst Vücut odaklı bilimsel hipertrofi spliti (Berke Programı).",
    daysCount: 4,
    focus: "Maksimum Kas Kütlesi & Güç",
    program: DEFAULT_CLIENT.workoutProgram
  },
  {
    id: "template-upper-lower",
    title: "4 Günlük Üst / Alt (Upper - Lower)",
    description: "Haftada 2 kez üst vücut, 2 kez bacak çalışılan dengeli ve kanıtlanmış split.",
    daysCount: 4,
    focus: "Kuvvet & Simetrik Kütle",
    program: {
      splitName: "4 Günlük Upper - Lower Spliti",
      activeWeek: 1,
      totalWeeks: 8,
      splitCycle: "ÜST A - ALT A - DİNLENME - ÜST B - ALT B - DİNLENME - DİNLENME",
      warmupPlan: DEFAULT_CLIENT.workoutProgram.warmupPlan,
      days: [
        {
          id: "ul-day-1",
          dayName: "Pazartesi",
          title: "Üst Vücut A (Kuvvet)",
          focus: "Göğüs, Sırt, Omuz",
          isRestDay: false,
          exercises: [
            {
              id: "ul-ex-1",
              name: "Barbell Bench Press",
              sets: 3,
              targetReps: "5-6",
              targetWeight: "70 kg",
              rir: "1-2",
              rpe: "8.5",
              percentage: "%80 1RM",
              tempo: "2-1-0",
              rest: "3 dk",
              coachNotes: "Geniş tutuş, göğüse kontrollü indirip patlayıcı itiş.",
              weeks: { 1: { targetSet: 3, targetWeight: "70kg", targetReps: "6", targetRpe: "8.5", completed: false } }
            },
            {
              id: "ul-ex-2",
              name: "Barbell Bent Over Row",
              sets: 3,
              targetReps: "6-8",
              targetWeight: "60 kg",
              rir: "1",
              rpe: "9",
              percentage: "%75 1RM",
              tempo: "2-0-1",
              rest: "2 dk",
              coachNotes: "Omurga nötr, dirsekleri geriye ve yukarıya çek.",
              weeks: { 1: { targetSet: 3, targetWeight: "60kg", targetReps: "8", targetRpe: "9", completed: false } }
            },
            {
              id: "ul-ex-3",
              name: "Overhead Dumbbell Press",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "20 kg",
              rir: "1",
              rpe: "9",
              percentage: "RPE 9",
              tempo: "2-0-0",
              rest: "90 sn",
              coachNotes: "Belden geriye bükülmeden omuzla yukarı bas.",
              weeks: { 1: { targetSet: 3, targetWeight: "20kg", targetReps: "8-10", targetRpe: "9", completed: false } }
            },
            {
              id: "ul-ex-4",
              name: "Lat Pulldown (Geniş Tutuş)",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "55 kg",
              rir: "1",
              rpe: "9",
              percentage: "RPE 9",
              tempo: "2-1-1",
              rest: "90 sn",
              coachNotes: "Üst göğse doğru çek, dirsekleri aşağı bastır.",
              weeks: { 1: { targetSet: 3, targetWeight: "55kg", targetReps: "10", targetRpe: "9", completed: false } }
            }
          ]
        },
        {
          id: "ul-day-2",
          dayName: "Salı",
          title: "Alt Vücut A (Quadriceps & Calf)",
          focus: "Ön Bacak, Kalf, Karın",
          isRestDay: false,
          exercises: [
            {
              id: "ul-ex-5",
              name: "Barbell Back Squat",
              sets: 3,
              targetReps: "5-6",
              targetWeight: "90 kg",
              rir: "1-2",
              rpe: "8.5",
              percentage: "%80 1RM",
              tempo: "2-1-0",
              rest: "3 dk",
              coachNotes: "Derinlik paralel veya altı. Dizleri ayak parmağı yönünde aç.",
              weeks: { 1: { targetSet: 3, targetWeight: "90kg", targetReps: "6", targetRpe: "8.5", completed: false } }
            },
            {
              id: "ul-ex-6",
              name: "Romanian Deadlift (RDL)",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "75 kg",
              rir: "1",
              rpe: "9",
              percentage: "RPE 9",
              tempo: "3-0-1",
              rest: "2 dk",
              coachNotes: "Kalçayı geriye it, hamstringlerde tam gerilim hisset.",
              weeks: { 1: { targetSet: 3, targetWeight: "75kg", targetReps: "8", targetRpe: "9", completed: false } }
            },
            {
              id: "ul-ex-7",
              name: "Leg Extension",
              sets: 3,
              targetReps: "12-15",
              targetWeight: "45 kg",
              rir: "0",
              rpe: "10",
              percentage: "Tükeniş",
              tempo: "2-1-1",
              rest: "60 sn",
              coachNotes: "Tepe noktada 1 sn bekle ve bacakları sık.",
              weeks: { 1: { targetSet: 3, targetWeight: "45kg", targetReps: "12", targetRpe: "10", completed: false } }
            }
          ]
        },
        {
          id: "ul-day-3",
          dayName: "Perşembe",
          title: "Üst Vücut B (Hipertrofi)",
          focus: "Göğüs Üstü, Sırt Kalınlık, Kollar",
          isRestDay: false,
          exercises: [
            {
              id: "ul-ex-8",
              name: "Incline Dumbbell Bench Press",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "26 kg",
              rir: "1",
              rpe: "9",
              percentage: "RPE 9",
              tempo: "2-1-0",
              rest: "2 dk",
              coachNotes: "30 derece açı, üst göğse tam esneme.",
              weeks: { 1: { targetSet: 3, targetWeight: "26kg", targetReps: "10", targetRpe: "9", completed: false } }
            },
            {
              id: "ul-ex-9",
              name: "Seated Cable Row",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "50 kg",
              rir: "1",
              rpe: "9",
              percentage: "RPE 9",
              tempo: "2-1-1",
              rest: "90 sn",
              coachNotes: "Karın deliğine doğru çek, sırtı dik tut.",
              weeks: { 1: { targetSet: 3, targetWeight: "50kg", targetReps: "10", targetRpe: "9", completed: false } }
            }
          ]
        },
        {
          id: "ul-day-4",
          dayName: "Cuma",
          title: "Alt Vücut B (Hamstring & Glute)",
          focus: "Arka Bacak, Kalça, Kalf",
          isRestDay: false,
          exercises: [
            {
              id: "ul-ex-10",
              name: "Conventional Deadlift",
              sets: 2,
              targetReps: "5",
              targetWeight: "110 kg",
              rir: "1",
              rpe: "9",
              percentage: "%82 1RM",
              tempo: "1-0-1",
              rest: "3 dk",
              coachNotes: "Bar kaval kemiğine yapışık çıksın, sırtı kilitle.",
              weeks: { 1: { targetSet: 2, targetWeight: "110kg", targetReps: "5", targetRpe: "9", completed: false } }
            },
            {
              id: "ul-ex-11",
              name: "Lying Leg Curl",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "40 kg",
              rir: "0",
              rpe: "10",
              percentage: "Tükeniş",
              tempo: "2-0-1",
              rest: "90 sn",
              coachNotes: "Kalçayı sehpadan kaldırmadan topukları popoya çek.",
              weeks: { 1: { targetSet: 3, targetWeight: "40kg", targetReps: "12", targetRpe: "10", completed: false } }
            }
          ]
        }
      ]
    }
  },
  {
    id: "template-full-body",
    title: "3 Günlük Tüm Vücut (Full Body)",
    description: "Yoğun çalışanlar veya haftada 3 gün gelebilen danışanlar için tüm vücut uyarımı.",
    daysCount: 3,
    focus: "Genel Kuvvet & Yağ Yakımı",
    program: {
      splitName: "3 Günlük Full Body Programı",
      activeWeek: 1,
      totalWeeks: 6,
      splitCycle: "A GÜNÜ - DİNLENME - B GÜNÜ - DİNLENME - C GÜNÜ - DİNLENME - DİNLENME",
      warmupPlan: DEFAULT_CLIENT.workoutProgram.warmupPlan,
      days: [
        {
          id: "fb-day-1",
          dayName: "Pazartesi",
          title: "Full Body A",
          focus: "Göğüs, Bacak, Sırt",
          isRestDay: false,
          exercises: [
            {
              id: "fb-ex-1",
              name: "Barbell Back Squat",
              sets: 3,
              targetReps: "6-8",
              targetWeight: "80 kg",
              rir: "1-2",
              rpe: "8.5",
              tempo: "2-1-0",
              rest: "2.5 dk",
              coachNotes: "Derin ve kontrollü iniş.",
              weeks: { 1: { targetSet: 3, targetWeight: "80kg", targetReps: "8", completed: false } }
            },
            {
              id: "fb-ex-2",
              name: "Dumbbell Bench Press",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "24 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-0-0",
              rest: "2 dk",
              coachNotes: "Derin esneme ve tepe sıkıştırma.",
              weeks: { 1: { targetSet: 3, targetWeight: "24kg", targetReps: "10", completed: false } }
            },
            {
              id: "fb-ex-3",
              name: "Seated Cable Row",
              sets: 3,
              targetReps: "10",
              targetWeight: "45 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-1-1",
              rest: "90 sn",
              coachNotes: "Kürek kemiklerini arkada sıkıştır.",
              weeks: { 1: { targetSet: 3, targetWeight: "45kg", targetReps: "10", completed: false } }
            }
          ]
        },
        {
          id: "fb-day-2",
          dayName: "Çarşamba",
          title: "Full Body B",
          focus: "Omuz, Arka Bacak, Sırt",
          isRestDay: false,
          exercises: [
            {
              id: "fb-ex-4",
              name: "Romanian Deadlift",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "70 kg",
              rir: "1",
              rpe: "9",
              tempo: "3-0-1",
              rest: "2 dk",
              coachNotes: "Kalçayı geriye it, bel düz.",
              weeks: { 1: { targetSet: 3, targetWeight: "70kg", targetReps: "10", completed: false } }
            },
            {
              id: "fb-ex-5",
              name: "Overhead Dumbbell Press",
              sets: 3,
              targetReps: "8-10",
              targetWeight: "18 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-0-0",
              rest: "90 sn",
              coachNotes: "Omuz başları ile yukarı it.",
              weeks: { 1: { targetSet: 3, targetWeight: "18kg", targetReps: "10", completed: false } }
            },
            {
              id: "fb-ex-6",
              name: "Lat Pulldown",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "50 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-1-1",
              rest: "90 sn",
              coachNotes: "Sırt kaslarını odakla.",
              weeks: { 1: { targetSet: 3, targetWeight: "50kg", targetReps: "10", completed: false } }
            }
          ]
        },
        {
          id: "fb-day-3",
          dayName: "Cuma",
          title: "Full Body C",
          focus: "Bacak, Göğüs, Kollar",
          isRestDay: false,
          exercises: [
            {
              id: "fb-ex-7",
              name: "Leg Press",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "140 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-0-1",
              rest: "2 dk",
              coachNotes: "Ayakları orta genişlikte yerleştir.",
              weeks: { 1: { targetSet: 3, targetWeight: "140kg", targetReps: "12", completed: false } }
            },
            {
              id: "fb-ex-8",
              name: "Incline Dumbbell Press",
              sets: 3,
              targetReps: "10",
              targetWeight: "22 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-1-0",
              rest: "90 sn",
              coachNotes: "Üst göğüs odağı.",
              weeks: { 1: { targetSet: 3, targetWeight: "22kg", targetReps: "10", completed: false } }
            }
          ]
        }
      ]
    }
  },
  {
    id: "template-glute-tone",
    title: "Kadın Sıkılaşma & Kalça / Bacak Odaklı",
    description: "Kalça, arka bacak, omuz ve karın sıkılaşmasına yönelik estetik kadın programı.",
    daysCount: 4,
    focus: "Kalça Büyütme, Bel İnceltme & Sıkılaşma",
    program: {
      splitName: "Glute & Fit Kadın Programı",
      activeWeek: 1,
      totalWeeks: 8,
      splitCycle: "GLUTE A - ÜST VÜCUT & KARIN - DİNLENME - GLUTE B - TÜM VÜCUT & KARDİYO",
      warmupPlan: DEFAULT_CLIENT.workoutProgram.warmupPlan,
      days: [
        {
          id: "gt-day-1",
          dayName: "Pazartesi",
          title: "Glute & Hamstring Focus",
          focus: "Kalça ve Arka Bacak",
          isRestDay: false,
          exercises: [
            {
              id: "gt-ex-1",
              name: "Barbell Hip Thrust",
              sets: 4,
              targetReps: "8-10",
              targetWeight: "60 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-1-1",
              rest: "2 dk",
              coachNotes: "Tepe noktada kalçayı 2 saniye kitle ve sık. Çene göğse yapışık baksın.",
              weeks: { 1: { targetSet: 4, targetWeight: "60kg", targetReps: "10", completed: false } }
            },
            {
              id: "gt-ex-2",
              name: "Dumbbell Romanian Deadlift",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "16 kg",
              rir: "1",
              rpe: "9",
              tempo: "3-0-1",
              rest: "90 sn",
              coachNotes: "Dizler hafif bükülü, kalçayı geriye it.",
              weeks: { 1: { targetSet: 3, targetWeight: "16kg", targetReps: "12", completed: false } }
            },
            {
              id: "gt-ex-3",
              name: "Cable Glute Kickback",
              sets: 3,
              targetReps: "12-15",
              targetWeight: "10 kg",
              rir: "0",
              rpe: "10",
              tempo: "2-1-1",
              rest: "60 sn",
              coachNotes: "Beli bükmeden sadece kalçayı sıkarak geriye savur.",
              weeks: { 1: { targetSet: 3, targetWeight: "10kg", targetReps: "15", completed: false } }
            }
          ]
        },
        {
          id: "gt-day-2",
          dayName: "Salı",
          title: "Üst Vücut & Bel İnceltme",
          focus: "Omuz, Sırt, Karın",
          isRestDay: false,
          exercises: [
            {
              id: "gt-ex-4",
              name: "Dumbbell Lateral Raise",
              sets: 4,
              targetReps: "12-15",
              targetWeight: "5 kg",
              rir: "0",
              rpe: "10",
              tempo: "2-0-1",
              rest: "60 sn",
              coachNotes: "Kum saati fiziği için yan omuzlar dolgunlaşsın.",
              weeks: { 1: { targetSet: 4, targetWeight: "5kg", targetReps: "15", completed: false } }
            },
            {
              id: "gt-ex-5",
              name: "Lat Pulldown (Geniş)",
              sets: 3,
              targetReps: "10-12",
              targetWeight: "35 kg",
              rir: "1",
              rpe: "9",
              tempo: "2-1-1",
              rest: "90 sn",
              coachNotes: "Sırtı dik tut, dirsekleri gövdeye çek.",
              weeks: { 1: { targetSet: 3, targetWeight: "35kg", targetReps: "12", completed: false } }
            }
          ]
        }
      ]
    }
  }
];

export const NUTRITION_TEMPLATES = [
  {
    id: "diet-bulk",
    title: "Temiz Kütle / Bulk (2800 kcal)",
    targetKcal: 2800,
    macroTargets: { proteinG: 165, carbG: 395, fatG: 65, proteinPerKg: "2.3" },
    waterLiters: 4,
    description: "Kas kütlesi kazanmak ve hacim almak isteyenler için yüksek karbonhidratlı plan."
  },
  {
    id: "diet-cut",
    title: "Yağ Yakımı / Definasyon (2000 kcal)",
    targetKcal: 2000,
    macroTargets: { proteinG: 170, carbG: 180, fatG: 50, proteinPerKg: "2.4" },
    waterLiters: 4.5,
    description: "Kas kaybı yaşamadan yağ yakmak ve karın kaslarını ortaya çıkarmak için."
  },
  {
    id: "diet-maintenance",
    title: "Form Koruma & Fit Kalma (2400 kcal)",
    targetKcal: 2400,
    macroTargets: { proteinG: 150, carbG: 275, fatG: 60, proteinPerKg: "2.1" },
    waterLiters: 3.5,
    description: "Mevcut kiloyu koruyup enerjik ve formda kalmak için dengeli makro planı."
  }
];
