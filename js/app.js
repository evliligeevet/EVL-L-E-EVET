(function(){
var K="ee_v1";
function ld(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}}
function sv(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
var S=ld(); S.done=S.done||{};
var $=function(q,r){return (r||document).querySelector(q)};
var $$=function(q,r){return Array.prototype.slice.call((r||document).querySelectorAll(q))};
var A=window.AYAR||{};

/* menü */
var bg=$(".burger"),nv=$("nav.m");
if(bg){bg.addEventListener("click",function(){var o=nv.classList.toggle("open");bg.setAttribute("aria-expanded",o)})}
$$("[data-fiyat]").forEach(function(e){e.textContent=A.PRO_FIYAT||""});
$$("[data-ep]").forEach(function(e){if(!A.EPOSTA)e.style.display="none";else e.href="mailto:"+A.EPOSTA+"?subject="+encodeURIComponent("Evliliğe Evet Pro ön kayıt")});
$$("[data-wa]").forEach(function(e){if(!A.WHATSAPP)e.style.display="none";else e.href="https://wa.me/"+A.WHATSAPP+"?text="+encodeURIComponent("Merhaba, Evliliğe Evet Pro için ön kayıt yaptırmak istiyorum.")});
if(!A.EPOSTA&&!A.WHATSAPP){$$("[data-onkayit]").forEach(function(e){e.style.display="none"});$$("[data-yakinda]").forEach(function(e){e.style.display="block"})}

function gun(d){var a=new Date();a.setHours(0,0,0,0);var b=new Date(d+"T00:00:00");return Math.round((b-a)/86400000)}
function fmt(d){return new Date(d+"T00:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}
function wk(w){var n=Math.abs(w);var t;if(w===0)return"Düğün günü";if(n>=8&&n%4===0)t=(n/4)+" ay";else if(n>=8)t=Math.round(n/4.345)+" ay";else t=n+" hafta";return t+(w<0?" kala":" sonra")}

/* yol haritası */
var pg=document.body.getAttribute("data-page");
function initYol(){
 var cur=(location.hash||"").replace("#","")||S.tab||"nikah";
 if(!window.LISTE.some(function(x){return x.id===cur}))cur="nikah";
 var tb=$("#tabs"),ls=$("#liste"),di=$("#tarih");
 window.LISTE.forEach(function(k){var b=document.createElement("button");b.className="tab";b.textContent=k.ad;b.dataset.id=k.id;b.addEventListener("click",function(){cur=k.id;S.tab=cur;sv(S);draw()});tb.appendChild(b)});
 if(S.date)di.value=S.date;
 di.addEventListener("change",function(){S.date=di.value;sv(S);draw()});
 function tot(){var n=0,d=0;window.LISTE.forEach(function(k){k.ogeler.forEach(function(o){n++;if(S.done[o[0]])d++})});return[d,n]}
 function draw(){
  $$(".tab").forEach(function(b){b.classList.toggle("on",b.dataset.id===cur)});
  var k=window.LISTE.filter(function(x){return x.id===cur})[0];ls.innerHTML="";
  k.ogeler.forEach(function(o){
   var d=!!S.done[o[0]],el=document.createElement("div");el.className="it"+(d?" d":"");
   var when=S.date?'<span class="chip g">'+wk(o[3])+'</span>':'';
   el.innerHTML='<button class="ck" aria-label="İşaretle" aria-pressed="'+d+'">'+(d?"✓":"")+'</button><div class="tx"><b></b><span></span></div><div class="when">'+when+'</div>';
   $("b",el).textContent=o[1];$("span",el).textContent=o[2];
   $(".ck",el).addEventListener("click",function(){S.done[o[0]]=!S.done[o[0]];sv(S);draw()});
   ls.appendChild(el)});
  var t=tot(),p=t[1]?Math.round(t[0]*100/t[1]):0;
  $("#pbar").style.width=p+"%";$("#ptxt").textContent="Hazırlıkların %"+p+"'i tamam ("+t[0]+"/"+t[1]+")";
  if(S.date){var g=gun(S.date);$("#kalan").textContent=g>0?g+" gün":(g===0?"Bugün!":"Düğün tamam 🎉");$("#kalanalt").textContent=fmt(S.date)}else{$("#kalan").textContent="–";$("#kalanalt").textContent="Düğün tarihinizi girin"}
 }
 $("#icsbtn").addEventListener("click",function(){
  if(!S.date){alert("Önce düğün tarihinizi girin.");return}
  var base=new Date(S.date+"T09:00:00"),L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Evliligeevet//TR","CALSCALE:GREGORIAN"],n=0,now=new Date();
  function z(x){return String(x).padStart(2,"0")}
  window.LISTE.forEach(function(k){k.ogeler.forEach(function(o){
   if(S.done[o[0]])return;var d=new Date(base.getTime());d.setDate(d.getDate()+o[3]*7);
   if(d<now)return;n++;
   var st=d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+"T090000";
   L.push("BEGIN:VEVENT","UID:ee-"+o[0]+"-"+S.date+"@evliligeevet","DTSTAMP:"+now.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART:"+st,"DURATION:PT30M","SUMMARY:"+o[1].replace(/[,;]/g," "),"DESCRIPTION:"+o[2].replace(/[,;]/g," ")+" (Evliliğe Evet)","BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:Hatırlatma","END:VALARM","END:VEVENT")})});
  if(!n){alert("Takvime eklenecek yaklaşan madde kalmadı.");return}
  L.push("END:VCALENDAR");
  var bl=new Blob([L.join("\r\n")],{type:"text/calendar"}),a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="evlilik-hatirlatmalari.ics";document.body.appendChild(a);a.click();a.remove()});
 $("#sifirla").addEventListener("click",function(){if(confirm("Tüm işaretler ve tarih silinsin mi?")){S={done:{}};sv(S);di.value="";draw()}});
 draw();
}

if(pg==="yol")window.listeYukle(initYol);

/* evlilik sonrası */
function initSonra(){
 var c=$("#rehber");c.innerHTML="";
 window.REHBER.forEach(function(o){
  var e=document.createElement("div");e.className="it";
  e.innerHTML='<button class="ck" aria-label="İşaretle"></button><div class="tx"><b></b><span></span></div>';
  $("b",e).textContent=o[1];$("span",e).textContent=o[2];
  var b=$(".ck",e),id=o[0];
  function r(){var d=!!S.done[id];e.classList.toggle("d",d);b.textContent=d?"✓":""}
  b.addEventListener("click",function(){S.done[id]=!S.done[id];sv(S);r()});r();c.appendChild(e)})}
if(pg==="sonra")window.listeYukle(initSonra);

/* dilekçe */
if(pg==="dilekce"){
 var ids=["memurluk","gelin","damat","adres","tel","tarih","ek"];
 function up(){
  function v(i,d){var x=$("#"+i).value.trim();return x||d}
  var t=$("#tarih").value;var ts=t?new Date(t+"T00:00:00").toLocaleDateString("tr-TR"):"……/……/………";
  $("#o_mem").textContent=v("memurluk","……………………… Belediyesi")+" Evlendirme Memurluğu’na";
  $("#o_gelin").textContent=v("gelin","……………………………");$("#o_damat").textContent=v("damat","……………………………");
  $("#o_adres").textContent=v("adres","……………………………………");$("#o_tel").textContent=v("tel","……………………………");
  $("#o_ek").textContent=v("ek","Evlenme başvuru belgeleri");$("#o_tarih").textContent=ts}
 ids.forEach(function(i){$("#"+i).addEventListener("input",up)});up();
 $("#yaz").addEventListener("click",function(){window.print()})}
})();
