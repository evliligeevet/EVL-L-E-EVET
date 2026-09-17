// ============================================================================
// Evliliğe Evet — Üye Firmalar
// ============================================================================

const FIRMS = [
  {
    name: "Botanik Gardens",
    whatsapp: "905323769208",
    district: "Gölbaşı",
    categories: ["mekan_kir"],
    instagram: "https://www.instagram.com/botanikgardens/"
  },
  {
    name: "Botanik Loca",
    whatsapp: "905323769208",
    district: "Gölbaşı",
    categories: ["mekan_kir"],
    instagram: "https://www.instagram.com/botanikloca/"
  },
  {
    name: "Lavessa İncek Event",
    whatsapp: "905302638832",
    district: "Gölbaşı",
    categories: ["mekan_kir"]
  },
  {
    name: "Setr-i Nur Etimesgut",
    whatsapp: "908503773127",
    district: "Etimesgut",
    categories: ["gelinlik"],
    instagram: "https://www.instagram.com/setrinurankaraetimesgut/"
  },
  {
    name: "Setr-i Nur Makeup",
    whatsapp: "908503773127",
    district: "Etimesgut",
    categories: ["makyaj"],
    instagram: "https://www.instagram.com/setrinurankaraetimesgut/"
  },

  // Yeni firma eklerken bu formatta ekle (instagram/youtube/website/priceList
  // OPSİYONEL, sadece elinde olanları ekle, olmayanları hiç yazma):
  // {
  //   name: "Firma Adı",
  //   whatsapp: "905XXXXXXXXX",
  //   district: "İlçe Adı",
  //   categories: ["gelinlik", "makyaj"],
  //   instagram: "https://instagram.com/kullaniciadi",
  //   youtube: "https://youtube.com/@kanaladi",
  //   website: "https://firmasitesi.com",
  //   priceList: [
  //     { item: "Klasik Paket", price: "8.000 TL" },
  //     { item: "Kampanya", price: "4.000 TL" }
  //   ]
  // },
];

// İlçe merkez koordinatları (mesafe hesaplaması için)
const DISTRICT_COORDS = {
  "Çankaya": { lat: 39.9179, lng: 32.8627 },
  "Keçiören": { lat: 39.9950, lng: 32.8636 },
  "Yenimahalle": { lat: 39.9694, lng: 32.7889 },
  "Etimesgut": { lat: 39.9500, lng: 32.6667 },
  "Mamak": { lat: 39.9333, lng: 32.9167 },
  "Sincan": { lat: 39.9667, lng: 32.5833 },
  "Altındağ": { lat: 39.9556, lng: 32.8794 },
  "Pursaklar": { lat: 40.0333, lng: 32.9000 },
  "Gölbaşı": { lat: 39.7908, lng: 32.8075 },
};

// ============================================================================
// Arama dizini — hiçbir kategori ön planda görünmüyor, hepsi burada, arama
// kutusunun arkasında duruyor. Firma olmayan kategoriler "henüz firma yok"
// gösterir ama arama kapalı değil — herkes aranabilir, kimse kapı dışında
// bırakılmaz. Yeni kelime eklemek tek satır.
// ============================================================================
const SEARCH_INDEX = [
  { keyword: "gelinlik", categories: ["gelinlik"], label: "Gelinlikçi" },
  { keyword: "gelin", categories: ["gelinlik", "makyaj"], label: "Gelinlik & Makyaj" },
  { keyword: "makyaj", categories: ["makyaj"], label: "Gelin Saçı & Makyajı" },
  { keyword: "saç", categories: ["makyaj"], label: "Gelin Saçı & Makyajı" },
  { keyword: "güzellik merkezi", categories: ["makyaj"], label: "Güzellik Merkezi" },
  { keyword: "damatlık", categories: ["damatlik"], label: "Damatlık" },
  { keyword: "damat", categories: ["damatlik"], label: "Damatlık" },
  { keyword: "abiye", categories: ["abiye"], label: "Abiye & Nişanlık" },
  { keyword: "nişanlık", categories: ["abiye"], label: "Abiye & Nişanlık" },
  { keyword: "teklif", categories: ["teklif"], label: "Evlilik Teklifi" },
  { keyword: "evlilik teklifi", categories: ["teklif"], label: "Evlilik Teklifi" },
  { keyword: "fotoğraf", categories: ["fotograf"], label: "Fotoğrafçı" },
  { keyword: "fotoğrafçı", categories: ["fotograf"], label: "Fotoğrafçı" },
  { keyword: "video", categories: ["fotograf"], label: "Fotoğraf & Video" },
  { keyword: "klip", categories: ["fotograf"], label: "Klip Çekimi" },
  { keyword: "drone", categories: ["fotograf"], label: "Drone Çekimi" },
  { keyword: "nikah", categories: ["mekan_kir", "mekan_salon", "mekan_tarihi", "mekan_sosyal", "mekan_otel"], label: "Nikah (Tüm Mekan Tipleri)" },
  { keyword: "söz", categories: ["mekan_kir", "mekan_salon", "mekan_tarihi", "mekan_sosyal", "mekan_otel"], label: "Söz / Nişan Mekanları" },
  { keyword: "nişan", categories: ["mekan_kir", "mekan_salon", "mekan_tarihi", "mekan_sosyal", "mekan_otel"], label: "Söz / Nişan Mekanları" },
  { keyword: "kır düğünü", categories: ["mekan_kir"], label: "Kır Düğünü" },
  { keyword: "düğün salonu", categories: ["mekan_salon"], label: "Düğün Salonu" },
  { keyword: "nikah salonu", categories: ["mekan_salon"], label: "Nikah Salonu" },
  { keyword: "balo", categories: ["mekan_salon"], label: "Balo & Davet Salonu" },
  { keyword: "davet salonu", categories: ["mekan_salon"], label: "Balo & Davet Salonu" },
  { keyword: "otel düğünü", categories: ["mekan_otel"], label: "Otel Düğünü" },
  { keyword: "tarihi mekan", categories: ["mekan_tarihi"], label: "Tarihi Mekan" },
  { keyword: "sosyal tesis", categories: ["mekan_sosyal"], label: "Sosyal Tesis" },
  { keyword: "tekne", categories: ["mekan_kir", "mekan_sosyal"], label: "Tekne Düğünü" },
  { keyword: "mekan", categories: ["mekan_kir", "mekan_salon", "mekan_tarihi", "mekan_sosyal", "mekan_otel"], label: "Tüm Düğün Mekanları" },
  { keyword: "dans", categories: ["dans"], label: "Dans Kursu / Gösterisi" },
  { keyword: "dansçı", categories: ["dans"], label: "Dans Kursu / Gösterisi" },
  { keyword: "müzik", categories: ["muzik"], label: "Müzik" },
  { keyword: "dj", categories: ["muzik"], label: "DJ" },
  { keyword: "orkestra", categories: ["muzik"], label: "Orkestra" },
  { keyword: "ışık", categories: ["muzik"], label: "Işık, Ses ve Düzenleme" },
  { keyword: "ses düzeni", categories: ["muzik"], label: "Işık, Ses ve Düzenleme" },
  { keyword: "after party", categories: ["muzik"], label: "After Party" },
  { keyword: "çiçek", categories: ["cicek"], label: "Çiçekçi" },
  { keyword: "dekorasyon", categories: ["cicek"], label: "Çiçek & Dekorasyon" },
  { keyword: "pasta", categories: ["pasta"], label: "Düğün Pastası" },
  { keyword: "davetiye", categories: ["davetiye"], label: "Davetiye" },
  { keyword: "kına", categories: ["kina"], label: "Kına Organizasyonu" },
  { keyword: "bekarlığa veda", categories: ["kina"], label: "Kına & Bekarlığa Veda" },
  { keyword: "nikah şekeri", categories: ["hediyelik"], label: "Nikah Şekeri & Hediyelik" },
  { keyword: "hediyelik", categories: ["hediyelik"], label: "Nikah Şekeri & Hediyelik" },
  { keyword: "gelin arabası", categories: ["gelinArabasi"], label: "Gelin Arabası" },
  { keyword: "catering", categories: ["catering"], label: "Catering / İkram" },
  { keyword: "kokteyl", categories: ["catering"], label: "Kokteyl" },
  { keyword: "yemek", categories: ["catering"], label: "Nikah Sonrası Yemeği" },
  { keyword: "organizasyon", categories: ["organizasyon"], label: "Düğün Organizasyonu" },
  { keyword: "alyans", categories: ["alyans"], label: "Alyans & Takı" },
  { keyword: "takı", categories: ["alyans"], label: "Alyans & Takı" },
  { keyword: "ayakkabı", categories: ["ayakkabi"], label: "Ayakkabı & Aksesuar" },
  { keyword: "aksesuar", categories: ["ayakkabi"], label: "Ayakkabı & Aksesuar" },
];
