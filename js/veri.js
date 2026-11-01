/* Listeyi Supabase'den okur; ayar yoksa ya da hata olursa data.js içindeki yedek liste kullanılır. */
window.listeYukle=function(cb){
 var bitti=false;function fin(){if(bitti)return;bitti=true;cb()}
 var A=window.AYAR||{};
 if(!A.SUPABASE_URL||!A.SUPABASE_KEY){fin();return}
 var h={apikey:A.SUPABASE_KEY,Authorization:"Bearer "+A.SUPABASE_KEY},u=A.SUPABASE_URL.replace(/\/$/,"");
 setTimeout(fin,4000);
 Promise.all([
  fetch(u+"/rest/v1/ee_kategori?select=*&order=sira",{headers:h}).then(function(r){return r.json()}),
  fetch(u+"/rest/v1/ee_madde?select=*&aktif=eq.true&order=sira",{headers:h}).then(function(r){return r.json()})
 ]).then(function(r){
  var k=r[0],m=r[1];
  if(!Array.isArray(k)||!Array.isArray(m)||!k.length||!m.length){fin();return}
  var L=[],R=[];
  k.forEach(function(c){
   var og=m.filter(function(x){return x.kategori_id===c.id});
   if(c.tur==="rehber"){og.forEach(function(x){R.push([x.id,x.baslik,x.aciklama||""])})}
   else if(og.length){L.push({id:c.id,ad:c.ad,ogeler:og.map(function(x){return[x.id,x.baslik,x.aciklama||"",x.hafta==null?0:x.hafta]})})}
  });
  if(L.length)window.LISTE=L;
  if(R.length)window.REHBER=R;
  fin();
 }).catch(fin);
};
