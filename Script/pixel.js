const WH = document.querySelectorAll("#pixel");
function WHSize() {
    WH.intElemClientWidth = element.clientWidth;
    WH.intElemClientHeight = element.clientHeight;
    WH.intElemOffsetWidth = element.offsetWidth;
    WH.intElemOffsetHeight = element.offsetHeight;
    WH.Width = window.innerWidth;
    WH.Height = window.innerHeight;
    WH.textContent = window.innerWidth;
    WH.textContent = window.innerHeight;
}
WHSize();
window.addEventListener("resize", WHSize);
window.onresize = WHSize;
// window.onresize = function(){ location.reload(WHSize); } // Recharger la page lors du redimensionnement

CSS.escape("html");
CSS.escape("widget");
CSS.escape("iframe");
CSS.escape(".foo#bar");
CSS.escape("()[]{}");
CSS.escape(0);
CSS.escape('\0');
