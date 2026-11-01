/* Evliliğe Evet - üyelik, ayarlar ve ortak yardımcılar */
(function(){
var A=window.AYAR||{},U=(A.SUPABASE_URL||"").replace(/\/$/,""),KEY=A.SUPABASE_KEY||"",SK="ee_oturum";
var E=window.EEU={},$$=function(q){return Array.prototype.slice.call(document.querySelectorAll(q))};
function ld(){try{return JSON.parse(localStorage.getItem(SK))}catch(e){return null}}
function sv(o){try{if(o)localStorage.setItem(SK,JSON.stringify(o));else localStorage.removeItem(SK)}catch(e){}}
function hdr(tok,ex){var h={apikey:KEY,"Content-Type":"application/json"};if(tok)h.Authorization="Bearer "+tok;else if(/^eyJ/.test(KEY))h.Authorization="Bearer "+KEY;if(ex)for(var k in ex)h[k]=ex[k];return h}
function sess(j){if(!j||!j.access_token){sv(null);return null}var u=j.user||{};var o={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Date.now()+((j.expires_in||3600)-60)*1000,user:{id:u.id,email:u.email,ad:(u.user_metadata||{}).ad||""}};sv(o);return o}
function msg(t){var m=t;try{var j=JSON.parse(t);m=j.message||j.msg||j.error_description||j.hint||t}catch(e){}
 m=String(m);
 if(/duplicate key|ee_siparis_tek_bekleyen/i.test(m))return"Zaten ödeme bekleyen bir siparişin var.";
 if(/row-level security|42501/i.test(m))return"Bu işlem için aktif Pro üyelik gerekir.";
 return"Hata: "+m.slice(0,160)}
E.ok=!!(U&&KEY);
E.oturum=ld;
E.tl=function(n){return Number(n||0).toLocaleString("tr-TR")+" ₺"};
E.giris=function(em,pw){return fetch(U+"/auth/v1/token?grant_type=password",{method:"POST",headers:hdr(),body:JSON.stringify({email:em,password:pw})}).then(function(r){return r.json().then(function(j){if(!r.ok||!j.access_token)throw new Error("E-posta ya da şifre hatalı.");return sess(j)})})};
E.kayit=function(em,pw,ad,tel){return fetch(U+"/auth/v1/signup",{method:"POST",headers:hdr(),body:JSON.stringify({email:em,password:pw,data:{ad:ad,telefon:tel}})}).then(function(r){return r.json().then(function(j){
 if(j.access_token)return sess(j);
 if(j.id||(j.user&&j.user.id)){throw new Error("Kaydın alındı. E-postana gelen bağlantıyla onayla, sonra giriş yap.")}
 var m=String(j.msg||j.message||j.error_description||"");
 if(/already/i.test(m))throw new Error("Bu e-posta zaten kayıtlı. Giriş yap.");
 if(/password/i.test(m))throw new Error("Şifre en az 6 karakter olmalı.");
 throw new Error("Kayıt yapılamadı. E-postayı kontrol edip tekrar dene.")})})};
E.cikis=function(){sv(null)};
function taze(){var o=ld();if(!o)return Promise.resolve(null);if(Date.now()<o.expires_at)return Promise.resolve(o);
 return fetch(U+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:hdr(),body:JSON.stringify({refresh_token:o.refresh_token})}).then(function(r){return r.json()}).then(sess).catch(function(){sv(null);return null})}
E.api=function(path,o){o=o||{};return taze().then(function(s){return fetch(U+path,{method:o.method||"GET",headers:hdr(s&&s.access_token,o.prefer?{Prefer:o.prefer}:null),body:o.body?JSON.stringify(o.body):undefined})}).then(function(r){
 if(r.status===401){sv(null);throw new Error("Oturum süresi doldu. Yeniden giriş yap.")}
 if(!r.ok)return r.text().then(function(t){throw new Error(msg(t))});
 return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})};
var _ay=null;
E.ayar=function(){if(_ay)return _ay;_ay=(U&&KEY?fetch(U+"/rest/v1/ee_ayar?select=*",{headers:hdr()}).then(function(r){return r.json()}).then(function(a){var o={};if(Array.isArray(a))a.forEach(function(x){o[x.anahtar]=x.deger});return o}):Promise.resolve({})).catch(function(){return{}});return _ay};
E.profil=function(){var o=ld();if(!o)return Promise.resolve(null);return E.api("/rest/v1/ee_profil?select=*&id=eq."+o.user.id).then(function(a){return a&&a[0]||null})};
E.proMu=function(p){if(!p||!p.pro_bitis)return false;var b=new Date(p.pro_bitis+"T23:59:59");return b>=new Date()};
E.tarih=function(d){return d?new Date(d+"T00:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}):""};
E.kod=function(id){return"EE-"+String(id||"").replace(/-/g,"").slice(0,6).toUpperCase()};
/* üst menüdeki Giriş / Hesabım bağlantısı */
$$("[data-hesap]").forEach(function(a){var o=ld();a.href=o?"hesabim.html":"giris.html";var b=a.querySelector("b");if(b)b.textContent=o?"Hesabım":"Giriş yap";var s=a.querySelector("small");if(s)s.textContent=o?"Ajandan ve paketin":"Üye ol ya da giriş yap"});
/* fiyat: yönetim panelindeki değer */
if($$("[data-fiyat]").length)E.ayar().then(function(a){if(a.pro_fiyat)$$("[data-fiyat]").forEach(function(e){e.textContent=E.tl(a.pro_fiyat)})});
})();
/* ödeme bilgisi kutusu (sepet ve hesabım sayfaları) */
(function(){
var E=window.EEU;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
E.odemeKutu=function(ay,s){
 var kod=E.kod(s.id),box=el("div","odk");
 var tb=el("table","odT");
 function satir(a,b,kopya){var tr=el("tr"),td1=el("td","sol",a),td2=el("td");var bb=el("b",null,b);td2.appendChild(bb);
  if(kopya){var k=el("button","btn sm o","Kopyala");k.type="button";k.style.marginLeft="10px";k.addEventListener("click",function(){try{navigator.clipboard.writeText(b.replace(/\s/g,""));k.textContent="Kopyalandı ✓"}catch(e){k.textContent="Kopyalanamadı"}});td2.appendChild(k)}
  tr.appendChild(td1);tr.appendChild(td2);tb.appendChild(tr)}
 satir("Tutar",E.tl(s.tutar));
 if(ay.iban){satir("Banka",ay.banka_adi||"-");satir("Hesap sahibi",ay.hesap_sahibi||"-");satir("IBAN",ay.iban,true);satir("Havale açıklaması",kod);
  box.appendChild(tb);var n=el("p","not2","Havale açıklamasına yukarıdaki kodu yaz. Ödeme hesabımıza ulaşınca Pro üyeliğin açılır (genellikle aynı gün).");box.appendChild(n)}
 else{satir("Sipariş kodu",kod);box.appendChild(tb);box.appendChild(el("p","not2","Ödeme bilgilerini almak için WhatsApp’tan bize yaz."))}
 if(ay.odeme_notu)box.appendChild(el("p","not2",ay.odeme_notu));
 if(ay.whatsapp){var a=el("a","btn o sm","WhatsApp’tan dekont gönder");a.target="_blank";a.rel="noopener";a.href="https://wa.me/"+String(ay.whatsapp).replace(/\D/g,"")+"?text="+encodeURIComponent("Merhaba, Evliliğe Evet Pro sipariş kodum "+kod+". Ödememi yaptım.");box.appendChild(a)}
 return box};
})();
