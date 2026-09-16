// ============================================================================
// Evliliğe Evet — Üye Firmalar
// ============================================================================
// Her firma için: isim, whatsapp (başında 90 ile, boşluksuz), ilçe,
// hizmet kategorileri (categories dizisi).
//
// Kategori seçenekleri: "gelinlik", "makyaj" (ileride "mekan", "fotograf",
// "cicek" gibi yenilerini aynı formatta ekleyebilirsin)

const FIRMS = [
  {
    name: "ÖRNEK Gelinlik & Güzellik Evi",
    whatsapp: "905XXXXXXXXX",
    district: "Çankaya",
    categories: ["gelinlik", "makyaj"]
  },

  // Yeni firma eklerken bu formatta ekle:
  // {
  //   name: "Firma Adı",
  //   whatsapp: "905XXXXXXXXX",
  //   district: "İlçe Adı",
  //   categories: ["gelinlik", "makyaj"]
  // },
];
