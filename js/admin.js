(function(){
var A=window.AYAR||{},U=(A.SUPABASE_URL||"").replace(/\/$/,""),KEY=A.SUPABASE_KEY||"";
var $=function(i){return document.getElementById(i)},tok=null,kat=[],mad=[],cur=null;
function say(t,e){var m=$("msg");m.textContent=t||"";m.className="msg"+(e?" err":"")}
function api(path,o){o=o||{};var h={apikey:KEY,"Content-Type":"application/json"};if(tok)h.Authorization="Bearer "+tok;else if(/^eyJ/.test(KEY))h.Authorization="Bearer "+KEY;
 if(o.prefer)h.Prefer=o.prefer;
 return fetch(U+path,{method:o.method||"GET",headers:h,body:o.body?JSON.stringify(o.body):undefined}).then(function(r){
  if(r.status===401||r.status===403){throw new Error("Oturum süresi doldu ya da yetkiniz yok. Çıkıp tekrar giriş yapın.")}
  if(!r.ok)return r.text().then(function(t){throw new Error("Hata: "+t.slice(0,160))});
  return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})})}
if(!U||!KEY){$("gmsg").textContent="Supabase ayarı yok. js/config.js dosyasına proje adresi ve anahtarı yazın.";$("giris").disabled=true}
$("goz").addEventListener("click",function(){var p=$("pw"),g=p.type==="password";p.type=g?"text":"password";this.textContent=g?"Gizle":"Göster"});
$("giris").addEventListener("click",function(){
 $("gmsg").textContent="";
 fetch(U+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({email:$("em").value.trim(),password:$("pw").value})})
 .then(function(r){return r.json().then(function(j){return[r.ok,j]})}).then(function(x){
  if(!x[0]||!x[1].access_token){$("gmsg").textContent="Giriş başarısız. E-posta ya da şifre hatalı.";return}
  tok=x[1].access_token;$("pw").value="";$("girisK").style.display="none";$("panelK").style.display="block";yukle()
 }).catch(function(){$("gmsg").textContent="Sunucuya ulaşılamadı."})});
$("cikis").addEventListener("click",function(){tok=null;kat=[];mad=[];$("panelK").style.display="none";$("girisK").style.display="block"});
function yukle(){
 return Promise.all([api("/rest/v1/ee_kategori?select=*&order=sira"),api("/rest/v1/ee_madde?select=*&order=sira")]).then(function(r){
  kat=r[0]||[];mad=r[1]||[];if(!cur||!kat.some(function(k){return k.id===cur}))cur=kat.length?kat[0].id:null;ciz()}).catch(function(e){say(e.message,1)})}
function ciz(){
 var kt=$("kt");kt.innerHTML="";
 kat.forEach(function(k){var b=document.createElement("button");b.className="tab"+(k.id===cur?" on":"");b.textContent=k.ad+(k.tur==="rehber"?" (rehber)":"");b.addEventListener("click",function(){cur=k.id;ciz()});kt.appendChild(b)});
 var kk=kat.filter(function(k){return k.id===cur})[0],rh=kk&&kk.tur==="rehber";
 $("nhw").style.display=rh?"none":"block";
 var s=$("satir");s.innerHTML="";
 mad.filter(function(m){return m.kategori_id===cur}).forEach(function(m){
  var r=document.createElement("div");r.className="row"+(m.aktif?"":" off");
  r.innerHTML='<div><label>Başlık</label><input class="b"></div><div'+(rh?' style="display:none"':'')+'><label>Hafta</label><input class="h" type="number"></div><div><label>Sıra</label><input class="o" type="number"></div><div class="w"><label>Açıklama</label><textarea class="a"></textarea></div><div class="acts"><label style="display:flex;gap:6px;align-items:center;margin:0"><input class="ak" type="checkbox" style="width:auto"> Sitede göster</label><button class="btn sm kay" type="button">Kaydet</button><button class="btn sm del sil" type="button">Sil</button></div>';
  r.querySelector(".b").value=m.baslik;r.querySelector(".h").value=m.hafta==null?"":m.hafta;r.querySelector(".o").value=m.sira;r.querySelector(".a").value=m.aciklama||"";r.querySelector(".ak").checked=!!m.aktif;
  r.querySelector(".kay").addEventListener("click",function(){
   var h=r.querySelector(".h").value;
   var g={baslik:r.querySelector(".b").value.trim(),aciklama:r.querySelector(".a").value.trim(),hafta:rh||h===""?null:parseInt(h,10),sira:parseInt(r.querySelector(".o").value||"0",10),aktif:r.querySelector(".ak").checked};
   if(!g.baslik){say("Başlık boş olamaz.",1);return}
   api("/rest/v1/ee_madde?id=eq."+encodeURIComponent(m.id),{method:"PATCH",body:g,prefer:"return=minimal"}).then(function(){say("Kaydedildi ✓");return yukle()}).catch(function(e){say(e.message,1)})});
  r.querySelector(".sil").addEventListener("click",function(){
   if(!confirm("Bu madde silinsin mi? (Silmek yerine 'Sitede göster' kutusunu kapatabilirsiniz.)"))return;
   api("/rest/v1/ee_madde?id=eq."+encodeURIComponent(m.id),{method:"DELETE",prefer:"return=minimal"}).then(function(){say("Silindi.");return yukle()}).catch(function(e){say(e.message,1)})});
  s.appendChild(r)});
 if(!s.children.length)s.innerHTML='<p style="color:var(--mut)">Bu kategoride madde yok.</p>'}
$("ekle").addEventListener("click",function(){
 if(!cur){say("Önce bir kategori ekleyin.",1);return}
 var b=$("nb").value.trim();if(!b){say("Başlık yazın.",1);return}
 var kk=kat.filter(function(k){return k.id===cur})[0],rh=kk&&kk.tur==="rehber",h=$("nh").value;
 var g={id:"m"+Date.now(),kategori_id:cur,baslik:b,aciklama:$("na").value.trim(),hafta:rh||h===""?null:parseInt(h,10),sira:parseInt($("ns").value||"100",10),aktif:true};
 api("/rest/v1/ee_madde",{method:"POST",body:g,prefer:"return=minimal"}).then(function(){$("nb").value="";$("na").value="";say("Eklendi ✓");return yukle()}).catch(function(e){say(e.message,1)})});
$("kekle").addEventListener("click",function(){
 var ad=$("kad").value.trim();if(!ad){say("Kategori adı yazın.",1);return}
 var id=ad.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||("k"+Date.now());
 api("/rest/v1/ee_kategori",{method:"POST",body:{id:id,ad:ad,tur:$("ktur").value,sira:parseInt($("ksira").value||"50",10)},prefer:"return=minimal"}).then(function(){$("kad").value="";cur=id;say("Kategori eklendi ✓");return yukle()}).catch(function(e){say(e.message,1)})});
$("ksil").addEventListener("click",function(){
 if(!cur)return;
 if(mad.some(function(m){return m.kategori_id===cur})){say("Önce kategorideki maddeleri silin ya da gizleyin.",1);return}
 if(!confirm("Seçili kategori silinsin mi?"))return;
 api("/rest/v1/ee_kategori?id=eq."+encodeURIComponent(cur),{method:"DELETE",prefer:"return=minimal"}).then(function(){cur=null;say("Kategori silindi.");return yukle()}).catch(function(e){say(e.message,1)})});
})();
