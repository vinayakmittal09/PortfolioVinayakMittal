/* =========================================================
   GALLERY.JS — fullscreen lightbox
   ========================================================= */

let __lbIndex = 0;

function bindLightboxTriggers(nodeList){
  const lightbox = document.getElementById("lightbox");
  if(!lightbox) return;
  nodeList.forEach(el=>{
    el.addEventListener("click", ()=>{
      __lbIndex = Number(el.dataset.i) || 0;
      openLightbox();
    });
  });
}

function openLightbox(){
  const lightbox = document.getElementById("lightbox");
  if(!lightbox) return;
  renderLightboxMedia();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  const lightbox = document.getElementById("lightbox");
  if(!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function renderLightboxMedia(){
  const gallery = window.__CURRENT_GALLERY__ || [];
  if(!gallery.length) return;
  const item = gallery[__lbIndex];
  const mediaMount = document.getElementById("lb-media");
  const counter = document.getElementById("lb-counter");
  const caption = document.getElementById("lb-caption");
  if(!mediaMount) return;
  mediaMount.innerHTML = item.type === "video"
    ? `<video src="${item.url}" controls autoplay playsinline></video>`
    : `<img src="${item.url}" alt="${escapeHtml(item.caption||'')}">`;
  if(counter) counter.textContent = `${__lbIndex+1} / ${gallery.length}`;
  if(caption) caption.textContent = item.caption || "";
}

function lbPrev(){
  const gallery = window.__CURRENT_GALLERY__ || [];
  if(!gallery.length) return;
  __lbIndex = (__lbIndex - 1 + gallery.length) % gallery.length;
  renderLightboxMedia();
}
function lbNext(){
  const gallery = window.__CURRENT_GALLERY__ || [];
  if(!gallery.length) return;
  __lbIndex = (__lbIndex + 1) % gallery.length;
  renderLightboxMedia();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const closeBtn = document.getElementById("lb-close");
  const prevBtn = document.getElementById("lb-prev");
  const nextBtn = document.getElementById("lb-next");
  const lightbox = document.getElementById("lightbox");
  if(closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if(prevBtn) prevBtn.addEventListener("click", lbPrev);
  if(nextBtn) nextBtn.addEventListener("click", lbNext);
  if(lightbox) lightbox.addEventListener("click", (e)=>{ if(e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e)=>{
    if(!lightbox || !lightbox.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") lbPrev();
    if(e.key === "ArrowRight") lbNext();
  });

  // Work-list media items also open the lightbox using the project's own cover
  document.body.addEventListener("click", (e)=>{
    // handled per-page via bindLightboxTriggers for project galleries
  });
});
