/* =========================================================
   ANIMATIONS.JS — scroll reveals, service preview, testimonials
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- SCROLL REVEALS ---------- */
function initReveals(root=document){
  const els = root.querySelectorAll(".reveal:not(.in), .reveal-mask:not(.in)");
  if(reduceMotion){ els.forEach(el=>el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:"0px 0px -60px 0px"});
  els.forEach(el=>io.observe(el));
}
window.addEventListener("app:loaded", ()=>initReveals());
document.addEventListener("DOMContentLoaded", ()=>initReveals());
window.initReveals = initReveals;

/* ---------- WORK MEDIA IRIS REVEAL (signature interaction) ---------- */
function initWorkMediaReveal(root=document){
  const els = root.querySelectorAll(".work-media:not(.bound)");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.2});
  els.forEach(el=>{ el.classList.add("bound"); reduceMotion ? el.classList.add("in") : io.observe(el); });
}
window.initWorkMediaReveal = initWorkMediaReveal;

/* ---------- SERVICE ROW HOVER PREVIEW ---------- */
(function servicePreview(){
  const rows = document.querySelectorAll(".service-row[data-img]");
  const preview = document.getElementById("service-preview");
  const previewImg = document.getElementById("service-preview-img");
  if(!rows.length || !preview) return;
  rows.forEach(row=>{
    row.addEventListener("mousemove", e=>{
      preview.style.left = (e.clientX + 30) + "px";
      preview.style.top = (e.clientY - 140) + "px";
    });
    row.addEventListener("mouseenter", ()=>{
      previewImg.src = row.dataset.img;
      preview.classList.add("show");
    });
    row.addEventListener("mouseleave", ()=> preview.classList.remove("show"));
  });
})();

/* ---------- PROCESS STEP HIGHLIGHT ---------- */
(function processSteps(){
  const steps = document.querySelectorAll(".process-step");
  if(!steps.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); });
  }, {threshold:0.5});
  steps.forEach(s=>io.observe(s));
})();

/* ---------- TESTIMONIALS CAROUSEL ---------- */
(function testimonials(){
  const wrap = document.getElementById("testi-wrap");
  const dotsWrap = document.getElementById("testi-dots");
  if(!wrap) return;
  const data = window.__FALLBACK_TESTIMONIALS__ || [];

  function render(list){
    wrap.innerHTML = list.map((t,i)=>`
      <div class="testi-slide ${i===0?'active':''}" data-i="${i}">
        <p class="testi-quote display">"${escapeHtml(t.quote)}"</p>
        <div class="testi-attrib">
          <img class="testi-avatar" src="${t.avatar||''}" alt="${escapeHtml(t.name)}">
          <div>
            <div class="testi-name">${escapeHtml(t.name)}</div>
            <div class="testi-role">${escapeHtml(t.role||'')}</div>
          </div>
        </div>
      </div>`).join("");
    dotsWrap.innerHTML = list.map((_,i)=>`<button class="testi-dot ${i===0?'active':''}" data-i="${i}" aria-label="Testimonial ${i+1}"></button>`).join("");

    let current = 0;
    const slides = wrap.querySelectorAll(".testi-slide");
    const dots = dotsWrap.querySelectorAll(".testi-dot");
    function show(i){
      slides.forEach((s,idx)=>s.classList.toggle("active", idx===i));
      dots.forEach((d,idx)=>d.classList.toggle("active", idx===i));
      current = i;
    }
    dots.forEach(d=>d.addEventListener("click", ()=>show(Number(d.dataset.i))));
    if(list.length > 1 && !reduceMotion){
      setInterval(()=> show((current+1)%list.length), 6000);
    }
  }

  apiGet("/testimonials").then(res=>{
    const list = (res && res.data && res.data.length) ? res.data : data;
    render(list);
  });
})();

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
window.escapeHtml = escapeHtml;
