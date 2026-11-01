(function(){
var cv=document.getElementById("cv"),x=cv.getContext("2d"),W=1080,H=1350,T="klasik";
var $=function(i){return document.getElementById(i)};
var TP={
 klasik:{bg:"#FAF6EE",fr:"#0B4F4C",tx:"#0B4F4C",ac:"#C41F38",sub:"#5d6b69"},
 gul:{bg:"#F6DEDF",fr:"#C41F38",tx:"#7C1224",ac:"#C41F38",sub:"#7a4a50"},
 gece:{bg:"#0B4F4C",fr:"#E9D8B4",tx:"#FAF6EE",ac:"#F5B7BF",sub:"#cfe0dc"}};
function wrap(t,mx,f){x.font=f;var w=t.split(" "),l="",o=[];w.forEach(function(k){var a=l?l+" "+k:k;if(x.measureText(a).width>mx&&l){o.push(l);l=k}else l=a});if(l)o.push(l);return o}
function C(t,y,f,c,sp){x.font=f;x.fillStyle=c;x.textAlign="center";if("letterSpacing" in x)x.letterSpacing=(sp||0)+"px";x.fillText(t,W/2,y);if("letterSpacing" in x)x.letterSpacing="0px"}
function draw(){
 var p=TP[T],g=$("gelin").value.trim()||"Elif",d=$("damat").value.trim()||"Burak";
 x.fillStyle=p.bg;x.fillRect(0,0,W,H);
 x.strokeStyle=p.fr;x.lineWidth=5;x.strokeRect(50,50,W-100,H-100);x.lineWidth=1.5;x.strokeRect(72,72,W-144,H-144);
 var tr=$("tarih").value,ds="",gn="";
 if(tr){var dt=new Date(tr+"T00:00:00");ds=dt.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});gn=dt.toLocaleDateString("tr-TR",{weekday:"long"})}
 var sa=$("saat").value;
 C("DÜĞÜNÜMÜZE DAVETLİSİNİZ",210,'600 30px AR, sans-serif',p.ac,7);
 var fs=g.length+d.length>22?112:140,fn='italic 600 '+fs+'px PF, Georgia, serif',fb='600 '+fs+'px PF, Georgia, serif';
 C(g,470,fb,p.tx);C("&",600,'italic 500 110px PF, Georgia, serif',p.ac);C(d,760,fb,p.tx);
 x.strokeStyle=p.ac;x.lineWidth=3;x.beginPath();x.moveTo(W/2-70,840);x.lineTo(W/2+70,840);x.stroke();
 var y=930;
 if(ds){C(ds+(gn?" • "+gn:""),y,'600 38px AR, sans-serif',p.tx);y+=58}
 if(sa){C("Saat "+sa,y,'500 34px AR, sans-serif',p.sub);y+=54}
 var mk=$("mekan").value.trim();
 if(mk){wrap(mk,780,'500 34px AR, sans-serif').slice(0,3).forEach(function(l){C(l,y,'500 34px AR, sans-serif',p.sub);y+=48})}
 var nt=$("not").value.trim();
 if(nt){y+=14;wrap(nt,760,'italic 500 32px PF, Georgia, serif').slice(0,3).forEach(function(l){C(l,y,'italic 500 32px PF, Georgia, serif',p.ac);y+=46})}
 C("Sizi aramızda görmekten mutluluk duyarız",H-125,'italic 500 30px PF, Georgia, serif',p.sub)}
["gelin","damat","tarih","saat","mekan","not"].forEach(function(i){$(i).addEventListener("input",draw)});
Array.prototype.forEach.call(document.querySelectorAll(".tpl"),function(b){b.addEventListener("click",function(){T=b.dataset.t;Array.prototype.forEach.call(document.querySelectorAll(".tpl"),function(o){o.classList.toggle("on",o===b)});draw()})});
$("indir").addEventListener("click",function(){var a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="davetiye.png";document.body.appendChild(a);a.click();a.remove()});
$("paylas").addEventListener("click",function(){
 cv.toBlob(function(b){var f=new File([b],"davetiye.png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Davetiye"}).catch(function(){})}
  else{$("indir").click()}})});
var go=function(){draw()};
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load("600 40px PF"),document.fonts.load("italic 600 40px PF"),document.fonts.load("600 30px AR")]).then(go,go)}else go();
draw();
})();
