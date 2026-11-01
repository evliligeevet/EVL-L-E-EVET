(function(){
var cv=document.getElementById("cv"),x=cv.getContext("2d"),W=1080,H=1350,T="klasik";
var $=function(i){return document.getElementById(i)};
var TP={
 klasik:{bg:"#fcf6f8",fr:"#7d1a3f",tx:"#7d1a3f",ac:"#c83263",sub:"#5d6b69"},
 gul:{bg:"#F6DEDF",fr:"#c83263",tx:"#7C1224",ac:"#c83263",sub:"#7a4a50"},
 gece:{bg:"#7d1a3f",fr:"#E9D8B4",tx:"#fcf6f8",ac:"#F5B7BF",sub:"#cfe0dc"},
 altin:{bg:"#fffaf0",fr:"#b8892b",tx:"#5b3a12",ac:"#b8892b",sub:"#7a6a52"},
 modern:{bg:"#ffffff",fr:"#231a26",tx:"#231a26",ac:"#c83263",sub:"#5a5e68"},
 cicek:{bg:"#fff1f4",fr:"#e8a1b6",tx:"#8f2147",ac:"#c83263",sub:"#7a4a58"}};
function cicek(cx,cy,r,c1,c2){for(var i=0;i<6;i++){x.save();x.translate(cx,cy);x.rotate(i*Math.PI/3);x.fillStyle=c1;x.beginPath();x.ellipse(0,-r*0.9,r*0.55,r,0,0,Math.PI*2);x.fill();x.restore()}x.fillStyle=c2;x.beginPath();x.arc(cx,cy,r*0.42,0,Math.PI*2);x.fill()}
function yaprak(cx,cy,r,a,c){x.save();x.translate(cx,cy);x.rotate(a);x.fillStyle=c;x.beginPath();x.ellipse(0,0,r*0.42,r,0,0,Math.PI*2);x.fill();x.restore()}
function kose(px,py,sx,sy,c){x.strokeStyle=c;x.lineWidth=4;x.beginPath();x.moveTo(px+sx*150,py);x.lineTo(px,py);x.lineTo(px,py+sy*150);x.stroke();x.fillStyle=c;x.save();x.translate(px+sx*26,py+sy*26);x.rotate(Math.PI/4);x.fillRect(-9,-9,18,18);x.restore()}
function cerceve(p){
 if(T==="modern"){x.fillStyle=p.ac;x.fillRect(0,0,W,86);x.fillRect(0,H-86,W,86);x.strokeStyle=p.fr;x.lineWidth=2;x.beginPath();x.moveTo(140,150);x.lineTo(W-140,150);x.moveTo(140,H-150);x.lineTo(W-140,H-150);x.stroke();return}
 x.strokeStyle=p.fr;x.lineWidth=5;x.strokeRect(50,50,W-100,H-100);x.lineWidth=1.5;x.strokeRect(72,72,W-144,H-144);
 if(T==="altin"){kose(100,100,1,1,p.fr);kose(W-100,100,-1,1,p.fr);kose(100,H-100,1,-1,p.fr);kose(W-100,H-100,-1,-1,p.fr)}
 if(T==="cicek"){[[130,130,0],[W-130,130,1],[130,H-130,2],[W-130,H-130,3]].forEach(function(k){var sx=k[2]%2?-1:1,sy=k[2]>1?-1:1;yaprak(k[0]+sx*95,k[1]+sy*20,70,sx*sy*(-1.0)+0.6,"#f4c6d3");yaprak(k[0]+sx*20,k[1]+sy*95,70,sx*sy*(1.0)-0.6+1.57,"#f4c6d3");cicek(k[0],k[1],40,"#f08fae","#fbe4ec")})}}
function wrap(t,mx,f){x.font=f;var w=t.split(" "),l="",o=[];w.forEach(function(k){var a=l?l+" "+k:k;if(x.measureText(a).width>mx&&l){o.push(l);l=k}else l=a});if(l)o.push(l);return o}
function C(t,y,f,c,sp){x.font=f;x.fillStyle=c;x.textAlign="center";if("letterSpacing" in x)x.letterSpacing=(sp||0)+"px";x.fillText(t,W/2,y);if("letterSpacing" in x)x.letterSpacing="0px"}
function draw(){
 var p=TP[T],g=$("gelin").value.trim()||"Elif",d=$("damat").value.trim()||"Burak";
 x.fillStyle=p.bg;x.fillRect(0,0,W,H);
 cerceve(p);
 var tr=$("tarih").value,ds="",gn="";
 if(tr){var dt=new Date(tr+"T00:00:00");ds=dt.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});gn=dt.toLocaleDateString("tr-TR",{weekday:"long"})}
 var sa=$("saat").value;
 C("DÜĞÜNÜMÜZE DAVETLİSİNİZ",210,'600 30px IN, sans-serif',p.ac,7);
 var fs=g.length+d.length>22?112:140,fn='italic 600 '+fs+'px IN, Georgia, serif',fb='600 '+fs+'px IN, Georgia, serif';
 C(g,470,fb,p.tx);C("&",600,'italic 500 110px IN, Georgia, serif',p.ac);C(d,760,fb,p.tx);
 x.strokeStyle=p.ac;x.lineWidth=3;x.beginPath();x.moveTo(W/2-70,840);x.lineTo(W/2+70,840);x.stroke();
 var y=930;
 if(ds){C(ds+(gn?" • "+gn:""),y,'600 38px IN, sans-serif',p.tx);y+=58}
 if(sa){C("Saat "+sa,y,'500 34px IN, sans-serif',p.sub);y+=54}
 var mk=$("mekan").value.trim();
 if(mk){wrap(mk,780,'500 34px IN, sans-serif').slice(0,3).forEach(function(l){C(l,y,'500 34px IN, sans-serif',p.sub);y+=48})}
 var nt=$("not").value.trim();
 if(nt){y+=14;wrap(nt,760,'italic 500 32px IN, Georgia, serif').slice(0,3).forEach(function(l){C(l,y,'italic 500 32px IN, Georgia, serif',p.ac);y+=46})}
 C("Sizi aramızda görmekten mutluluk duyarız",H-(T==="modern"?190:T==="cicek"?160:125),'italic 500 30px IN, Georgia, serif',p.sub);
 C("evliligeevet.com ile hazırlandı",H-(T==="modern"?34:T==="cicek"?122:92),'500 21px IN, sans-serif',T==="modern"?"#ffffff":p.sub,1)}
["gelin","damat","tarih","saat","mekan","not"].forEach(function(i){$(i).addEventListener("input",draw)});
Array.prototype.forEach.call(document.querySelectorAll(".tpl"),function(b){b.addEventListener("click",function(){T=b.dataset.t;Array.prototype.forEach.call(document.querySelectorAll(".tpl"),function(o){o.classList.toggle("on",o===b)});draw()})});
$("indir").addEventListener("click",function(){var a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="davetiye.png";document.body.appendChild(a);a.click();a.remove()});
$("paylas").addEventListener("click",function(){
 cv.toBlob(function(b){var f=new File([b],"davetiye.png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Davetiye"}).catch(function(){})}
  else{$("indir").click()}})});
var go=function(){draw()};
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load("600 40px IN"),document.fonts.load("italic 600 40px IN"),document.fonts.load("600 30px IN")]).then(go,go)}else go();
draw();
})();
