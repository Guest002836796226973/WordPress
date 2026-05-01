const WH = document.querySelectorAll("#pixel");
function WHSize() {
  WH.Width = window.innerWidth;
  WH.Height = window.innerHeight;
}
WHSize();
window.addEventListener("resize", WHSize);
window.onresize = WHSize;
