export const exerciseCategories = [
  {
    category: "Göğüs (Chest)",
    exercises: [
      { name: "Barbell Bench Press", defaultTempo: "2-1-0", defaultRir: "1-2", defaultRpe: "8", cue: "Kürek kemiklerini sıkıştır, ayaklarını yere sağlam bas." },
      { name: "Incline Dumbbell Press", defaultTempo: "3-0-1-0", defaultRir: "1-2", defaultRpe: "8", cue: "Sehpa açısı 30 derece, dirsekleri gövdeye 45 derece tut." },
      { name: "Weighted Dips", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Hafifçe öne eğil, tam derinliğe in ama omuzları koru." },
      { name: "Chest Fly of Choice (Cable / Pec Deck)", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "10", cue: "Kolları yay gibi aç, tepe noktada göğsü 1 saniye sık." },
      { name: "Vertical Chest Press of Choice", defaultTempo: "2-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Maksimum stabilite, göğüs hizasında itiş yap." },
      { name: "Cable Clavicular Fly", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Avuç içleri yukarı baksın, üst göğüs liflerini sık." },
      { name: "Smith Machine Incline Press", defaultTempo: "3-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Barı köprücük kemiğinin hemen altına indir." },
    ]
  },
  {
    category: "Sırt (Back & Lats)",
    exercises: [
      { name: "Weighted Pull - Up", defaultTempo: "2-0-0", defaultRir: "1", defaultRpe: "9", cue: "Çeneyi barın üstüne çek, lats odaklı tam uzanış." },
      { name: "T-Bar Row", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Dirsekleri daha fazla yana verelim, üst sırtı sıkıştır." },
      { name: "Horizontal Row of Choice (Chest Supported)", defaultTempo: "2-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Göğsü destekten ayırma, dirsekleri geriye sür." },
      { name: "Seated Cable SA High Row", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Tek kolla çekiş, lats lifleri doğrultusunda odaklan." },
      { name: "Lat Pulldown (Neutral / Wide Grip)", defaultTempo: "2-0-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Göğüs açık, dirsekleri ceplerine doğru çek." },
      { name: "Kelso Shrug", defaultTempo: "2-2-0", defaultRir: "1", defaultRpe: "8", cue: "Sadece kürek kemiklerini birbirine yaklaştırıp uzaklaştır." },
      { name: "DL of Choice (Deadlift / RDL)", defaultTempo: "3-1-0", defaultRir: "2", defaultRpe: "7.5", cue: "Forma dikkat, omurgayı nötr tut, kalçayı geriye it." },
    ]
  },
  {
    category: "Omuz (Delts)",
    exercises: [
      { name: "Standing Dumbbell Lateral Raise", defaultTempo: "2-0-0", defaultRir: "0", defaultRpe: "10", cue: "Bilekler dirsek hizasında, trapezleri devre dışı bırak." },
      { name: "Cable Lateral Raise (Makara kalça seviyesinde)", defaultTempo: "2-0-1-0", defaultRir: "0", defaultRpe: "10", cue: "Kalçanın arkasından veya önünden kontrollü çekiş." },
      { name: "Seated Lateral Raises Machine", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "10", cue: "Kalçanın önünden, tepe noktada kontrol sağla." },
      { name: "Y-Raise (Incline Bench / Cable)", defaultTempo: "2-0-0", defaultRir: "0", defaultRpe: "10", cue: "Kolları Y harfi şeklinde kaldır, alt trapez ve yan omuz." },
      { name: "Nick Gloff Rear Delt Raise (Cuff ile)", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "10", cue: "Cuff ile, arka omuzu maksimum esnet ve sık." },
      { name: "Overhead Dumbbell / Barbell Press", defaultTempo: "2-1-0", defaultRir: "1-2", defaultRpe: "8", cue: "Karnı sık, beli aşırı kavis yapmadan kafanın üstüne it." },
    ]
  },
  {
    category: "Kollar (Biceps & Triceps)",
    exercises: [
      { name: "Z bar/DB Preacher Curl", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Makarayı veya sehpayı bilek açısında yap, tepe sıkışma." },
      { name: "Single Arm Scott Curl Machine", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Makarayı bilek açısında yap, tepe noktada kasılma." },
      { name: "Incline Bench DB Curl", defaultTempo: "3-0-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Uzun baş esnemesi için dirsekleri sabit tut." },
      { name: "Seated Ez Bar Reverse Curl", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "9.5", cue: "Ön kol ve brachialis odaklı kontrollü negatif." },
      { name: "Incline Z Bar Skull Crusher (45 Derece)", defaultTempo: "3-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "45 derece sehpada, dirsekleri geride sabitle." },
      { name: "Cable SA Triceps Extension with Cuff", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "10", cue: "Cuff bileğe takılı, dirseği sabitleyip triceps'i kitle." },
      { name: "Single Arm Cable Kickback", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "10", cue: "Gövde 45 derece eğik, tepe noktada 1 saniye bekle." },
      { name: "Ez Bar French Press", defaultTempo: "3-0-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Dirsekleri açmadan başın arkasına kontrollü iniş." },
    ]
  },
  {
    category: "Bacak & Kalça (Legs & Glutes)",
    exercises: [
      { name: "Bulgarian Split Squat", defaultTempo: "3-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Ön bacağa odaklan, derin iniş ve kontrollü kalkış." },
      { name: "Leg Press Quad Bias", defaultTempo: "3-0-1-0", defaultRir: "1", defaultRpe: "8.5", cue: "Ayaklar olabildiğince aşağıda konumlansın, kuadriseps odaklı." },
      { name: "2ct Pause Seated Leg Curl", defaultTempo: "2-2-0", defaultRir: "0-1", defaultRpe: "9", cue: "Tepe sıkışmada 2 saniye bekle, kontrollü açıl." },
      { name: "Lying Leg Curl", defaultTempo: "3-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "Kalçayı pedden kaldırma, hamstringi sonuna kadar bük." },
      { name: "Leg Adductor Machine", defaultTempo: "2-1-0", defaultRir: "0-1", defaultRpe: "9", cue: "İç bacak odaklı, tam açılış ve güçlü sıkışma." },
      { name: "Leg Abductor Machine (Opsiyonel)", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "9", cue: "Kalça yan kısmı için dışa doğru güçlü itiş." },
      { name: "Barbell Back Squat / Hack Squat", defaultTempo: "3-1-0", defaultRir: "2", defaultRpe: "8", cue: "Dizler parmak ucu yönünde, derin ve stabil çöküş." },
      { name: "3ct Paused Standing Smith Machine Calf Raise", defaultTempo: "3-3-0", defaultRir: "0", defaultRpe: "10", cue: "Dipte 3 saniye tam esneme, parmak ucunda tepe kasılma." },
      { name: "3ct Paused Seated Machine Calf Raise", defaultTempo: "3-3-0", defaultRir: "0", defaultRpe: "10", cue: "Soleus kası için dipte duraklama ve kontrollü itiş." },
    ]
  },
  {
    category: "Karın & Core (Abs)",
    exercises: [
      { name: "Weighted Crunch", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "9.5", cue: "Ağırlığı göğüste tut, omurgayı bükerek karını sıkıştır." },
      { name: "Weighted Reverse Crunch - Russian Twist", defaultTempo: "2-0-0", defaultRir: "0", defaultRpe: "9", cue: "Pelvisi yukarı yuvarla, rotasyonda kontrollü ol." },
      { name: "Ab Focused Core of Choice (Cable Rope / Hanging)", defaultTempo: "2-1-0", defaultRir: "0", defaultRpe: "9.5", cue: "Tam fleksiyon ve kontrollü negatif." },
    ]
  }
];

export const allFlatExercises = exerciseCategories.flatMap(c => 
  c.exercises.map(e => ({ ...e, category: c.category }))
);
