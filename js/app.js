// ============================================================================
// Evliliğe Evet — Eşleştirme Motoru
// ============================================================================

const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('results');
const resultsList = document.getElementById('resultsList');
const resultsTitle = document.getElementById('resultsTitle');

function buildMessage(firm, selectedCats, district, date, budget) {
  const catNames = { gelinlik: "Gelinlik", makyaj: "Makyaj" };
  const catText = selectedCats.map(c => catNames[c] || c).join(" ve ");

  let msg = `Merhaba, ${catText} hizmeti için bilgi almak istiyorum.`;
  if (district) msg += ` (${district})`;
  if (date) msg += ` Düğün tarihim: ${date}.`;
  if (budget) msg += ` Bütçem: ${budget}.`;

  return encodeURIComponent(msg);
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

searchBtn.addEventListener('click', () => {
  const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked'))
    .map(el => el.value);
  const district = document.getElementById('district').value;
  const dateRaw = document.getElementById('weddingDate').value;
  const date = formatDate(dateRaw);
  const budget = document.getElementById('budget').value.trim();

  if (selectedCats.length === 0) {
    alert("Lütfen en az bir hizmet seçin.");
    return;
  }

  // Kategoriye uyan firmalar
  let matches = FIRMS.filter(f =>
    f.categories.some(c => selectedCats.includes(c))
  );

  // İlçesi tutanları öne al
  if (district) {
    matches.sort((a, b) => {
      const aMatch = a.district === district ? 0 : 1;
      const bMatch = b.district === district ? 0 : 1;
      return aMatch - bMatch;
    });
  }

  resultsList.innerHTML = "";

  if (matches.length === 0) {
    resultsTitle.textContent = "Sonuç bulunamadı";
    resultsList.innerHTML = `<div class="empty-state">Bu kriterlere uygun firma henüz sistemde yok. Yakında eklenecek.</div>`;
  } else {
    resultsTitle.textContent = `${matches.length} firma bulundu`;
    matches.forEach(firm => {
      const isNear = district && firm.district === district;
      const waMsg = buildMessage(firm, selectedCats, district, date, budget);
      const card = document.createElement('div');
      card.className = 'firm-card';
      card.innerHTML = `
        <div class="firm-info">
          <p class="firm-name">${firm.name}</p>
          <p class="firm-meta">${firm.district}${isNear ? ' · Size yakın' : ''} · ${firm.categories.map(c => c === 'gelinlik' ? 'Gelinlik' : 'Makyaj').join(', ')}</p>
        </div>
        <a class="firm-whatsapp" href="https://wa.me/${firm.whatsapp}?text=${waMsg}" target="_blank">WhatsApp'tan Ulaş</a>
      `;
      resultsList.appendChild(card);
    });
  }

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
});
