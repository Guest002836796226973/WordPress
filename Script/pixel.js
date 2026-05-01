// Le mode multi-selectors à un meilleur retour ?!
const WH = document.querySelectorAll("html");
const WH = document.querySelectorAll("iframe");
const WH = document.querySelectorAll("widget");
function WS() {
    WH.intElemClientWidth = element.clientWidth;
    WH.intElemClientHeight = element.clientHeight;
    WH.intElemOffsetWidth = element.offsetWidth;
    WH.intElemOffsetHeight = element.offsetHeight;
    WH.Width = window.innerWidth;
    WH.Height = window.innerHeight;
    WH.textContent = window.innerWidth;
    WH.textContent = window.innerHeight;
}
WS();
window.addEventListener("resize", WS);
window.onresize = WS;
window.onresize = function(){ location.reload(WS); } // Désactiver cette ligne en cas de rechargement intempestif

// Fractionner le code ci-avant selon votre expérience
