# CoachFit Pro 🏋️‍♂️

Fitness eğitmenleri ve danışanları için özel olarak geliştirilmiş, karmaşık e-tabloların (Google Sheets / Excel) yerini alan modern, sade ve bilimsel antrenman & beslenme yönetim platformu.

## 🚀 Özellikler

- **Antrenman Programlayıcı:**
  - Hareket İsmi, Set x Tekrar, Hedef Ağırlık, RIR, RPE, Percentage (% e1RM, Drop set), Tempo (örn: 3-0-1-0), Dinlenme süresi.
  - Koç Notları & Video Linki.
  - Hafta Hafta Performans Takibi: Önerilen vs. Yapılan (Gerçekleşen Log).
  - Tek tıkla progresif aşırı yüklenme (+2.5 kg artışla haftayı bir sonrakine kopyalama).
- **Isınma & 1-5 RM Piramit Hesaplayıcı:**
  - Dr. Stuart McGill Big 3 protokolü (omurga stabilitesi).
  - Dinamik bacak & kalça ısınma rutini.
  - Çalışma ağırlığı girildiğinde otomatik boş bar, %50, %70, %85, %92.5 ısınma ağırlıklarını hesaplayan akıllı piramit.
- **Diyet Listesi & Makro / Mikro Planı:**
  - Bilimsel BMR formülleri: Schofield, Harris-Benedict (1984 Revize) ve Eric Helms (FFM) formüllerinin ortalaması.
  - Aktivite çarpanı (PAL) ve deneyim seviyesine göre surplus / deficit rehberi.
  - Makro hedef çubukları (Protein g & g/kg, Karb g, Yağ g, Kalori).
  - Öğün öğün besin listesi (Hazır besin kütüphanesi ile otomatik gramaj ve kalori hesaplama).
  - Su tüketimi (Litre & hidrasyon skalası), Tuz/Sodyum (8-15 gr uyarısı), Lif ve Takviye (Supplement) protokolleri.
- **Danışan Görünümü (Sporcu Modu):**
  - Salonda cep telefonunda rahat kullanım için sade arayüz.
  - Hareket tikleme, yapılan ağırlık/tekrar kaydetme.
  - Dahili set arası dinlenme kronometresi (Rest Timer).
  - Canlı su tüketim sayacı.
- **Ölçüm & İlerleme Takibi:**
  - Günlük aç karnına tartı kaydı & haftalık ortalama ağırlık.
  - Günlük adım (NEAT) takibi.
  - Bölgesel vücut çevre ölçümleri (Mezura check-in).
- **Çoklu Danışan & Dışa Aktarma:**
  - Yeni danışan profilleri oluşturma.
  - Tek tıkla yazdırılabilir A4 / PDF çıktısı.
  - JSON yedekleme ve içe aktarma.
  - LocalStorage ile tarayıcıda kalıcı kayıt.

## 🛠️ Kurulum & Çalıştırma

Projeyi yerel ortamda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Canlı (Production) derlemesi alın
npm run build
```

## 🌐 Vercel ile Canlıya Alma

Bu repo doğrudan Vercel'e bağlanarak 1 tıkla yayına alınabilir:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
