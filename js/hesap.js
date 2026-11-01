(function(){
var E=window.EEU,$=function(i){return document.getElementById(i)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var o=E.oturum();if(!o){location.replace("giris.html?git=hesabim.html");return}
var AJ=[],pro=false,PR=null,AY={},SP=[],KS=null,LIS=[];
var bg=new Date();bg.setHours(0,0,0,0);
var gY=bg.getFullYear(),gM=bg.getMonth(),sec=ds(bg);
var ONCE=[[0,"Zamanında"],[15,"15 dakika önce"],[60,"1 saat önce"],[1440,"1 gün önce"],[2880,"2 gün önce"],[10080,"1 hafta önce"]];
$("hc").addEventListener("click",function(){E.cikis();location.replace("giris.html")});
Array.prototype.forEach.call(document.querySelectorAll("#ht .tab[data-t]"),function(b){b.addEventListener("click",function(){
 Array.prototype.forEach.call(document.querySelectorAll("#ht .tab[data-t]"),function(x){x.classList.toggle("on",x===b)});
 $("aj").hidden=b.getAttribute("data-t")!=="aj";$("pk").hidden=b.getAttribute("data-t")!=="pk"})});
function z(x){return String(x).padStart(2,"0")}
function ds(d){return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())}
function d0(s){return new Date(s+"T00:00:00")}
function sa(a){return a.saat?String(a.saat).slice(0,5):""}
function evt(a){return new Date(a.tarih+"T"+(sa(a)||"09:00")+":00")}
function once(a){var n=a.hatirlat_once==null?1440:a.hatirlat_once,r=ONCE.filter(function(x){return x[0]===n})[0];return r?r[1]:n+" dk önce"}
function gunFark(s){return Math.round((d0(s)-bg)/864e5)}
function uzun(s){return d0(s).toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}
function ilkAd(){var a=(PR&&PR.ad)||o.user.ad||"";return a.split(" ")[0]||"Merhaba"}
function hata(e){E.toast(e.message||"Hata oluştu",1)}

function kilit(k){k.innerHTML="";var b=el("div","kutu");b.appendChild(el("h2",null,"Ajanda ve hatırlatma asistanı, Pro üyelere özel"));
 b.appendChild(el("p","not2","Düğün hazırlıklarını saatli bir takvimde tut. Asistan düğününe kaç gün kaldığını ve bu hafta neler yapman gerektiğini söyler. Yalnızca sen görürsün."));
 var ul=el("ul","lst");["Saatli takvim: hangi gün, saat kaçta ne var bir bakışta","Kendi notların ve randevuların, her birine hatırlatma anahtarı","Yol haritasındaki işler düğün tarihine göre takvimine otomatik dizilir","Hatırlatmaları telefonunun takvimine tek dokunuşla aktar","“Düğününe 30 gün kaldı” gibi kişiye özel asistan mesajları","1 yıl geçerli, bir kez öde"].forEach(function(t){ul.appendChild(el("li",null,t))});b.appendChild(ul);
 var a=el("a","btn","Pro’yu sepete ekle");a.href="sepet.html";b.appendChild(a);k.appendChild(b)}

function ics(){
 var L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Evliligeevet//TR","CALSCALE:GREGORIAN"],n=0,now=new Date();
 AJ.forEach(function(a){if(a.tamam||!a.tarih)return;var d=evt(a);if(d<now)return;n++;
  var st=ds(d).replace(/-/g,"")+"T"+z(d.getHours())+z(d.getMinutes())+"00";
  L.push("BEGIN:VEVENT","UID:ee-aj-"+a.id+"@evliligeevet","DTSTAMP:"+now.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART:"+st,"DURATION:PT30M","SUMMARY:"+String(a.baslik).replace(/[,;\r\n]/g," "),"DESCRIPTION:"+String(a.notu||"").replace(/[,;\r\n]/g," ")+" (Evliliğe Evet)");
  if(a.hatirlat_acik!==false)L.push("BEGIN:VALARM","TRIGGER:-PT"+(a.hatirlat_once==null?1440:a.hatirlat_once)+"M","ACTION:DISPLAY","DESCRIPTION:Hatırlatma: "+String(a.baslik).replace(/[,;\r\n]/g," "),"END:VALARM");
  L.push("END:VEVENT")});
 if(!n){E.toast("Takvime aktarılacak yaklaşan kayıt yok.",1);return}
 L.push("END:VCALENDAR");var bl=new Blob([L.join("\r\n")],{type:"text/calendar"}),a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="ajanda-hatirlatmalari.ics";document.body.appendChild(a);a.click();a.remove();E.toast(n+" kayıt takvim dosyasına yazıldı ✓")}

function sw(on,fn){var l=el("label","sw"),i=el("input");i.type="checkbox";i.checked=!!on;l.appendChild(i);l.appendChild(el("i"));i.addEventListener("change",function(){fn(i.checked,i)});return l}
function patch(a,body,msg){return E.api("/rest/v1/ee_ajanda?id=eq."+a.id,{method:"PATCH",prefer:"return=minimal",body:body}).then(function(){if(msg)E.toast(msg);return yukle()}).catch(hata)}

function asistan(k){
 var b=el("div","asis"),ad=ilkAd(),dg=KS&&KS.dugun_tarihi;
 var yak=AJ.filter(function(a){if(a.tamam||!a.tarih)return false;var g=gunFark(a.tarih);return g>=0&&g<=7});
 var bugunler=AJ.filter(function(a){return!a.tamam&&a.tarih===ds(bg)});
 var gec=AJ.filter(function(a){return!a.tamam&&a.tarih&&gunFark(a.tarih)<0}).length;
 if(dg){var g=gunFark(dg);
  b.appendChild(el("h2",null,g>0?ad+", düğününe "+g+" gün kaldı.":(g===0?ad+", bugün düğün günün!":ad+", düğününüz tamamlandı, tebrikler!")))}
 else b.appendChild(el("h2",null,ad+", düğün tarihini girince seni takip etmeye başlarım."));
 if(dg&&gunFark(dg)>=0){
  b.appendChild(el("p",null,yak.length?"Bu hafta "+yak.length+" işin var."+(bugunler.length?" Bugün: "+bugunler.map(function(a){return(sa(a)?sa(a)+" ":"")+a.baslik}).join(", ")+".":""):"Bu hafta takviminde iş görünmüyor."));
  if(gec)b.appendChild(el("p",null,gec+" işin tarihi geçti ve hâlâ tamamlanmadı. Takvimden kontrol et."))}
 var due=AJ.filter(function(a){if(a.tamam||a.hatirlat_acik===false||!a.tarih)return false;var e=evt(a),n=new Date(),t=new Date(e.getTime()-(a.hatirlat_once==null?1440:a.hatirlat_once)*6e4);return t<=n&&e>=n}).slice(0,4);
 due.forEach(function(a){var n=el("div","nw","Hatırlatma: "+(sa(a)?uzun(a.tarih)+", "+sa(a):uzun(a.tarih))+" · "+a.baslik);b.appendChild(n)});
 var ln=el("div","ln"),f=el("div");var l=el("label",null,"Düğün tarihin");l.htmlFor="dg_t";var i=el("input");i.type="date";i.id="dg_t";i.value=dg||"";f.appendChild(l);f.appendChild(i);ln.appendChild(f);
 var kb=el("button","btn sm","Tarihi kaydet");kb.type="button";ln.appendChild(kb);
 var yb=el("button","btn sm","Yol haritamı takvime diz");yb.type="button";ln.appendChild(yb);b.appendChild(ln);
 b.appendChild(el("p",null,"Yol haritasındaki işler, düğün tarihine göre saatli kayıt olarak takvimine eklenir. İstediğini silebilir ya da hatırlatmasını kapatabilirsin.")).style.cssText="font-size:14px;opacity:.9;margin-top:12px";
 kb.addEventListener("click",function(){if(!i.value){E.toast("Önce tarihi seç.",1);return}kb.disabled=true;
  E.api("/rest/v1/ee_kisisel",{method:"POST",prefer:"resolution=merge-duplicates,return=minimal",body:{user_id:o.user.id,dugun_tarihi:i.value,updated_at:new Date().toISOString()}}).then(function(){E.toast("Düğün tarihin kaydedildi ✓");return yukle()}).catch(function(e){hata(e);kb.disabled=false})});
 yb.addEventListener("click",function(){diz(i.value||dg,yb)});
 k.appendChild(b)}

function diz(dg,btn){
 if(!dg){E.toast("Önce düğün tarihini gir ve kaydet.",1);return}
 if(!LIS.length){E.toast("Yol haritası listesi yüklenemedi, sayfayı yenile.",1);return}
 btn.disabled=true;var mevcut={};AJ.forEach(function(a){if(a.kaynak)mevcut[a.kaynak]=a});
 var yeni=[],gun=[],base=d0(dg);
 LIS.forEach(function(kt){(kt.ogeler||[]).forEach(function(m){if(m[3]==null)return;var d=new Date(base.getTime());d.setDate(d.getDate()+m[3]*7);var t=ds(d),key="liste:"+m[0],ex=mevcut[key];
  if(ex){if(!ex.tamam&&ex.tarih!==t)gun.push([ex,t])}
  else if(d>=bg)yeni.push({user_id:o.user.id,baslik:m[1],notu:m[2]||"",tarih:t,saat:"10:00",hatirlat_acik:true,hatirlat_once:1440,kaynak:key})})});
 var is=[];
 if(yeni.length)is.push(E.api("/rest/v1/ee_ajanda",{method:"POST",prefer:"return=minimal",body:yeni}));
 gun.forEach(function(x){is.push(E.api("/rest/v1/ee_ajanda?id=eq."+x[0].id,{method:"PATCH",prefer:"return=minimal",body:{tarih:x[1]}}))});
 if(!is.length){btn.disabled=false;E.toast("Takvimin zaten güncel ✓");return}
 Promise.all(is).then(function(){E.toast(yeni.length+" iş eklendi"+(gun.length?", "+gun.length+" tarih güncellendi":"")+" ✓");return yukle()}).catch(function(e){hata(e);btn.disabled=false})}

function takvim(k){
 var kt=el("div","kt"),bs=el("div","bs"),on=el("button",null,"‹"),sn=el("button",null,"›"),bb=el("b",null,new Date(gY,gM,1).toLocaleDateString("tr-TR",{month:"long",year:"numeric"}));
 on.type=sn.type="button";on.setAttribute("aria-label","Önceki ay");sn.setAttribute("aria-label","Sonraki ay");bs.appendChild(on);bs.appendChild(bb);bs.appendChild(sn);kt.appendChild(bs);
 on.addEventListener("click",function(){gM--;if(gM<0){gM=11;gY--}ajanda()});sn.addEventListener("click",function(){gM++;if(gM>11){gM=0;gY++}ajanda()});
 var g=el("div","kg7");["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].forEach(function(h){g.appendChild(el("div","hd",h))});
 var ilk=new Date(gY,gM,1),bos=(ilk.getDay()+6)%7,son=new Date(gY,gM+1,0).getDate(),by={};
 AJ.forEach(function(a){if(a.tarih)(by[a.tarih]=by[a.tarih]||[]).push(a)});
 for(var i=0;i<bos;i++)g.appendChild(el("div","gn bos"));
 for(var d=1;d<=son;d++){(function(d){
  var t=gY+"-"+z(gM+1)+"-"+z(d),L=by[t]||[],c=el("button","gn"+(t===ds(bg)?" bg":"")+(t===sec?" sec":"")+(KS&&KS.dugun_tarihi===t?" dg":""));c.type="button";
  c.appendChild(el("span",null,String(d)));
  if(L.length){var nk=el("div","nk");L.slice(0,4).forEach(function(a){nk.appendChild(el("s",a.tamam?"g":""))});c.appendChild(nk);c.appendChild(el("span","sy",L.length+" kayıt"))}
  else if(KS&&KS.dugun_tarihi===t)c.appendChild(el("span","sy","Düğün"));
  c.setAttribute("aria-label",d+" "+bb.textContent+(L.length?", "+L.length+" kayıt":""));
  c.addEventListener("click",function(){sec=t;ajanda();var p=$("gunp");if(p&&p.scrollIntoView)p.scrollIntoView({behavior:"smooth",block:"nearest"})});g.appendChild(c)})(d)}
 kt.appendChild(g);k.appendChild(kt)}

function satir(a){
 var r=el("div","aj7"+(a.tamam?" d":"")),ck=el("button","ck7",a.tamam?"✓":"");ck.type="button";ck.setAttribute("aria-label","Tamamlandı olarak işaretle");r.appendChild(ck);
 r.appendChild(el("div","sa",sa(a)||"Gün boyu"));
 var tx=el("div","tx");tx.appendChild(el("b",null,a.baslik));if(a.notu)tx.appendChild(el("span",null,a.notu));
 tx.appendChild(el("span",null,a.hatirlat_acik===false?"Hatırlatma kapalı":"Hatırlatma: "+once(a)));r.appendChild(tx);
 var sg=el("div","sg");sg.appendChild(sw(a.hatirlat_acik!==false,function(v){patch(a,{hatirlat_acik:v},v?"Hatırlatma açıldı ✓":"Hatırlatma kapatıldı")}));sg.appendChild(el("span",null,"Hatırlat"));
 var sl=el("button","sil7","Sil");sl.type="button";sg.appendChild(sl);r.appendChild(sg);
 ck.addEventListener("click",function(){patch(a,{tamam:!a.tamam},a.tamam?"Geri alındı":"Tamamlandı ✓")});
 sl.addEventListener("click",function(){if(!confirm("Bu kayıt silinsin mi?"))return;E.api("/rest/v1/ee_ajanda?id=eq."+a.id,{method:"DELETE",prefer:"return=minimal"}).then(function(){E.toast("Silindi");return yukle()}).catch(hata)});
 return r}

function gunPanel(k){
 var b=el("div","kutu");b.id="gunp";b.style.marginBottom="18px";b.appendChild(el("h2",null,uzun(sec)));
 var L=AJ.filter(function(a){return a.tarih===sec}).sort(function(x,y){return(sa(x)||"99:99")<(sa(y)||"99:99")?-1:1});
 if(!L.length)b.appendChild(el("p","not2","Bu güne kayıt yok. Aşağıdan ekleyebilirsin."));
 L.forEach(function(a){b.appendChild(satir(a))});k.appendChild(b)}

function yaklasan(k){
 var n=new Date(),L=AJ.filter(function(a){return!a.tamam&&a.tarih&&evt(a)>=n}).sort(function(x,y){return evt(x)-evt(y)}).slice(0,6);
 if(!L.length)return;var b=el("div","kutu");b.style.marginBottom="18px";b.appendChild(el("h2",null,"Yaklaşanlar"));
 L.forEach(function(a){var r=el("div","ayr"),s=el("div");s.appendChild(el("b",null,a.baslik));s.appendChild(el("p",null,uzun(a.tarih)+(sa(a)?", "+sa(a):"")));r.appendChild(s);
  var g=gunFark(a.tarih);r.appendChild(el("span","chip"+(g<=1?"":" g"),g===0?"Bugün":g===1?"Yarın":g+" gün sonra"));b.appendChild(r)});k.appendChild(b)}

function form(k){
 var f=el("div","kutu");f.style.marginBottom="18px";f.appendChild(el("h2",null,"Yeni kayıt ekle"));
 var g=el("div","fm");
 function alan(lbl,id,tip,w){var d=el("div","f"+(w?" w":""));var l=el("label",null,lbl);l.htmlFor=id;var i=tip==="ta"?el("textarea"):(tip==="sel"?el("select"):el("input"));if(tip!=="ta"&&tip!=="sel")i.type=tip;i.id=id;if(tip==="ta")i.rows=2;d.appendChild(l);d.appendChild(i);g.appendChild(d);return i}
 var b=alan("Başlık (örn. Makyaj provası)","aj_b","text",1),t=alan("Tarih","aj_t","date"),h=alan("Saat","aj_h","time"),n=alan("Not (isteğe bağlı)","aj_n","ta",1),s=alan("Ne zaman hatırlatayım?","aj_s","sel");
 b.maxLength=120;n.maxLength=1000;t.value=sec;h.value="10:00";
 ONCE.forEach(function(x){var op=el("option",null,x[1]);op.value=x[0];s.appendChild(op)});s.value="1440";
 var d2=el("div","f");d2.appendChild(el("label",null,"Hatırlatma"));var sl=el("div");sl.style.cssText="display:flex;gap:10px;align-items:center;padding-top:6px";var ac=true;sl.appendChild(sw(true,function(v){ac=v;s.disabled=!v}));sl.appendChild(el("span",null,"Açık"));d2.appendChild(sl);g.appendChild(d2);
 f.appendChild(g);var bt=el("button","btn sm","Takvime ekle");bt.type="button";bt.style.marginTop="14px";f.appendChild(bt);k.appendChild(f);
 bt.addEventListener("click",function(){if(!b.value.trim()){E.toast("Başlık yaz.",1);return}if(!t.value){E.toast("Tarih seç.",1);return}bt.disabled=true;
  E.api("/rest/v1/ee_ajanda",{method:"POST",prefer:"return=minimal",body:{user_id:o.user.id,baslik:b.value.trim(),notu:n.value.trim(),tarih:t.value,saat:h.value||null,hatirlat_acik:ac,hatirlat_once:parseInt(s.value,10)}}).then(function(){sec=t.value;var d=d0(t.value);gY=d.getFullYear();gM=d.getMonth();E.toast("Kaydedildi ✓ Takvimine eklendi");return yukle()}).catch(function(e){hata(e);bt.disabled=false})})}

function ayarlar(k){
 var f=el("div","kutu");f.style.marginBottom="18px";f.appendChild(el("h2",null,"Hatırlatma ayarları"));
 var r=el("div","ayr"),s=el("div");s.appendChild(el("b",null,"E-posta ile hatırlat"));
 s.appendChild(el("p",null,AY.eposta_acik==="evet"?"Hatırlatmalar "+o.user.email+" adresine de gelir.":"E-posta hatırlatması çok yakında. Şimdilik hatırlatmalar bu sayfada ve telefon takvimine aktardığın dosyada görünür."));
 r.appendChild(s);r.appendChild(sw(!KS||KS.eposta_hatirlat!==false,function(v){E.api("/rest/v1/ee_kisisel",{method:"POST",prefer:"resolution=merge-duplicates,return=minimal",body:{user_id:o.user.id,eposta_hatirlat:v,updated_at:new Date().toISOString()}}).then(function(){E.toast(v?"E-posta hatırlatma açıldı ✓":"E-posta hatırlatma kapatıldı");return yukle()}).catch(hata)}));f.appendChild(r);
 var r2=el("div","ayr"),s2=el("div");s2.appendChild(el("b",null,"Telefonunun takvimine aktar"));s2.appendChild(el("p",null,"Yaklaşan kayıtlar dosya olarak iner. Dosyayı açınca telefonun takvimi her kaydı saatinde kendi bildirimiyle hatırlatır."));r2.appendChild(s2);
 var ib=el("button","btn o sm","Aktar");ib.type="button";ib.addEventListener("click",ics);r2.appendChild(ib);f.appendChild(r2);k.appendChild(f)}

function ajanda(){
 var k=$("aj");if(!pro){kilit(k);return}k.innerHTML="";
 asistan(k);takvim(k);gunPanel(k);yaklasan(k);form(k);ayarlar(k)}

function paket(){
 var k=$("pk");k.innerHTML="";var b=el("div","kutu");b.appendChild(el("h2",null,"Paketim"));
 b.appendChild(el("p",null,pro?"Pro üyelik, "+E.tarih(PR.pro_bitis)+" tarihine kadar geçerli.":"Ücretsiz üyelik. Ajanda ve hatırlatma asistanı için Pro gerekir."));
 var a=el("a","btn sm",pro?"Süreyi 1 yıl uzat":"Pro’yu sepete ekle");a.href="sepet.html";b.appendChild(a);k.appendChild(b);
 var s=el("div","kutu");s.style.marginTop="18px";s.appendChild(el("h2",null,"Siparişlerim"));
 if(!SP.length)s.appendChild(el("p","not2","Henüz siparişin yok."));
 SP.forEach(function(x){var r=el("div","spr");var sol=el("div");sol.appendChild(el("b",null,"Pro Yıllık, "+E.tl(x.tutar)));sol.appendChild(el("p","not2",E.tarih(x.created_at.slice(0,10))+" · "+E.kod(x.id)));
  var d={beklemede:"Ödeme bekleniyor",odendi:"Ödendi",iptal:"İptal"}[x.durum]||x.durum;r.appendChild(sol);r.appendChild(el("span","chip"+(x.durum==="odendi"?" g":""),d));s.appendChild(r);
  if(x.durum==="beklemede")s.appendChild(E.odemeKutu(AY,x))});
 k.appendChild(s)}

function listeAl(){return new Promise(function(r){if(window.listeYukle)window.listeYukle(function(){r(window.LISTE||[])});else r(window.LISTE||[])})}
function yukle(){return Promise.all([E.profil(),E.api("/rest/v1/ee_ajanda?select=*&order=tarih.asc.nullslast,saat.asc.nullslast"),E.api("/rest/v1/ee_siparis?select=*&order=created_at.desc"),E.ayar(),E.api("/rest/v1/ee_kisisel?select=*&user_id=eq."+o.user.id).catch(function(){return[]}),listeAl()]).then(function(r){
 PR=r[0]||{};pro=E.proMu(PR);AJ=r[1]||[];SP=r[2]||[];AY=r[3]||{};KS=(r[4]||[])[0]||null;LIS=r[5]||[];
 $("hs").textContent=(PR.ad||o.user.email)+(pro?" · Pro üye":" · Ücretsiz üye");ajanda();paket()}).catch(function(e){$("hs").textContent=e.message;if(/Oturum/.test(e.message))setTimeout(function(){location.replace("giris.html")},1200)})}
yukle();
})();
