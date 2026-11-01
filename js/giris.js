(function(){
var $=function(i){return document.getElementById(i)},E=window.EEU,mod="g";
var p=new URLSearchParams(location.search).get("git");var git=(p==="sepet.html"||p==="hesabim.html")?p:"hesabim.html";
if(E.oturum()){location.replace(git);return}
function ayarla(){var k=mod==="k";Array.prototype.forEach.call(document.querySelectorAll(".kk"),function(e){e.hidden=!k});$("gb").textContent=k?"Üye ol":"Giriş yap";$("pw").autocomplete=k?"new-password":"current-password";
 Array.prototype.forEach.call(document.querySelectorAll("#gt .tab"),function(b){b.classList.toggle("on",b.getAttribute("data-m")===mod)});$("gm").textContent=""}
Array.prototype.forEach.call(document.querySelectorAll("#gt .tab"),function(b){b.addEventListener("click",function(){mod=b.getAttribute("data-m");ayarla()})});
$("goz").addEventListener("click",function(){var i=$("pw"),g=i.type==="password";i.type=g?"text":"password";this.textContent=g?"Gizle":"Göster"});
if(!E.ok){$("gm").textContent="Sistem ayarı eksik.";$("gb").disabled=true}
$("gf").addEventListener("submit",function(e){e.preventDefault();var m=$("gm");m.textContent="";
 var em=$("em").value.trim(),pw=$("pw").value;
 if(mod==="k"){if(!$("ad").value.trim()){m.textContent="Adını yaz.";return}if(!$("kv").checked){m.textContent="Devam etmek için aydınlatma metnini onaylamalısın.";return}}
 $("gb").disabled=true;
 var i=mod==="k"?E.kayit(em,pw,$("ad").value.trim(),$("tel").value.trim()):E.giris(em,pw);
 i.then(function(){location.replace(git)}).catch(function(x){m.textContent=x.message;$("gb").disabled=false})});
ayarla();
})();
