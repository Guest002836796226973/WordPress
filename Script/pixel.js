const WH = document.querySelectorAll("html");
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
// window.onresize = function(){ location.reload(WS); }

const WHIf = document.querySelectorAll("iframe");
function WSIf() {
    WHIf.intElemClientWidth = element.clientWidth;
    WHIf.intElemClientHeight = element.clientHeight;
    WHIf.intElemOffsetWidth = element.offsetWidth;
    WHIf.intElemOffsetHeight = element.offsetHeight;
    WHIf.Width = window.innerWidth;
    WHIf.Height = window.innerHeight;
    WHIf.textContent = window.innerWidth;
    WHIf.textContent = window.innerHeight;
}
WSIf();
window.addEventListener("resize", WSIf);
window.onresize = WSIf;

const WHWi = document.querySelectorAll("widget");
function WSWi() {
    WHWi.intElemClientWidth = element.clientWidth;
    WHWi.intElemClientHeight = element.clientHeight;
    WHWi.intElemOffsetWidth = element.offsetWidth;
    WHWi.intElemOffsetHeight = element.offsetHeight;
    WHWi.Width = window.innerWidth;
    WHWi.Height = window.innerHeight;
    WHWi.textContent = window.innerWidth;
    WHWi.textContent = window.innerHeight;
}
WSWi();
window.addEventListener("resize", WSWi);
window.onresize = WSWi;
