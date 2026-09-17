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
  let msg = `Merhaba, size evliligeevet.com üzerinden ulaşıyorum. ${CAT_LABELS[cat]} hizmeti için bilgi almak istiyorum.`;
  if (budget) msg += ` Tahmini bütçem ${budget} aralığındadır.`;
  msg += ` Onayladığınız takdirde sizinle iletişime geçmek isteriz, sizin de teklifinizi bekliyoruz.`;
  if (district) msg += ` İlçe: ${district}.`;
  if (date) msg += ` Düğün tarihim: ${date}.`;
  if (name) msg += ` Adım: ${name}.`;
  if (phone) msg += ` Telefon: ${phone}.`;
  msg += ` Teşekkürler.`;
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

    const enteredBudget = document.getElementById('budget-' + cat).value.trim();
    if (enteredBudget) {
      const budgetLine = document.createElement('p');
      budgetLine.className = 'cat-group-budget';
      budgetLine.textContent = `Bütçeniz: ${enteredBudget}`;
      group.appendChild(budgetLine);
    }

    if (matches.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = "Bu kategoride sistemde henüz üye firma yok, yakında eklenecek.";
      group.appendChild(empty);
    } else {
      matches.forEach(firm => {
        const waMsg = buildMessage(name, phone, cat, districtName, date);

        const socialIcons = [
          { key: 'instagram', title: 'Instagram', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.5.5-1.1.9-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.5-.5-.9-1.1-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.5-.5 1.1-.9 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.3 2 12 2zm0 1.8c-2.65 0-2.99.01-4.04.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.06.7-.32.32-.52.63-.7 1.06-.13.32-.28.82-.32 1.72C4.11 9.01 4.1 9.35 4.1 12s.01 2.99.06 4.04c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.06.32.32.63.52 1.06.7.32.13.82.28 1.72.32 1.05.05 1.39.06 4.04.06s2.99-.01 4.04-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.06-.7.32-.32.52-.63.7-1.06.13-.32.28-.82.32-1.72.05-1.05.06-1.39.06-4.04s-.01-2.99-.06-4.04c-.04-.9-.19-1.4-.32-1.72-.17-.43-.37-.74-.7-1.06-.32-.32-.63-.52-1.06-.7-.32-.13-.82-.28-1.72-.32C14.99 3.81 14.65 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7zm5.35-1.98a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg>` },
          { key: 'youtube', title: 'YouTube', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/></svg>` },
          { key: 'website', title: 'Web Sitesi', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.4a15.6 15.6 0 0 0-1.3-5.7A8.03 8.03 0 0 1 19.93 11zM12 4.06c.9 1.16 1.95 3.1 2.4 6.94H9.6c.45-3.84 1.5-5.78 2.4-6.94zM9.6 13h4.8c-.45 3.84-1.5 5.78-2.4 6.94-.9-1.16-1.95-3.1-2.4-6.94zm-1.83-2H4.07a8.03 8.03 0 0 1 4.7-5.7A15.6 15.6 0 0 0 7.47 11zm0 2a15.6 15.6 0 0 0 1.3 5.7A8.03 8.03 0 0 1 4.07 13h3.4zm9.06 5.7a15.6 15.6 0 0 0 1.3-5.7h3.4a8.03 8.03 0 0 1-4.7 5.7z"/></svg>` }
        ];
        const socialLinks = socialIcons.map(s => {
          if (firm[s.key]) {
            return `<a class="social-btn" href="${firm[s.key]}" target="_blank" title="${s.title}">${s.svg}</a>`;
          }
          return `<span class="social-btn social-btn-disabled" title="${s.title} bağlantısı yok">${s.svg}</span>`;
        }).join('');

        const priceListHtml = (firm.priceList && firm.priceList.length > 0)
          ? `<div class="firm-pricelist">${firm.priceList.map(p => `<div class="price-row"><span>${p.item}</span><span>${p.price}</span></div>`).join('')}</div>`
          : '';

        const card = document.createElement('div');
        card.className = 'firm-card';
        card.innerHTML = `
          <div class="firm-info">
            <p class="firm-name">${firm.name}</p>
            <p class="firm-meta">${firm.district} · ${firm.dist.toFixed(1)} km</p>
            <div class="firm-social">${socialLinks}</div>
            ${priceListHtml}
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
