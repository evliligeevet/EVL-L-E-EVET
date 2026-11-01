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
  tok=x[1].access_token;$("pw").value="";$("girisK").style.display="none";$("panelK").style.display="block";yukle();bolum("uye")
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

/* ---- üyeler, siparişler, ödeme ayarları ---- */
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function tl(n){return Number(n||0).toLocaleString("tr-TR")+" ₺"}
function td(d){return d?new Date(d).toLocaleDateString("tr-TR"):"-"}
function kod(id){return"EE-"+String(id).replace(/-/g,"").slice(0,6).toUpperCase()}
function proMu(p){return p.pro_bitis&&new Date(p.pro_bitis+"T23:59:59")>=new Date()}
function rpc(f,b){return api("/rest/v1/rpc/"+f,{method:"POST",body:b})}
var secs={uye:$("s_uye"),sip:$("s_sip"),ay:$("s_ay"),liste:$("s_liste")},ayD={};
function bolum(b){Object.keys(secs).forEach(function(k){secs[k].hidden=k!==b});Array.prototype.forEach.call(document.querySelectorAll("#ust .tab"),function(x){x.classList.toggle("on",x.getAttribute("data-b")===b)});say("");
 if(b==="uye")uyeler();else if(b==="sip")siparisler();else if(b==="ay")ayarlar()}
Array.prototype.forEach.call(document.querySelectorAll("#ust .tab"),function(x){x.addEventListener("click",function(){bolum(x.getAttribute("data-b"))})});
function uyeler(){var s=secs.uye;s.innerHTML="Yükleniyor...";
 api("/rest/v1/ee_profil?select=*&order=created_at.desc").then(function(a){a=a||[];s.innerHTML="";
  var pr=a.filter(proMu).length,bx=el("div","box");bx.appendChild(el("h3",null,"Müşteriler"));bx.lastChild.style.fontSize="22px";
  bx.appendChild(el("p",null,"Toplam "+a.length+" üye, "+pr+" Pro üye."));
  var ara=el("input");ara.placeholder="Ad ya da e-posta ara";ara.style.margin="10px 0";bx.appendChild(ara);s.appendChild(bx);
  var lst=el("div");s.appendChild(lst);
  function ciz(){lst.innerHTML="";var q=ara.value.trim().toLowerCase();
   a.filter(function(p){return!q||((p.ad||"")+" "+(p.email||"")).toLowerCase().indexOf(q)>-1}).forEach(function(p){
    var r=el("div","row");r.style.gridTemplateColumns="1fr auto";var sol=el("div");sol.appendChild(el("b",null,p.ad||"-"));
    sol.appendChild(el("div",null,p.email+(p.telefon?" · "+p.telefon:"")));sol.lastChild.style.fontSize="14px";
    var d=el("div",null,"Kayıt: "+td(p.created_at)+" · "+(proMu(p)?"Pro, "+td(p.pro_bitis)+" tarihine kadar":"Ücretsiz"+(p.pro_bitis?" (Pro süresi "+td(p.pro_bitis)+" bitti)":"")));d.style.cssText="font-size:13px;color:"+(proMu(p)?"var(--ok)":"var(--mut)");sol.appendChild(d);r.appendChild(sol);
    var ac=el("div");ac.style.cssText="display:flex;gap:8px;flex-wrap:wrap;align-items:center";
    var b1=el("button","btn sm","+1 yıl Pro ver");b1.type="button";b1.addEventListener("click",function(){if(!confirm(p.email+" için 1 yıl Pro açılsın mı?"))return;rpc("ee_pro_ver",{p_email:p.email,p_yil:1}).then(function(){say("Pro açıldı ✓");uyeler()}).catch(function(e){say(e.message,1)})});ac.appendChild(b1);
    if(proMu(p)){var b2=el("button","btn sm del","Pro kaldır");b2.type="button";b2.addEventListener("click",function(){if(!confirm("Pro kaldırılsın mı?"))return;rpc("ee_pro_ver",{p_email:p.email,p_yil:0}).then(function(){say("Pro kaldırıldı.");uyeler()}).catch(function(e){say(e.message,1)})});ac.appendChild(b2)}
    r.appendChild(ac);lst.appendChild(r)});
   if(!lst.children.length)lst.appendChild(el("p",null,"Üye bulunamadı."))}
  ara.addEventListener("input",ciz);ciz()}).catch(function(e){s.textContent="";say(e.message,1)})}
function siparisler(){var s=secs.sip;s.innerHTML="Yükleniyor...";
 api("/rest/v1/ee_siparis?select=*&order=created_at.desc").then(function(a){a=a||[];s.innerHTML="";
  var bk=a.filter(function(x){return x.durum==="beklemede"}).length;var bx=el("div","box");bx.appendChild(el("h3",null,"Siparişler"));bx.lastChild.style.fontSize="22px";bx.appendChild(el("p",null,a.length+" sipariş, "+bk+" ödeme bekliyor. Ödeme hesabınıza ulaşınca “Ödeme geldi” düğmesine basın, Pro otomatik açılır."));s.appendChild(bx);
  if(!a.length)s.appendChild(el("p",null,"Henüz sipariş yok."));
  a.forEach(function(x){var r=el("div","row");r.style.gridTemplateColumns="1fr auto";var sol=el("div");sol.appendChild(el("b",null,kod(x.id)+" · "+tl(x.tutar)));
   sol.appendChild(el("div",null,(x.ad||"-")+" · "+x.eposta+(x.telefon?" · "+x.telefon:"")));sol.lastChild.style.fontSize="14px";
   var d={beklemede:"Ödeme bekleniyor",odendi:"Ödendi",iptal:"İptal"}[x.durum];var dd=el("div",null,td(x.created_at)+" · "+d);dd.style.cssText="font-size:13px;color:"+(x.durum==="odendi"?"var(--ok)":x.durum==="iptal"?"#B3122B":"var(--deep)");sol.appendChild(dd);r.appendChild(sol);
   if(x.durum==="beklemede"){var ac=el("div");ac.style.cssText="display:flex;gap:8px;flex-wrap:wrap";
    var ok=el("button","btn sm","Ödeme geldi, Pro aç");ok.type="button";ok.addEventListener("click",function(){if(!confirm(x.eposta+" için ödeme geldi, 1 yıl Pro açılsın mı?"))return;rpc("ee_siparis_karar",{p_id:x.id,p_onay:true}).then(function(){say("Pro açıldı ✓");siparisler()}).catch(function(e){say(e.message,1)})});
    var iv=el("button","btn sm del","İptal");iv.type="button";iv.addEventListener("click",function(){if(!confirm("Sipariş iptal edilsin mi?"))return;rpc("ee_siparis_karar",{p_id:x.id,p_onay:false}).then(function(){say("İptal edildi.");siparisler()}).catch(function(e){say(e.message,1)})});
    ac.appendChild(ok);ac.appendChild(iv);r.appendChild(ac)}
   s.appendChild(r)})}).catch(function(e){s.textContent="";say(e.message,1)})}
var AYF=[["pro_fiyat","Pro yıllık fiyat (sadece rakam, TL)"],["banka_adi","Banka adı"],["hesap_sahibi","Hesap sahibi (ünvan)"],["iban","IBAN"],["odeme_notu","Ödeme notu (isteğe bağlı)"],["whatsapp","WhatsApp (905331509890 biçiminde)"],["sirket_adres","Şirket adresi (sözleşmede görünür)"],["sirket_vd","Vergi dairesi"],["sirket_vkn","Vergi kimlik no"],["kdv_notu","KDV notu"]];
function ayarlar(){var s=secs.ay;s.innerHTML="Yükleniyor...";
 api("/rest/v1/ee_ayar?select=*").then(function(a){ayD={};(a||[]).forEach(function(x){ayD[x.anahtar]=x.deger});s.innerHTML="";
  var bx=el("div","box");bx.appendChild(el("h3",null,"Ödeme ayarları"));bx.lastChild.style.fontSize="22px";
  bx.appendChild(el("p",null,"Müşteri sepette bu bilgileri görür ve havale yapar. IBAN boş bırakılırsa “WhatsApp’tan yazın” çıkar."));
  var fm=el("div","fm");fm.style.marginTop="14px";var inp={};
  AYF.forEach(function(f){var d=el("div","f"+(f[0]==="hesap_sahibi"||f[0]==="sirket_adres"||f[0]==="odeme_notu"?" w":""));var l=el("label",null,f[1]);var i=el("input");i.value=ayD[f[0]]||"";d.appendChild(l);d.appendChild(i);fm.appendChild(d);inp[f[0]]=i});
  bx.appendChild(fm);var kb=el("button","btn","Kaydet");kb.type="button";kb.style.marginTop="16px";bx.appendChild(kb);
  kb.addEventListener("click",function(){var f=inp.pro_fiyat.value.replace(/[^\d]/g,"");if(!f){say("Fiyat yazın.",1);return}inp.pro_fiyat.value=f;
   var rows=AYF.map(function(x){return{anahtar:x[0],deger:inp[x[0]].value.trim()}});
   api("/rest/v1/ee_ayar?on_conflict=anahtar",{method:"POST",body:rows,prefer:"resolution=merge-duplicates,return=minimal"}).then(function(){say("Kaydedildi ✓")}).catch(function(e){say(e.message,1)})});
  s.appendChild(bx)}).catch(function(e){s.textContent="";say(e.message,1)})}
})();
