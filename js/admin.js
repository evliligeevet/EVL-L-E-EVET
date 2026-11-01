(function(){
var A=window.AYAR||{},U=(A.SUPABASE_URL||"").replace(/\/$/,""),KEY=A.SUPABASE_KEY||"";
var $=function(i){return document.getElementById(i)},tok=null,kat=[],mad=[],cur=null;
function toast(t,e){var x=$("toast");if(!x){x=document.createElement("div");x.id="toast";x.className="toast";x.setAttribute("role","status");document.body.appendChild(x)}
 x.textContent=t;x.classList.toggle("err",!!e);x.classList.add("on");clearTimeout(x._t);x._t=setTimeout(function(){x.classList.remove("on")},e?4200:2400)}
function flash(b,t){if(!b)return;var o=b._ot||b.textContent;b._ot=o;b.textContent=t||"Kaydedildi ✓";b.classList.add("ok");clearTimeout(b._t);b._t=setTimeout(function(){b.textContent=o;b.classList.remove("ok")},2000)}
function say(t,e){var m=$("msg");m.textContent=t||"";m.className="msg"+(e?" err":"");if(t)toast(t,e)}
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
  tok=x[1].access_token;$("pw").value="";$("girisK").style.display="none";$("panelK").style.display="block";yukle();bolum("oz")
 }).catch(function(){$("gmsg").textContent="Sunucuya ulaşılamadı."})});
$("cikis").addEventListener("click",function(){tok=null;CH=null;kat=[];mad=[];$("panelK").style.display="none";$("girisK").style.display="block"});
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
  r.innerHTML='<div><label>Başlık</label><input class="b"></div><div'+(rh?' style="display:none"':'')+'><label>Düğünden kaç hafta önce?</label><input class="h" type="number"></div><div><label>Listedeki sırası</label><input class="o" type="number"></div><div class="w"><label>Açıklama</label><textarea class="a"></textarea></div><div class="acts"><label style="display:flex;gap:6px;align-items:center;margin:0"><input class="ak" type="checkbox" style="width:auto"> Sitede göster</label><button class="btn sm kay" type="button">Kaydet</button><button class="btn sm del sil" type="button">Sil</button></div>';
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
var secs={oz:$("s_oz"),uye:$("s_uye"),sip:$("s_sip"),tk:$("s_tk"),ay:$("s_ay"),liste:$("s_liste")},ayD={},CH=null,tkY=new Date().getFullYear(),tkM=new Date().getMonth(),tkS=null;
function bolum(b){Object.keys(secs).forEach(function(k){secs[k].hidden=k!==b});Array.prototype.forEach.call(document.querySelectorAll("#ust .tab"),function(x){x.classList.toggle("on",x.getAttribute("data-b")===b)});say("");
 if(b==="oz")ozet();else if(b==="uye")uyeler();else if(b==="sip")siparisler();else if(b==="tk")takvimA();else if(b==="ay")ayarlar()}
Array.prototype.forEach.call(document.querySelectorAll("#ust .tab"),function(x){x.addEventListener("click",function(){bolum(x.getAttribute("data-b"))})});

function ym(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
function gun0(s){if(!s)return"";s=String(s);if(s.length<=10)return s;var d=new Date(s);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function bugunS(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function farkG(s){var a=new Date();a.setHours(0,0,0,0);return Math.round((new Date(s+"T00:00:00")-a)/864e5)}
function veri(){return Promise.all([api("/rest/v1/ee_profil?select=*&order=created_at.desc"),api("/rest/v1/ee_siparis?select=*&order=created_at.desc")]).then(function(r){CH={p:r[0]||[],s:r[1]||[]};return CH})}
function odenenler(){return CH.s.filter(function(x){return x.durum==="odendi"})}
function ciroGrafik(s,od){
  var b2=el("div","box");b2.appendChild(el("h3",null,"Aylık ciro (son 12 ay)"));b2.lastChild.style.fontSize="20px";
  var ay=[],mx=1,n=new Date();for(var i=11;i>=0;i--){var d=new Date(n.getFullYear(),n.getMonth()-i,1);var k=ym(d),t=0;od.forEach(function(x){if(ym(new Date(x.islem_tarihi||x.created_at))===k)t+=Number(x.tutar||0)});ay.push([d.toLocaleDateString("tr-TR",{month:"short"}),t]);if(t>mx)mx=t}
  var br=el("div","bars");ay.forEach(function(a){var c=el("div");c.appendChild(el("span",null,a[1]?String(a[1]):""));var i=el("i");i.style.height=Math.round(a[1]*100/mx)+"%";i.title=a[0]+": "+tl(a[1]);c.appendChild(i);c.appendChild(el("span",null,a[0]));br.appendChild(c)});b2.appendChild(br);s.appendChild(b2);}
function ozet(){var s=secs.oz;s.innerHTML="Yükleniyor...";
 veri().then(function(){s.innerHTML="";var P=CH.p,S=CH.s,od=odenenler(),bu=ym(new Date()),top=0,buay=0;
  od.forEach(function(x){var t=Number(x.tutar||0);top+=t;if(ym(new Date(x.islem_tarihi||x.created_at))===bu)buay+=t});
  var bek=S.filter(function(x){return x.durum==="beklemede"}),bekT=bek.reduce(function(a,x){return a+Number(x.tutar||0)},0);
  var aktif=P.filter(proMu),yakin=aktif.filter(function(p){return farkG(p.pro_bitis)<=30}).sort(function(a,b){return a.pro_bitis<b.pro_bitis?-1:1});
  var yeni=P.filter(function(p){return ym(new Date(p.created_at))===bu}).length;
  var bx=el("div","box");bx.appendChild(el("h3",null,"Genel bakış"));bx.lastChild.style.fontSize="22px";
  var kp=el("div","kpi");
  [["Toplam üye",P.length],["Aktif Pro",aktif.length],["Bu ay yeni üye",yeni],["Bu ay ciro",tl(buay)],["Bekleyen ödeme",bek.length+" · "+tl(bekT)],["30 gün içinde biten Pro",yakin.length]].forEach(function(k){var d=el("div");d.appendChild(el("small",null,k[0]));d.appendChild(el("b",null,String(k[1])));kp.appendChild(d)});
  bx.appendChild(kp);
  s.appendChild(bx);

  var b3=el("div","box");b3.appendChild(el("h3",null,"Üyeliği yakında bitenler (30 gün)"));b3.lastChild.style.fontSize="20px";
  if(!yakin.length)b3.appendChild(el("p",null,"Yakın zamanda bitecek Pro üyelik yok."));
  yakin.forEach(function(p){var r=el("div",null,p.email+" · "+td(p.pro_bitis)+" ("+farkG(p.pro_bitis)+" gün kaldı)");r.style.cssText="padding:7px 0;border-top:1px solid var(--line);font-size:15px";b3.appendChild(r)});s.appendChild(b3);
  var b4=el("div","box");b4.appendChild(el("h3",null,"Son ödemeler"));b4.lastChild.style.fontSize="20px";
  if(!od.length)b4.appendChild(el("p",null,"Henüz onaylanmış ödeme yok."));
  od.slice().sort(function(a,b){return new Date(b.islem_tarihi||b.created_at)-new Date(a.islem_tarihi||a.created_at)}).slice(0,6).forEach(function(x){var r=el("div",null,td(x.islem_tarihi||x.created_at)+" · "+(x.ad||x.eposta)+" · "+tl(x.tutar));r.style.cssText="padding:7px 0;border-top:1px solid var(--line);font-size:15px";b4.appendChild(r)});s.appendChild(b4)}).catch(function(e){s.textContent="";say(e.message,1)})}
function takvimA(){var s=secs.tk;s.innerHTML="Yükleniyor...";
 veri().then(function(){s.innerHTML="";var by={};
  function ek(t,tip,m){if(!t)return;(by[t]=by[t]||[]).push({tip:tip,m:m})}
  CH.p.forEach(function(p){ek(gun0(p.created_at),"k",(p.ad||p.email)+" üye oldu");if(p.pro_bitis)ek(p.pro_bitis,"b",(p.ad||p.email)+" Pro bitişi")});
  odenenler().forEach(function(x){ek(gun0(x.islem_tarihi||x.created_at),"o",(x.ad||x.eposta)+" ödeme "+tl(x.tutar))});
  var kt=el("div","kt"),bs=el("div","bs"),on=el("button",null,"‹"),sn=el("button",null,"›"),bb=el("b",null,new Date(tkY,tkM,1).toLocaleDateString("tr-TR",{month:"long",year:"numeric"}));
  on.type=sn.type="button";bs.appendChild(on);bs.appendChild(bb);bs.appendChild(sn);kt.appendChild(bs);
  on.addEventListener("click",function(){tkM--;if(tkM<0){tkM=11;tkY--}takvimA()});sn.addEventListener("click",function(){tkM++;if(tkM>11){tkM=0;tkY++}takvimA()});
  var lg=el("div","ykt");lg.innerHTML="<span><s></s>Yeni üye</span><span><s class=\"g\"></s>Ödeme geldi</span><span><s class=\"o\"></s>Pro bitişi</span>";kt.appendChild(lg);
  var g=el("div","kg7");["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].forEach(function(h){g.appendChild(el("div","hd",h))});
  var ilk=new Date(tkY,tkM,1),bos=(ilk.getDay()+6)%7,son=new Date(tkY,tkM+1,0).getDate();
  for(var i=0;i<bos;i++)g.appendChild(el("div","gn bos"));
  var lst=el("div","box");
  function liste(){lst.innerHTML="";if(!tkS){lst.appendChild(el("p",null,"Bir güne dokunun, o günün hareketleri burada görünür."));return}
   lst.appendChild(el("h3",null,new Date(tkS+"T00:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"})));lst.lastChild.style.fontSize="20px";
   var L=by[tkS]||[];if(!L.length)lst.appendChild(el("p",null,"Bu gün hareket yok."));
   L.forEach(function(x){var r=el("div",null,({k:"Yeni üye",o:"Ödeme",b:"Pro bitiyor"})[x.tip]+": "+x.m);r.style.cssText="padding:7px 0;border-top:1px solid var(--line);font-size:15px";lst.appendChild(r)})}
  for(var d=1;d<=son;d++){(function(d){var t=tkY+"-"+String(tkM+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"),L=by[t]||[],c=el("button","gn"+(t===bugunS()?" bg":"")+(t===tkS?" sec":""));c.type="button";c.appendChild(el("span",null,String(d)));
   if(L.length){var nk=el("div","nk");L.slice(0,5).forEach(function(x){nk.appendChild(el("s",x.tip==="o"?"g":x.tip==="b"?"o":""))});c.appendChild(nk);var top=0;L.forEach(function(x){if(x.tip==="o"){var m=/(\d[\d.]*) ₺/.exec(x.m);if(m)top+=Number(m[1].replace(/\./g,""))}});if(top)c.appendChild(el("span","sy",tl(top)))}
   c.addEventListener("click",function(){tkS=t;takvimA()});g.appendChild(c)})(d)}
  kt.appendChild(g);s.appendChild(kt);liste();s.appendChild(lst)}).catch(function(e){s.textContent="";say(e.message,1)})}
function uyeler(){var s=secs.uye;s.innerHTML="Yükleniyor...";
 veri().then(function(){var a=CH.p;s.innerHTML="";
  var pr=a.filter(proMu).length,bx=el("div","box");bx.appendChild(el("h3",null,"Müşteriler"));bx.lastChild.style.fontSize="22px";
  bx.appendChild(el("p",null,"Toplam "+a.length+" üye, "+pr+" Pro üye."));
  var ara=el("input");ara.placeholder="Ad ya da e-posta ara";ara.style.margin="10px 0";bx.appendChild(ara);s.appendChild(bx);
  var lst=el("div");s.appendChild(lst);
  function ciz(){lst.innerHTML="";var q=ara.value.trim().toLowerCase();
   a.filter(function(p){return!q||((p.ad||"")+" "+(p.email||"")).toLowerCase().indexOf(q)>-1}).forEach(function(p){
    var r=el("div","row");r.style.gridTemplateColumns="1fr auto";var sol=el("div");sol.appendChild(el("b",null,p.ad||"-"));
    sol.appendChild(el("div",null,p.email+(p.telefon?" · "+p.telefon:"")));sol.lastChild.style.fontSize="14px";
    var os=odenenler().filter(function(x){return x.user_id===p.id}).sort(function(x,y){return new Date(y.islem_tarihi||y.created_at)-new Date(x.islem_tarihi||x.created_at)}),od=os[0],tp=os.reduce(function(t,x){return t+Number(x.tutar||0)},0);
    var d=el("div",null,"Kayıt: "+td(p.created_at)+" · "+(proMu(p)?"Pro: "+(od?td(od.islem_tarihi||od.created_at):"elle verildi")+" → "+td(p.pro_bitis)+" ("+farkG(p.pro_bitis)+" gün kaldı)":"Ücretsiz"+(p.pro_bitis?" (Pro süresi "+td(p.pro_bitis)+" bitti)":""))+(tp?" · Ödediği: "+tl(tp):""));d.style.cssText="font-size:13px;color:"+(proMu(p)?"var(--ok)":"var(--mut)");sol.appendChild(d);r.appendChild(sol);
    var ac=el("div");ac.style.cssText="display:flex;gap:8px;flex-wrap:wrap;align-items:center";
    var b1=el("button","btn sm","+1 yıl Pro ver");b1.type="button";b1.addEventListener("click",function(){if(!confirm(p.email+" için 1 yıl Pro açılsın mı?"))return;rpc("ee_pro_ver",{p_email:p.email,p_yil:1}).then(function(){say("Pro açıldı ✓");uyeler()}).catch(function(e){say(e.message,1)})});ac.appendChild(b1);
    if(proMu(p)){var b2=el("button","btn sm del","Pro kaldır");b2.type="button";b2.addEventListener("click",function(){if(!confirm("Pro kaldırılsın mı?"))return;rpc("ee_pro_ver",{p_email:p.email,p_yil:0}).then(function(){say("Pro kaldırıldı.");uyeler()}).catch(function(e){say(e.message,1)})});ac.appendChild(b2)}
    var b3=el("button","btn sm o","Hatırlatıcıları gör");b3.type="button";ac.appendChild(b3);r.appendChild(ac);
    var dt=el("div");dt.style.cssText="grid-column:1/-1;display:none;border-top:1px solid var(--line);padding-top:10px;font-size:14.5px";r.appendChild(dt);var ac2=false;
    b3.addEventListener("click",function(){if(ac2){ac2=false;dt.style.display="none";b3.textContent="Hatırlatıcıları gör";return}
     ac2=true;dt.style.display="block";b3.textContent="Gizle";dt.textContent="Yükleniyor...";
     rpc("ee_admin_ajanda",{p_user:p.id}).then(function(L){dt.innerHTML="";L=L||[];
      if(!L.length){dt.textContent=proMu(p)?"Bu üye henüz hatırlatıcı eklememiş.":"Ücretsiz üye, ajanda kullanamaz.";return}
      var n=L.filter(function(x){return!x.tamam}).length;dt.appendChild(el("p",null,L.length+" kayıt, "+n+" tamamlanmamış. Not içerikleri gizlidir, yalnızca başlık ve tarih görünür.")).style.cssText="color:var(--mut);margin:0 0 6px";
      L.forEach(function(x){var q=el("div",null,td(x.tarih)+(x.saat?" "+String(x.saat).slice(0,5):"")+" · "+x.baslik+" · "+(x.tamam?"tamamlandı":(x.hatirlat_acik===false?"hatırlatma kapalı":"hatırlatma açık")));q.style.cssText="padding:5px 0;border-top:1px solid var(--line)";dt.appendChild(q)})}).catch(function(e){dt.textContent="";say(e.message,1)})});
    lst.appendChild(r)});
   if(!lst.children.length)lst.appendChild(el("p",null,"Üye bulunamadı."))}
  ara.addEventListener("input",ciz);ciz()}).catch(function(e){s.textContent="";say(e.message,1)})}
function siparisler(){var s=secs.sip;s.innerHTML="Yükleniyor...";
 veri().then(function(){var a=CH.s;s.innerHTML="";
  var od=odenenler(),bu=ym(new Date()),top=0,buay=0;od.forEach(function(x){var t=Number(x.tutar||0);top+=t;if(ym(new Date(x.islem_tarihi||x.created_at))===bu)buay+=t});
  var bek=a.filter(function(x){return x.durum==="beklemede"}),bekT=bek.reduce(function(t,x){return t+Number(x.tutar||0)},0);
  var bx=el("div","box");bx.appendChild(el("h3",null,"Ödemeler"));bx.lastChild.style.fontSize="22px";
  var kp=el("div","kpi");[["Bekleyen ödeme",bek.length+" · "+tl(bekT)],["Bu ay gelen",tl(buay)],["Toplam gelen",tl(top)]].forEach(function(k){var d=el("div");d.appendChild(el("small",null,k[0]));d.appendChild(el("b",null,k[1]));kp.appendChild(d)});bx.appendChild(kp);
  bx.appendChild(el("p",null,"Para hesabınıza ulaşınca “Ödeme geldi” düğmesine basın, üyenin Pro’su kendiliğinden açılır."));bx.lastChild.style.cssText="font-size:14px;color:var(--mut)";s.appendChild(bx);
  ciroGrafik(s,od);
  var fl=el("div","tabs");fl.style.margin="18px 0 10px";var mod="bek";
  var lst=el("div");
  function ciz(){lst.innerHTML="";Array.prototype.forEach.call(fl.children,function(b){b.classList.toggle("on",b.getAttribute("data-m")===mod)});
   var L=a.filter(function(x){return mod==="hepsi"||x.durum==="beklemede"});
   if(!L.length)lst.appendChild(el("p",null,mod==="hepsi"?"Henüz sipariş yok.":"Bekleyen ödeme yok."));
   L.forEach(function(x){var r=el("div","row");r.style.gridTemplateColumns="1fr auto";var sol=el("div");sol.appendChild(el("b",null,kod(x.id)+" · "+tl(x.tutar)));
    sol.appendChild(el("div",null,(x.ad||"-")+" · "+x.eposta+(x.telefon?" · "+x.telefon:"")));sol.lastChild.style.fontSize="14px";
    var d={beklemede:"Ödeme bekleniyor",odendi:"Ödendi",iptal:"İptal"}[x.durum];var dd=el("div",null,td(x.created_at)+" · "+d);dd.style.cssText="font-size:13px;color:"+(x.durum==="odendi"?"var(--ok)":x.durum==="iptal"?"#B3122B":"var(--deep)");sol.appendChild(dd);r.appendChild(sol);
    if(x.durum==="beklemede"){var ac=el("div");ac.style.cssText="display:flex;gap:8px;flex-wrap:wrap";
     var ok=el("button","btn sm","Ödeme geldi, Pro aç");ok.type="button";ok.addEventListener("click",function(){if(!confirm(x.eposta+" için ödeme geldi, 1 yıl Pro açılsın mı?"))return;rpc("ee_siparis_karar",{p_id:x.id,p_onay:true}).then(function(){say("Pro açıldı ✓");siparisler()}).catch(function(e){say(e.message,1)})});
     var iv=el("button","btn sm del","İptal");iv.type="button";iv.addEventListener("click",function(){if(!confirm("Sipariş iptal edilsin mi?"))return;rpc("ee_siparis_karar",{p_id:x.id,p_onay:false}).then(function(){say("İptal edildi.");siparisler()}).catch(function(e){say(e.message,1)})});
     ac.appendChild(ok);ac.appendChild(iv);r.appendChild(ac)}
    lst.appendChild(r)})}
  [["bek","Bekleyenler"],["hepsi","Tüm siparişler"]].forEach(function(m){var b=el("button","tab",m[1]);b.type="button";b.setAttribute("data-m",m[0]);b.addEventListener("click",function(){mod=m[0];ciz()});fl.appendChild(b)});
  s.appendChild(fl);s.appendChild(lst);ciz()}).catch(function(e){s.textContent="";say(e.message,1)})}
var AYG=[["Pro fiyatı","Yeni siparişlere uygulanır. Eski siparişler eski tutarıyla kalır.",[["pro_fiyat","Pro yıllık fiyat (sadece rakam, TL)"]]],
 ["Ödeme bilgileri","Müşteri sepette bunları görür ve havale yapar. IBAN boşsa “WhatsApp’tan yazın” çıkar.",[["banka_adi","Banka adı"],["hesap_sahibi","Hesap sahibi (ünvan)"],["iban","IBAN"],["odeme_notu","Ödeme notu (isteğe bağlı)"],["whatsapp","WhatsApp (905331509890 biçiminde)"]]],
 ["Şirket bilgileri","Satış sözleşmesinde görünür.",[["sirket_adres","Şirket adresi"],["sirket_vd","Vergi dairesi"],["sirket_vkn","Vergi kimlik no"],["kdv_notu","KDV notu"]]],
 ["Gelişmiş","E-posta hatırlatması kurulana kadar dokunmayın.",[["eposta_acik","E-posta hatırlatma (evet / hayir)"]]]];
var AYF=[];AYG.forEach(function(g){g[2].forEach(function(f){AYF.push(f)})});
function ayarlar(){var s=secs.ay;s.innerHTML="Yükleniyor...";
 api("/rest/v1/ee_ayar?select=*").then(function(a){ayD={};(a||[]).forEach(function(x){ayD[x.anahtar]=x.deger});s.innerHTML="";var inp={};
  AYG.forEach(function(g){var bx=el("div","box");bx.appendChild(el("h3",null,g[0]));bx.lastChild.style.fontSize="20px";
   var n=el("p",null,g[1]);n.style.cssText="font-size:14px;color:var(--mut);margin:4px 0 12px";bx.appendChild(n);
   var fm=el("div","fm");
   g[2].forEach(function(f){var d=el("div","f"+(f[0]==="hesap_sahibi"||f[0]==="sirket_adres"||f[0]==="odeme_notu"?" w":""));var l=el("label",null,f[1]);var i=el("input");i.value=ayD[f[0]]||"";d.appendChild(l);d.appendChild(i);fm.appendChild(d);inp[f[0]]=i});
   bx.appendChild(fm);s.appendChild(bx)});
  var kb=el("button","btn","Tüm ayarları kaydet");kb.type="button";s.appendChild(kb);
  kb.addEventListener("click",function(){var f=inp.pro_fiyat.value.replace(/[^\d]/g,"");if(!f){say("Fiyat yazın.",1);return}inp.pro_fiyat.value=f;
   var rows=AYF.map(function(x){return{anahtar:x[0],deger:inp[x[0]].value.trim()}});
   api("/rest/v1/ee_ayar?on_conflict=anahtar",{method:"POST",body:rows,prefer:"resolution=merge-duplicates,return=minimal"}).then(function(){say("Kaydedildi ✓");flash(kb)}).catch(function(e){say(e.message,1)})})}).catch(function(e){s.textContent="";say(e.message,1)})}
})();
