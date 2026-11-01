(function(){
var E=window.EEU,k=document.getElementById("sepet");
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function link(h,t){var a=el("a",null,t);a.href=h;a.target="_blank";return a}
if(!E.ok){k.textContent="Sistem ayarı eksik.";return}
var oturum=E.oturum();
Promise.all([E.ayar(),oturum?E.profil().catch(function(){return null}):Promise.resolve(null),oturum?E.api("/rest/v1/ee_siparis?select=*&durum=eq.beklemede").catch(function(){return[]}):Promise.resolve([])]).then(function(r){
 var ay=r[0],pr=r[1],bek=(r[2]||[])[0],fiyat=Number(ay.pro_fiyat||900);
 k.innerHTML="";
 if(bek){
  var b=el("div","kutu");b.appendChild(el("h2",null,"Siparişin hazır"));
  b.appendChild(el("p","not2","Pro Yıllık siparişin alındı. Ödemeyi aşağıdaki bilgilerle yap. Ödeme gelince Pro üyeliğin otomatik açılır."));
  b.appendChild(E.odemeKutu(ay,bek));var h=el("a","btn sm","Hesabıma git");h.href="hesabim.html";h.style.marginTop="14px";b.appendChild(h);k.appendChild(b);return}
 var s=el("div","kutu");s.appendChild(el("h2",null,"Sepetim"));
 var row=el("div","spr");var sol=el("div");sol.appendChild(el("b",null,"Evliliğe Evet Pro, 1 yıllık üyelik"));
 sol.appendChild(el("p","not2","Kişisel ajanda ve notlar, hatırlatma tarihleri, takvime aktarma. Satın alma tarihinden itibaren 1 yıl geçerlidir."));
 row.appendChild(sol);row.appendChild(el("div","fy",E.tl(fiyat)));s.appendChild(row);
 var tp=el("div","spt");tp.appendChild(el("span",null,"Toplam"));tp.appendChild(el("b",null,E.tl(fiyat)));s.appendChild(tp);
 s.appendChild(el("p","not2",ay.kdv_notu||"Fiyata KDV dahildir."));
 if(pr&&E.proMu(pr))s.appendChild(el("p","not2","Mevcut Pro üyeliğin "+E.tarih(pr.pro_bitis)+" tarihine kadar geçerli. Yeni sipariş, süreni 1 yıl uzatır."));
 var msg=el("p","msg err");
 if(!oturum){
  s.appendChild(el("p","not2","Sipariş vermek için önce giriş yapmalı ya da üye olmalısın."));
  var g=el("a","btn","Giriş yap / Üye ol ve devam et");g.href="giris.html?git=sepet.html";s.appendChild(g)}
 else{
  var lb=el("label","rz");var cb=el("input");cb.type="checkbox";lb.appendChild(cb);
  var sp=el("span");sp.appendChild(document.createTextNode(" "));sp.appendChild(link("sozlesme.html","Mesafeli satış sözleşmesini"));sp.appendChild(document.createTextNode(", "));sp.appendChild(link("iade.html","iptal ve iade koşullarını"));sp.appendChild(document.createTextNode(" ve "));sp.appendChild(link("kvkk.html","KVKK aydınlatma metnini"));sp.appendChild(document.createTextNode(" okudum, kabul ediyorum."));lb.appendChild(sp);s.appendChild(lb);
  var bt=el("button","btn","Siparişi oluştur");bt.type="button";bt.style.marginTop="14px";s.appendChild(bt);
  bt.addEventListener("click",function(){msg.textContent="";if(!cb.checked){msg.textContent="Devam etmek için sözleşmeyi onaylamalısın.";return}
   bt.disabled=true;
   E.api("/rest/v1/ee_siparis",{method:"POST",prefer:"return=representation",body:{user_id:oturum.user.id,ad:(pr&&pr.ad)||oturum.user.ad||"",eposta:oturum.user.email,telefon:(pr&&pr.telefon)||"",tutar:fiyat}}).then(function(){location.reload()}).catch(function(e){msg.textContent=e.message;bt.disabled=false})})}
 s.appendChild(msg);
 s.appendChild(el("p","not2","Kartla ödeme (iyzico) yakında eklenecek. Şimdilik banka havalesi / EFT ile ödeme alıyoruz."));
 k.appendChild(s)});
})();
