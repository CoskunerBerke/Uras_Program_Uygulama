export const DEFAULT_CLIENT = {
  id: "client-berke-1",
  name: "Berke",
  phone: "+90 555 123 4567",
  goal: "Hipertrofi / Temiz Kütle (Lean Bulk)",
  startDate: "2026-10-01",
  experienceLevel: "Intermediate", // 6 ay - 1 yıl
  stats: {
    weightKg: 69,
    heightCm: 178,
    age: 22,
    gender: "male", // male or female
    bodyFatPct: 12.5,
    neckCm: 37,
    waistCm: 76,
    hipCm: 94,
    activityMultiplier: 1.6, // 1.2 Sedanter, 1.4 Az, 1.6 Orta-Aktif, 1.8 Yüksek, 2.0+ Atlet
  },
  workoutProgram: {
    splitName: "PPL - UL Hipertrofi Spliti",
    activeWeek: 1,
    totalWeeks: 10,
    splitCycle: "UPPER - LIMBS A - PUSH - OFF - PULL - OFF - LIMBS B - REPEAT",
    warmupPlan: {
      legWarmup: [
        { name: "Cat Camel", reps: "10 tekrar", done: false },
        { name: "Leg Swings (Öne-Arkaya)", reps: "10 tekrar / bacak", done: false },
        { name: "Leg Swings (Yana)", reps: "10 tekrar / bacak", done: false },
        { name: "Arm Circles (Öne & Arkaya)", reps: "10'ar tekrar", done: false },
        { name: "Cross Body Arm Slaps", reps: "10 tekrar", done: false },
        { name: "ATG Split Squat", reps: "10 tekrar / bacak", done: false },
      ],
      mcGillBig3: [
        { name: "McGill Curl-Up (Tek Bacak Bükülü)", reps: "12 tekrar / bacak", done: false },
        { name: "Side Plank (Yan Plank)", reps: "60 saniye / taraf", done: false },
        { name: "Bird Dog (Çapraz Kol & Bacak)", reps: "12 tekrar", done: false },
        { name: "Dead Bug", reps: "12 tekrar", done: false },
      ],
      calculator: {
        workingWeight: 100, // kg
        targetReps: 5,
      }
    },
    days: [
      {
        id: "day-1",
        dayName: "Salı",
        title: "Upper (Üst Vücut Odaklı)",
        focus: "Göğüs, Sırt, Omuz, Kollar",
        isRestDay: false,
        exercises: [
          {
            id: "ex-1-1",
            name: "Weighted Pull - Up",
            sets: 2,
            targetReps: "5 / 8",
            targetWeight: "Top Set (+20kg) / -20% Drop",
            rir: "1",
            rpe: "9",
            percentage: "Top Set + Drop",
            tempo: "2-0-0",
            rest: "2-3 dk",
            coachNotes: "1. set ağır 5 tekrar (Top Set), 2. set %20 ağırlık düşür 8 tekrar (Drop Set). Çene barı net geçsin.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "+20kg", targetReps: "5, 8", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
              2: { targetSet: 2, targetWeight: "+22.5kg", targetReps: "5, 8", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
              3: { targetSet: 2, targetWeight: "+25kg", targetReps: "5, 8", targetRpe: "9.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-2",
            name: "T-Bar Row",
            sets: 2,
            targetReps: "8",
            targetWeight: "65 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "e1RM ~%75",
            tempo: "2-1-0",
            rest: "2 dk",
            coachNotes: "Dirsekleri daha fazla yana verelim, kürek kemiklerini üstte sıkıştır.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "65kg", targetReps: "8", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-3",
            name: "Chest Fly of Choice",
            isChoice: true,
            selectedOption: "Cable Incline Fly",
            options: [
              "Cable Incline Fly",
              "Pec Deck Machine Fly",
              "Incline Dumbbell Fly"
            ],
            sets: 2,
            targetReps: "6-10",
            targetWeight: "50 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Son sette failure (tam tükeniş), tepe noktada göğsü 1 sn kitle.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "50kg", targetReps: "8-10", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-4",
            name: "Vertical Chest Press of Choice",
            isChoice: true,
            selectedOption: "Vertical Chest Press Machine",
            options: [
              "Vertical Chest Press Machine",
              "Incline Dumbbell Press",
              "Smith Machine Incline Press"
            ],
            sets: 2,
            targetReps: "8",
            targetWeight: "70% of e1RM",
            rir: "1",
            rpe: "8.5",
            percentage: "70% e1RM (-6% drop)",
            tempo: "2-1-0",
            rest: "2 dk",
            coachNotes: "1. set %70 e1RM, 2. set -%6 drop ağırlık.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "75kg", targetReps: "8", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-5",
            name: "Y-Raise (Incline Bench / Cable)",
            sets: 1,
            targetReps: "10-15",
            targetWeight: "7.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-0-0",
            rest: "90 sn",
            coachNotes: "Alt trapez ve yan omuz aktivasyonu, kolları 45 derece Y şeklinde kaldır.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "7.5kg", targetReps: "12", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-6",
            name: "Standing Dumbbell Lateral Raise",
            sets: 1,
            targetReps: "10-15",
            targetWeight: "12.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-0-0",
            rest: "90 sn",
            coachNotes: "Bilekler dirsek hizasında, trapezleri devreden çıkar.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "12.5kg", targetReps: "15", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-7",
            name: "Z bar/DB Preacher Curl",
            isChoice: true,
            selectedOption: "Z Bar Preacher Curl",
            options: [
              "Z Bar Preacher Curl",
              "Single Arm DB Preacher Curl",
              "Cable Preacher Curl"
            ],
            sets: 2,
            targetReps: "8-12",
            targetWeight: "30 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Sabit Yük",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Makarayı veya sehpayı bilek açısında yap, tepe noktada sık.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "30kg", targetReps: "10", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-8",
            name: "Single Arm Cable Triceps Extension with Cuff",
            sets: 1,
            targetReps: "7-9",
            targetWeight: "15 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-1-0",
            rest: "60 sn",
            coachNotes: "Cuff bileğe takılı, dirseği kilitleyip triceps'e kan pompala.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "15kg", targetReps: "8", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-1-9",
            name: "Single Arm Cable Kickback",
            sets: 1,
            targetReps: "8-12",
            targetWeight: "12.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-1-0",
            rest: "60 sn",
            coachNotes: "Gövde 45 derece eğik, tepe noktada 1 saniye izometrik tutuş.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "12.5kg", targetReps: "10", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          }
        ]
      },
      {
        id: "day-2",
        dayName: "Çarşamba",
        title: "Limbs A (Bacak & Kol Odaklı)",
        focus: "Kuadriseps, Hamstring, Biceps, Kalf",
        isRestDay: false,
        exercises: [
          {
            id: "ex-2-1",
            name: "Single Arm Scott Curl Machine",
            sets: 2,
            targetReps: "5-9",
            targetWeight: "25 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Ağır Çalışma",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Makarayı bilek açısında tut, omuzu geride sabitle.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "25kg", targetReps: "8", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-2",
            name: "Incline Bench DB Curl",
            sets: 1,
            targetReps: "5-9",
            targetWeight: "14 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Tam Esneme",
            tempo: "3-0-1-0",
            rest: "90 sn",
            coachNotes: "60 derece eğim, dirsekleri arkada tutarak uzun başı ger.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "14kg", targetReps: "7", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-3",
            name: "Leg Adductor Machine",
            sets: 2,
            targetReps: "8-12",
            targetWeight: "55 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Hipertrofi",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "İç bacak esnemesini hisset, ani bırakma.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "55kg", targetReps: "10", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-4",
            name: "2ct Pause Seated Leg Curl",
            sets: 2,
            targetReps: "8-12",
            targetWeight: "45 kg",
            rir: "0-1",
            rpe: "9.5",
            percentage: "Duraklamalı",
            tempo: "2-2-0",
            rest: "2 dk",
            coachNotes: "Tepe fleksiyonda 2 saniye net duraklama yap.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "45kg", targetReps: "10", targetRpe: "9.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-5",
            name: "Bulgarian Split Squat",
            sets: 1,
            targetReps: "6-9",
            targetWeight: "22 kg DBs",
            rir: "1",
            rpe: "8.5",
            percentage: "Tek Bacak",
            tempo: "3-1-0",
            rest: "2 dk",
            coachNotes: "Ön bacağa odaklan, dizin parmak ucuyla aynı doğrultuda olsun.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "22kg", targetReps: "8", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-6",
            name: "DL of Choice",
            isChoice: true,
            selectedOption: "Romanian Deadlift (RDL)",
            options: [
              "Romanian Deadlift (RDL)",
              "Conventional Barbell Deadlift",
              "Trap Bar Deadlift"
            ],
            sets: 2,
            targetReps: "6, 8",
            targetWeight: "110 kg",
            rir: "1-2",
            rpe: "8",
            percentage: "Top Set + Back-off",
            tempo: "3-1-0",
            rest: "3 dk",
            coachNotes: "Forma dikkat, belini nötr tut ve kalçayı arkaya doğru it.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "110kg", targetReps: "6", targetRpe: "8", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-7",
            name: "Leg Press Quad Bias",
            sets: 2,
            targetReps: "8",
            targetWeight: "160 kg",
            rir: "1",
            rpe: "8.5",
            percentage: "Kuadriseps",
            tempo: "3-0-1-0",
            rest: "2.5 dk",
            coachNotes: "Ayaklar tablada olabildiğince aşağıda konumlansın, tam derinlik.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "160kg", targetReps: "8", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-2-8",
            name: "3ct Paused Standing Smith Machine Calf Raise",
            sets: 3,
            targetReps: "5-8",
            targetWeight: "80 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "3-3-0",
            rest: "90 sn",
            coachNotes: "Dip noktada 3 saniye duraklama! Aşil tendonunun yay etkisini yok et.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 3, targetWeight: "80kg", targetReps: "7", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          }
        ]
      },
      {
        id: "day-3",
        dayName: "Perşembe",
        title: "Push (Omuz & Göğüs Öncelikli)",
        focus: "Üst Göğüs, Yan Omuz, Triceps, Karın",
        isRestDay: false,
        exercises: [
          {
            id: "ex-3-1",
            name: "Cable Clavicular Fly",
            sets: 1,
            targetReps: "6-10",
            targetWeight: "20 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Üst Göğüs",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Avuç içleri yukarı baksın, göğsün üst liflerine odaklan.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "20kg", targetReps: "9", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-2",
            name: "Weighted Dips",
            sets: 3,
            targetReps: "6, 8, 8",
            targetWeight: "+20 kg",
            rir: "1",
            rpe: "9",
            percentage: "Ağır İtiş",
            tempo: "2-1-0",
            rest: "2.5 dk",
            coachNotes: "Tempo az yap, kontrollü in ve patlayıcı yukarı it.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 3, targetWeight: "+20kg", targetReps: "6", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-3",
            name: "Seated Lateral Raises Machine",
            sets: 1,
            targetReps: "7-10",
            targetWeight: "40 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Kalçanın önünden tutuş, omuz başı izole.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "40kg", targetReps: "9", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-4",
            name: "Cable Lateral Raise (Makara kalça seviyesinde ve arkada)",
            sets: 1,
            targetReps: "7-10",
            targetWeight: "10 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-0-1-0",
            rest: "90 sn",
            coachNotes: "Kalçanın arkasından çapraz çekiş.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "10kg", targetReps: "8", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-5",
            name: "3 ct Paused Seated Machine Calf Raise",
            sets: 2,
            targetReps: "10-15",
            targetWeight: "40 kg",
            rir: "0",
            rpe: "10",
            percentage: "Soleus",
            tempo: "3-3-0",
            rest: "90 sn",
            coachNotes: "Soleus kası için dipte 3 sn bekleyip bas.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "40kg", targetReps: "12", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-6",
            name: "Ez Bar French Press",
            sets: 2,
            targetReps: "5-9",
            targetWeight: "32.5 kg",
            rir: "1",
            rpe: "8.5",
            percentage: "Triceps",
            tempo: "3-0-1-0",
            rest: "90 sn",
            coachNotes: "Dirsekleri açmadan kafanın arkasına tam esneme.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "32.5kg", targetReps: "8", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-3-7",
            name: "Weighted Crunch",
            sets: 2,
            targetReps: "6-10",
            targetWeight: "20 kg",
            rir: "0",
            rpe: "10",
            percentage: "Core",
            tempo: "2-1-0",
            rest: "60 sn",
            coachNotes: "Omurgayı bükerek karnı sıkıştır.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "20kg", targetReps: "10", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          }
        ]
      },
      {
        id: "day-4",
        dayName: "Cuma",
        title: "Rest Day (Dinlenme & Toparlanma)",
        focus: "Toparlanma, Hidrasyon, Adım Hedefi (8.000+ adım)",
        isRestDay: true,
        exercises: []
      },
      {
        id: "day-5",
        dayName: "Cumartesi",
        title: "Pull (Rhomboid & Upper Back Odaklı)",
        focus: "Üst Sırt, Trapez, Lats, Arka Omuz, Biceps",
        isRestDay: false,
        exercises: [
          {
            id: "ex-5-1",
            name: "Weighted Pull - Up",
            sets: 3,
            targetReps: "8",
            targetWeight: "+15 kg",
            rir: "1",
            rpe: "8.5",
            percentage: "Hacim",
            tempo: "2-0-0",
            rest: "2.5 dk",
            coachNotes: "Geniş tutuş, tepe noktada lats kasılmasını koru.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 3, targetWeight: "+15kg", targetReps: "8", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-5-2",
            name: "Seated Cable SA High Row",
            sets: 1,
            targetReps: "6-10",
            targetWeight: "35 kg",
            rir: "0-1",
            rpe: "9",
            percentage: "Üst Sırt / Lats",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Açılı çekiş, dirseği kaburga hizasına çek.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "35kg", targetReps: "8", targetRpe: "9", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-5-3",
            name: "Kelso Shrug",
            sets: 1,
            targetReps: "5-8",
            targetWeight: "30 kg DBs",
            rir: "1",
            rpe: "8.5",
            percentage: "Romboid / Orta Trapez",
            tempo: "2-2-0",
            rest: "90 sn",
            coachNotes: "Kollar düz, sadece kürek kemiklerini birbirine bastır ve 2 sn tut.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "30kg", targetReps: "7", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-5-4",
            name: "Horizontal Row of Choice",
            isChoice: true,
            selectedOption: "Chest Supported T-Bar Row",
            options: [
              "Chest Supported T-Bar Row",
              "Seated Cable Row (Neutral)",
              "Dumbbell Seal Row"
            ],
            sets: 2,
            targetReps: "6",
            targetWeight: "70 kg",
            rir: "1",
            rpe: "8.5",
            percentage: "Güç",
            tempo: "2-1-0",
            rest: "2 dk",
            coachNotes: "Göğsü destekten kaldırma, dirsekleri geriye fırlat.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "70kg", targetReps: "6", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-5-5",
            name: "Seated Ez Bar Reverse Curl",
            sets: 2,
            targetReps: "7-9",
            targetWeight: "25 kg",
            rir: "0",
            rpe: "9.5",
            percentage: "Brachialis",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Avuç içleri aşağı baksın, ön kolu patlat.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "25kg", targetReps: "8", targetRpe: "9.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-5-6",
            name: "Nick Gloff Rear Delt Raise (Cuff ile)",
            sets: 2,
            targetReps: "7-10",
            targetWeight: "7.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Arka Omuz",
            tempo: "2-1-0",
            rest: "90 sn",
            coachNotes: "Cuff ile, arka omuzu maksimum gerginlikte hisset.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 2, targetWeight: "7.5kg", targetReps: "9", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          }
        ]
      },
      {
        id: "day-6",
        dayName: "Pazar",
        title: "Rest Day (Dinlenme)",
        focus: "Karbonhidrat Depoları, Uyku, Masaj / Esneme",
        isRestDay: true,
        exercises: []
      },
      {
        id: "day-7",
        dayName: "Pazartesi",
        title: "Limbs B (Kol & Alt Vücut Destek)",
        focus: "Triceps, Yan Omuz, Kuadriseps, Hamstring",
        isRestDay: false,
        exercises: [
          {
            id: "ex-7-1",
            name: "Incline Z Bar Skull Crusher (45 Derece)",
            sets: 1,
            targetReps: "5-9",
            targetWeight: "35 kg",
            rir: "1",
            rpe: "8.5",
            percentage: "Triceps Uzun Baş",
            tempo: "3-1-0",
            rest: "2 dk",
            coachNotes: "45 derece sehpada dirsekleri geride sabitle, tam açılış.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "35kg", targetReps: "7", targetRpe: "8.5", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-7-2",
            name: "Cable SA Triceps Extension with Cuff",
            sets: 1,
            targetReps: "5-9",
            targetWeight: "17.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-1-0",
            rest: "60 sn",
            coachNotes: "Cuff bilekte, dirseği oynatma, tam ekstansiyon.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "17.5kg", targetReps: "8", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          },
          {
            id: "ex-7-3",
            name: "Cable Lateral Raise (Makara kalça seviyesinde ve arkada)",
            sets: 1,
            targetReps: "5-8",
            targetWeight: "12.5 kg",
            rir: "0",
            rpe: "10",
            percentage: "Tükeniş",
            tempo: "2-0-1-0",
            rest: "90 sn",
            coachNotes: "Son tekrarda 2 saniye tepe izometrik tutuş.",
            videoUrl: "",
            weeks: {
              1: { targetSet: 1, targetWeight: "12.5kg", targetReps: "7", targetRpe: "10", actualWeight: "", actualReps: "", actualRpe: "", actualNotes: "", completed: false },
            }
          }
        ]
      }
    ]
  },
  nutritionPlan: {
    dietType: "Temiz Hacim / Hipertrofi (Lean Bulk)",
    bmrCalculations: {
      schofield: 1731,
      ericHelms: 1518,
      harrisBenedict1984: 1742,
      averageBmr: 1664,
    },
    maintenanceKcal: 2662,
    targetKcal: 2780, // Surplus +120-150 kcal
    surplusDeficitType: "surplus", // 'surplus' | 'deficit' | 'maintenance'
    surplusDeficitValue: 120, // kcal
    macroTargets: {
      proteinG: 160, // 2.32 g/kg
      proteinPerKg: 2.32,
      carbG: 380,    // 5.5 g/kg
      fatG: 65,      // ~0.94 g/kg
    },
    waterTargetLiters: 3.5,
    hydrationGuide: "İdrar rengi 1-3 skalasında açık sarı/şeffaf olmalı. Dehidrasyon güç kaybına neden olur.",
    saltTargetGrams: "8 - 15 gr",
    saltNotice: "Terleme ve idman yoğunluğuna göre 8-15 gr arası tuz alımı pompa ve hidrasyon için kritiktir. 8 gr altına asla düşmeyin!",
    fiberTargetGrams: 35,
    cardioNote: "Kalori kesmek yerine kardiyo artırılabilir. Haftalık rutin: 1 adet 40 dk LISS veya 20 dk HIIT seansı.",
    supplements: [
      { name: "Kreatin Monohidrat", dosage: "5g", timing: "Her gün sabah veya idman sonrası bol suyla", note: "Hücresel hidrasyon & ATP üretimi" },
      { name: "Omega 3 (Balık Yağı)", dosage: "2000mg (Yüksek EPA/DHA)", timing: "Öğünlerle birlikte (Öğle / Akşam)", note: "Eklem sağlığı ve antienflamatuar etki" },
      { name: "Vitamin D3 + K2", dosage: "5000 IU", timing: "Sabah kahvaltısından sonra (Yağlı öğünle)", note: "Kemik ve bağışıklık desteği" },
      { name: "Magnezyum Bisglisinat", dosage: "300-400mg", timing: "Gece yatmadan 45 dakika önce", note: "Kas gevşemesi ve derin uyku" },
      { name: "Whey Protein İzole / Konsantre", dosage: "1 Ölçek (30g)", timing: "İdman hemen sonrası", note: "Hızlı kas proteini sentezi" }
    ],
    meals: [
      {
        id: "meal-1",
        name: "Öğün 1: Enerji Dolu Kahvaltı",
        time: "08:30",
        notes: "Güne yüksek protein ve kompleks karb ile başla.",
        items: [
          { name: "Yulaf Ezmesi", amount: 80, unit: "g", protein: 10.4, carb: 54.4, fat: 5.6, kcal: 311 },
          { name: "Yumurta (Tam L)", amount: 2, unit: "adet", protein: 13, carb: 1, fat: 10, kcal: 144 },
          { name: "Yumurta Beyazı", amount: 2, unit: "adet", protein: 8, carb: 0.4, fat: 0.2, kcal: 34 },
          { name: "Muz", amount: 1, unit: "adet (120g)", protein: 1.3, carb: 27, fat: 0.3, kcal: 105 },
          { name: "Fıstık Ezmesi (%100 Fıstık)", amount: 20, unit: "g", protein: 5, carb: 4, fat: 10, kcal: 118 },
        ]
      },
      {
        id: "meal-2",
        name: "Öğün 2: Pre-Workout (İdman Öncesi 1.5-2 Saat)",
        time: "12:30",
        notes: "Düşük yağ, yüksek sindirilebilir karb ve yağsız protein.",
        items: [
          { name: "Tavuk Göğsü (Izgara)", amount: 180, unit: "g", protein: 55.8, carb: 0, fat: 6.3, kcal: 297 },
          { name: "Pirinç (Yasmin/Basmati Pişmiş)", amount: 250, unit: "g", protein: 6.8, carb: 70, fat: 0.8, kcal: 325 },
          { name: "Zeytinyağı (Sızma)", amount: 10, unit: "g", protein: 0, carb: 0, fat: 10, kcal: 88 },
          { name: "Mevsim Yeşillikleri & Salata", amount: 100, unit: "g", protein: 1.5, carb: 3, fat: 0.2, kcal: 18 },
        ]
      },
      {
        id: "meal-3",
        name: "Öğün 3: Post-Workout (İdman Hemen Sonrası)",
        time: "16:30",
        notes: "Glikojen depolarını hızla yenile ve anabolik pencereyi tetikle.",
        items: [
          { name: "Whey Protein Tozu", amount: 30, unit: "g (1 ölçek)", protein: 24, carb: 2, fat: 1.5, kcal: 120 },
          { name: "Pirinç Patlağı", amount: 40, unit: "g (4 dilim)", protein: 3.2, carb: 32.8, fat: 0.8, kcal: 154 },
          { name: "Bal", amount: 15, unit: "g", protein: 0.1, carb: 12.4, fat: 0, kcal: 48 },
        ]
      },
      {
        id: "meal-4",
        name: "Öğün 4: Akşam Yemeği",
        time: "19:30",
        notes: "Zengin mikronütriyent, lif ve kaliteli protein.",
        items: [
          { name: "Yağsız Dana Kıyma / Somon", amount: 180, unit: "g", protein: 37.8, carb: 0, fat: 14.4, kcal: 281 },
          { name: "Patates (Fırın/Haşlama)", amount: 300, unit: "g", protein: 6, carb: 60, fat: 0.3, kcal: 261 },
          { name: "Brokoli & Kuşkonmaz", amount: 150, unit: "g", protein: 4.2, carb: 10.5, fat: 0.6, kcal: 53 },
          { name: "Zeytinyağı", amount: 10, unit: "g", protein: 0, carb: 0, fat: 10, kcal: 88 },
        ]
      },
      {
        id: "meal-5",
        name: "Öğün 5: Gece Ara Öğünü (Yatmadan Önce)",
        time: "22:30",
        notes: "Gece boyunca yavaş salınımlı kazein proteini.",
        items: [
          { name: "Süzme Yoğurt / Quark (%0-2)", amount: 200, unit: "g", protein: 20, carb: 8, fat: 3, kcal: 140 },
          { name: "Çiğ Badem / Ceviz", amount: 15, unit: "g", protein: 3.2, carb: 3.3, fat: 7.5, kcal: 87 },
          { name: "Yaban Mersini", amount: 50, unit: "g", protein: 0.4, carb: 7, fat: 0.2, kcal: 29 },
        ]
      }
    ]
  },
  measurements: {
    history: [
      { week: 1, date: "2026-10-01", weight: 68.8, neck: 37, chest: 102, arm: 37, waist: 76, hip: 94, thigh: 57, calf: 37.5, avgSteps: 8600 },
      { week: 2, date: "2026-10-08", weight: 69.2, neck: 37, chest: 102.5, arm: 37.2, waist: 76.2, hip: 94, thigh: 57.3, calf: 37.6, avgSteps: 9100 },
    ],
    dailyWeights: {
      "Pazartesi": 69.1,
      "Salı": 69.0,
      "Çarşamba": 69.2,
      "Perşembe": 69.3,
      "Cuma": 69.1,
      "Cumartesi": 69.4,
      "Pazar": 69.2
    },
    dailySteps: {
      "Pazartesi": 9200,
      "Salı": 10400,
      "Çarşamba": 8500,
      "Perşembe": 9100,
      "Cuma": 11200,
      "Cumartesi": 7800,
      "Pazar": 8100
    }
  }
};

// Formül Hesaplayıcılar
export function calculateBmrFormulas({ weightKg, heightCm, age, gender }) {
  const w = parseFloat(weightKg) || 70;
  const h = parseFloat(heightCm) || 175;
  const a = parseFloat(age) || 25;

  let schofield = 0;
  let harrisBenedict = 0;
  let ericHelms = 0;
  let mifflin = 0;

  if (gender === 'female') {
    // Schofield Kadın
    if (a < 30) schofield = 14.818 * w + 486.6;
    else if (a < 60) schofield = 8.126 * w + 845.6;
    else schofield = 9.082 * w + 658.5;

    // Harris-Benedict (1984 Revize)
    harrisBenedict = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);

    // Mifflin-St Jeor
    mifflin = (10 * w) + (6.25 * h) - (5 * a) - 161;

    // Helms FFM tahmini ~ %20 yağ oranı
    const ffm = w * 0.78;
    ericHelms = 22 * ffm;
  } else {
    // Schofield Erkek
    if (a < 30) schofield = 15.057 * w + 692.2;
    else if (a < 60) schofield = 11.472 * w + 873.1;
    else schofield = 11.711 * w + 587.7;

    // Harris-Benedict (1984 Revize)
    harrisBenedict = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);

    // Mifflin-St Jeor
    mifflin = (10 * w) + (6.25 * h) - (5 * a) + 5;

    // Helms FFM tahmini ~ %12 yağ oranı
    const ffm = w * 0.88;
    ericHelms = 22 * ffm;
  }

  const averageBmr = Math.round((schofield + harrisBenedict + mifflin) / 3);

  return {
    schofield: Math.round(schofield),
    harrisBenedict: Math.round(harrisBenedict),
    mifflin: Math.round(mifflin),
    ericHelms: Math.round(ericHelms),
    averageBmr
  };
}

// 1-5 Tekrar Isınma Piramidi Hesaplayıcı
export function calculateWarmupPyramid(workingWeightKg) {
  const w = parseFloat(workingWeightKg) || 100;
  return [
    { step: 1, loadDesc: "Boş Bar (20 kg)", weight: 20, reps: "2 set x 8-12 tekrar", note: "Eklem sıvılarını ısıt, hareket formunu oturt" },
    { step: 2, loadDesc: "%50 Çalışma Ağırlığı", weight: Math.round((w * 0.5) / 2.5) * 2.5, reps: "5 tekrar", note: "Dinamik tempo, patlayıcı itiş/çekiş" },
    { step: 3, loadDesc: "%70 Çalışma Ağırlığı", weight: Math.round((w * 0.7) / 2.5) * 2.5, reps: "3 tekrar", note: "Sinir sistemini hazırla, formu mükemmelleştir" },
    { step: 4, loadDesc: "%85 Çalışma Ağırlığı", weight: Math.round((w * 0.85) / 2.5) * 2.5, reps: "1 tekrar", note: "Potansiyelizasyon (PAP) tekniği" },
    { step: 5, loadDesc: "%92-95 Çalışma Ağırlığı (Opsiyonel)", weight: Math.round((w * 0.925) / 2.5) * 2.5, reps: "1 tekrar", note: "Sadece çok ağır tekli setler için" },
    { step: 6, loadDesc: "ÇALIŞMA SETİ (%100)", weight: w, reps: "Hedef Çalışma Seti", isWorkingSet: true, note: "Tam konsantrasyon, maksimum efor!" }
  ];
}
