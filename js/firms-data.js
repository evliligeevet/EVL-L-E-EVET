// ============================================================================
// Evliliğe Evet — Üye Firmalar
// ============================================================================
// Kategori seçenekleri:
//   Mekan tipleri: "mekan_kir", "mekan_salon", "mekan_tarihi", "mekan_sosyal", "mekan_otel"
//   Diğer hizmetler: "gelinlik", "makyaj", "fotograf", "teklif", "gelinArabasi", "muzik", "dansKursu"

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
  //   categories: ["mekan_salon", "gelinlik", "muzik"],
  //   instagram: "https://instagram.com/kullaniciadi",
  //   youtube: "https://youtube.com/@kanaladi",
  //   website: "https://firmasitesi.com",
  //   priceList: [
  //     { item: "1 Kişi Et Menü", price: "3.000 TL" },
  //     { item: "1 Kişi Tavuk Menü", price: "2.000 TL" },
  //     { item: "1 Kişi Kokteyl", price: "500 TL" }
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
