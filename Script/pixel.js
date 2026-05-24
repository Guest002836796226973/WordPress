// Le mode multi-selectors à un meilleur retour ?!
const WH = document.querySelectorAll("html");
// const WH = document.querySelectorAll("iframe");
// const WH = document.querySelectorAll("widget");
function WS() {
    WidthHeight.Width = window.innerWidth;
    WidthHeight.Height = window.innerHeight;
    WidthHeight.textContent = window.innerWidth;
    WidthHeight.textContent = window.innerHeight;
    return;
}
WindowSize();
window.addEventListener("resize", WS);
window.onresize = WS();
window.onresize = function(){ location.reload(WS); } // Désactiver cette ligne en cas de rechargement intempestif
// Fractionner le code ci-avant selon l'expérience de l'utilisateur
