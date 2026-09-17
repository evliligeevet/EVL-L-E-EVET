// ============================================================================
// Evliliğe Evet — Eşleştirme Motoru (Armut.com mantığı: en yakın 3 firma)
// ============================================================================

const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('results');
const resultsList = document.getElementById('resultsList');

const CAT_LABELS = {
  mekan_kir: "Kır Düğünü", mekan_salon: "Düğün Salonu", mekan_tarihi: "Tarihi Mekan",
  mekan_sosyal: "Sosyal Tesis", mekan_otel: "Otel Düğünü",
  gelinlik: "Gelinlikçi", makyaj: "Gelin Saçı & Makyajı", fotograf: "Düğün Fotoğrafçısı",
  teklif: "Evlilik Teklifi", gelinArabasi: "Gelin Arabası", muzik: "Müzik", dansKursu: "Dans Kursu"
};

document.querySelectorAll('input[name="cat"]').forEach(cb => {
  cb.addEventListener('change', () => {
    document.getElementById('budget-' + cb.value).style.display = cb.checked ? 'block' : 'none';
  });
});

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

function distanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180, lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function buildMessage(name, phone, cat, district, date) {
  const budget = document.getElementById('budget-' + cat).value.trim();
  let msg = `Size Evliliğe Evet aracılığıyla ulaşıyorum. ${CAT_LABELS[cat]} hizmeti için bilgi almak istiyorum.`;
  if (budget) msg += ` Bütçem: ${budget}.`;
  if (district) msg += ` İlçe: ${district}.`;
  if (date) msg += ` Düğün tarihim: ${date}.`;
  if (name) msg += ` Adım: ${name}.`;
  if (phone) msg += ` Telefon: ${phone}.`;
  return encodeURIComponent(msg);
}

searchBtn.addEventListener('click', () => {
  const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(el => el.value);
  const districtName = document.getElementById('district').value;
  const date = formatDate(document.getElementById('weddingDate').value);
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (selectedCats.length === 0) {
    alert("Lütfen en az bir hizmet seçin.");
    return;
  }
  if (!districtName) {
    alert("Lütfen ilçenizi seçin — size en yakın firmaları bulabilmemiz için gerekli.");
    return;
  }

  const userCoord = DISTRICT_COORDS[districtName];
  resultsList.innerHTML = "";

  selectedCats.forEach(cat => {
    let matches = FIRMS.filter(f => f.categories.includes(cat));
    matches = matches.map(f => {
      const fCoord = DISTRICT_COORDS[f.district] || userCoord;
      return { ...f, dist: distanceKm(userCoord, fCoord) };
    }).sort((a, b) => a.dist - b.dist).slice(0, 3);

    const group = document.createElement('div');
    group.className = 'cat-group';

    const title = document.createElement('h3');
    title.className = 'cat-group-title';
    title.textContent = matches.length > 0
      ? `${CAT_LABELS[cat]} — Size En Yakın ${matches.length} Firma`
      : `${CAT_LABELS[cat]} — Henüz Firma Yok`;
    group.appendChild(title);

    if (matches.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = "Bu kategoride sistemde henüz üye firma yok, yakında eklenecek.";
      group.appendChild(empty);
    } else {
      matches.forEach(firm => {
        const waMsg = buildMessage(name, phone, cat, districtName, date);

        const socialIcons = [
          { key: 'instagram', title: 'Instagram', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>` },
          { key: 'youtube', title: 'YouTube', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>` },
          { key: 'website', title: 'Web Sitesi', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>` }
        ];
        const socialLinks = socialIcons.map(s => {
          if (firm[s.key]) {
            return `<a class="social-btn" href="${firm[s.key]}" target="_blank" title="${s.title}">${s.svg}</a>`;
          }
          return `<span class="social-btn social-btn-disabled" title="${s.title} bağlantısı yok">${s.svg}</span>`;
        }).join('');

        const card = document.createElement('div');
        card.className = 'firm-card';
        card.innerHTML = `
          <div class="firm-info">
            <p class="firm-name">${firm.name}</p>
            <p class="firm-meta">${firm.district} · ${firm.dist.toFixed(1)} km</p>
            <div class="firm-social">${socialLinks}</div>
          </div>
          <a class="firm-whatsapp" href="https://wa.me/${firm.whatsapp}?text=${waMsg}" target="_blank">WhatsApp'tan Ulaş</a>
        `;
        group.appendChild(card);
      });
    }

    resultsList.appendChild(group);
  });

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
});
