(function(){
var E=window.EEU,$=function(i){return document.getElementById(i)};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var o=E.oturum();if(!o){location.replace("giris.html?git=hesabim.html");return}
var AJ=[],pro=false,PR=null,AY={},SP=[];
$("hc").addEventListener("click",function(){E.cikis();location.replace("giris.html")});
Array.prototype.forEach.call(document.querySelectorAll("#ht .tab[data-t]"),function(b){b.addEventListener("click",function(){
 Array.prototype.forEach.call(document.querySelectorAll("#ht .tab[data-t]"),function(x){x.classList.toggle("on",x===b)});
 $("aj").hidden=b.getAttribute("data-t")!=="aj";$("pk").hidden=b.getAttribute("data-t")!=="pk"})});
function bugun(){var d=new Date();d.setHours(0,0,0,0);return d}
function d0(s){return new Date(s+"T00:00:00")}
function kilit(k){k.innerHTML="";var b=el("div","kutu");b.appendChild(el("h2",null,"Ajanda, Pro üyelere özel"));
 b.appendChild(el("p","not2","Notlarını ve hatırlatma tarihlerini kendi ajandanda tut, bir yıl boyunca her şey tek yerde dursun. Yalnızca sen görürsün."));
 var ul=el("ul","lst");["Kendi notların ve görevlerin","Her nota tarih ve hatırlatma günü","Hatırlatmaları telefonunun takvimine aktar","1 yıl geçerli, bir kez öde"].forEach(function(t){ul.appendChild(el("li",null,t))});b.appendChild(ul);
 var a=el("a","btn","Pro’yu sepete ekle");a.href="sepet.html";b.appendChild(a);k.appendChild(b)}
function ics(){
 var L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Evligeevet//TR","CALSCALE:GREGORIAN"],n=0,now=new Date();function z(x){return String(x).padStart(2,"0")}
 AJ.forEach(function(a){if(a.tamam||!a.hatirlat)return;var d=d0(a.hatirlat);if(d<bugun())return;n++;
  var st=d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+"T090000";
  L.push("BEGIN:VEVENT","UID:ee-aj-"+a.id+"@evliligeevet","DTSTAMP:"+now.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART:"+st,"DURATION:PT30M","SUMMARY:"+String(a.baslik).replace(/[,;\r\n]/g," "),"DESCRIPTION:"+String(a.notu||"").replace(/[,;\r\n]/g," ")+" (Evliliğe Evet)","BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:Hatırlatma","END:VALARM","END:VEVENT")});
 if(!n){alert("Takvime aktarılacak yaklaşan hatırlatma yok.");return}
 L.push("END:VCALENDAR");var bl=new Blob([L.join("\r\n")],{type:"text/calendar"}),a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="ajanda-hatirlatmalari.ics";document.body.appendChild(a);a.click();a.remove()}
function ajanda(){
 var k=$("aj");if(!pro){kilit(k);return}k.innerHTML="";
 var f=el("div","kutu");f.appendChild(el("h2",null,"Yeni not ekle"));
 var g=el("div","fm");
 function alan(lbl,id,tip,w){var d=el("div","f"+(w?" w":""));var l=el("label",null,lbl);l.htmlFor=id;var i=tip==="ta"?el("textarea"):el("input");if(tip!=="ta")i.type=tip;i.id=id;if(tip==="ta")i.rows=3;d.appendChild(l);d.appendChild(i);g.appendChild(d);return i}
 var b=alan("Başlık","aj_b","text",1),n=alan("Not (isteğe bağlı)","aj_n","ta",1),t=alan("Tarih","aj_t","date"),h=alan("Hatırlatma günü","aj_h","date");
 b.maxLength=120;n.maxLength=1000;f.appendChild(g);
 var bt=el("button","btn sm","Ajandaya ekle");bt.type="button";bt.style.marginTop="14px";f.appendChild(bt);var m=el("p","msg err");f.appendChild(m);k.appendChild(f);
 bt.addEventListener("click",function(){m.textContent="";if(!b.value.trim()){m.textContent="Başlık yaz.";return}bt.disabled=true;
  E.api("/rest/v1/ee_ajanda",{method:"POST",prefer:"return=minimal",body:{user_id:o.user.id,baslik:b.value.trim(),notu:n.value.trim(),tarih:t.value||null,hatirlat:h.value||null}}).then(yukle).catch(function(e){m.textContent=e.message;bt.disabled=false})});
 var yak=AJ.filter(function(a){if(a.tamam||!a.hatirlat)return false;var d=d0(a.hatirlat),bg=bugun();return d>=bg&&d<=new Date(bg.getTime()+7*864e5)||d<bg});
 if(yak.length){var y=el("div","note");y.appendChild(el("b",null,"Yaklaşan hatırlatmalar"));yak.forEach(function(a){y.appendChild(el("div",null,E.tarih(a.hatirlat)+": "+a.baslik))});y.style.margin="18px 0";k.appendChild(y)}
 var ic=el("button","btn o sm","Hatırlatmaları takvime aktar (.ics)");ic.type="button";ic.style.margin="16px 0";ic.addEventListener("click",ics);k.appendChild(ic);
 if(!AJ.length){k.appendChild(el("p","not2","Henüz notun yok. Yukarıdan ilk notunu ekle."))}
 AJ.forEach(function(a){var r=el("div","it"+(a.tamam?" d":""));var ck=el("button","ck",a.tamam?"✓":"");ck.type="button";r.appendChild(ck);
  var tx=el("div","tx");tx.appendChild(el("b",null,a.baslik));if(a.notu)tx.appendChild(el("span",null,a.notu));
  var cs=el("div");cs.style.marginTop="6px";if(a.tarih)cs.appendChild(el("span","chip g","Tarih: "+E.tarih(a.tarih)));if(a.hatirlat){var c=el("span","chip","Hatırlatma: "+E.tarih(a.hatirlat));c.style.marginLeft="6px";cs.appendChild(c)}tx.appendChild(cs);r.appendChild(tx);
  var sl=el("button","btn sm o del2","Sil");sl.type="button";r.appendChild(sl);k.appendChild(r);
  ck.addEventListener("click",function(){E.api("/rest/v1/ee_ajanda?id=eq."+a.id,{method:"PATCH",prefer:"return=minimal",body:{tamam:!a.tamam}}).then(yukle).catch(function(e){alert(e.message)})});
  sl.addEventListener("click",function(){if(!confirm("Bu not silinsin mi?"))return;E.api("/rest/v1/ee_ajanda?id=eq."+a.id,{method:"DELETE",prefer:"return=minimal"}).then(yukle).catch(function(e){alert(e.message)})})})}
function paket(){
 var k=$("pk");k.innerHTML="";var b=el("div","kutu");b.appendChild(el("h2",null,"Paketim"));
 b.appendChild(el("p",null,pro?"Pro üyelik, "+E.tarih(PR.pro_bitis)+" tarihine kadar geçerli.":"Ücretsiz üyelik. Ajanda için Pro gerekir."));
 var a=el("a","btn sm",pro?"Süreyi 1 yıl uzat":"Pro’yu sepete ekle");a.href="sepet.html";b.appendChild(a);k.appendChild(b);
 var s=el("div","kutu");s.style.marginTop="18px";s.appendChild(el("h2",null,"Siparişlerim"));
 if(!SP.length)s.appendChild(el("p","not2","Henüz siparişin yok."));
 SP.forEach(function(x){var r=el("div","spr");var sol=el("div");sol.appendChild(el("b",null,"Pro Yıllık, "+E.tl(x.tutar)));sol.appendChild(el("p","not2",E.tarih(x.created_at.slice(0,10))+" · "+E.kod(x.id)));
  var d={beklemede:"Ödeme bekleniyor",odendi:"Ödendi",iptal:"İptal"}[x.durum]||x.durum;r.appendChild(sol);r.appendChild(el("span","chip"+(x.durum==="odendi"?" g":""),d));s.appendChild(r);
  if(x.durum==="beklemede")s.appendChild(E.odemeKutu(AY,x))});
 k.appendChild(s)}
function yukle(){return Promise.all([E.profil(),E.api("/rest/v1/ee_ajanda?select=*&order=tamam.asc,hatirlat.asc.nullslast,created_at.desc"),E.api("/rest/v1/ee_siparis?select=*&order=created_at.desc"),E.ayar()]).then(function(r){
 PR=r[0]||{};pro=E.proMu(PR);AJ=r[1]||[];SP=r[2]||[];AY=r[3]||{};
 $("hs").textContent=(PR.ad||o.user.email)+(pro?" · Pro üye":" · Ücretsiz üye");ajanda();paket()}).catch(function(e){$("hs").textContent=e.message;if(/Oturum/.test(e.message))setTimeout(function(){location.replace("giris.html")},1200)})}
yukle();
})();
