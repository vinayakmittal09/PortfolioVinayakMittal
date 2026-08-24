/* =========================================================
   MAIN.JS — global chrome: loader, nav, cursor, footer, form
   ========================================================= */

const API_BASE = (function(){
  // Same-origin API when served by the Express server.
  // Falls back gracefully to local sample data if the API is unreachable.
  return "/api";
})();

async function apiGet(path){
  try{
    const res = await fetch(API_BASE + path);
    if(!res.ok) throw new Error("bad status " + res.status);
    return await res.json();
  }catch(err){
    console.warn("API unavailable, using fallback data:", path, err.message);
    return null;
  }
}

/* ---------- LOADER ---------- */
(function loader(){
  const loaderEl = document.getElementById("loader");
  const countEl = document.getElementById("loader-count");
  if(!loaderEl) return;
  let pct = 0;
  const steps = [0,25,50,75,100];
  let i = 0;
  const iv = setInterval(()=>{
    pct = steps[i] ?? 100;
    if(countEl) countEl.textContent = String(pct).padStart(2,"0");
    i++;
    if(i >= steps.length){
      clearInterval(iv);
      setTimeout(()=>{
        loaderEl.classList.add("hidden");
        document.body.classList.add("loaded");
        const hero = document.getElementById("hero");
        if(hero) hero.classList.add("loaded");
        window.dispatchEvent(new CustomEvent("app:loaded"));
      }, 250);
    }
  }, 160);
})();

/* ---------- NAV SCROLL STATE ---------- */
(function navScroll(){
  const nav = document.getElementById("site-nav");
  if(!nav) return;
  const onScroll = ()=> nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
})();

/* ---------- SCROLL PROGRESS ---------- */
(function scrollProgress(){
  const bar = document.getElementById("scroll-progress");
  if(!bar) return;
  window.addEventListener("scroll", ()=>{
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = (isFinite(scrolled) ? scrolled : 0) + "%";
  }, {passive:true});
})();

/* ---------- MOBILE MENU ---------- */
(function mobileMenu(){
  const burger = document.getElementById("nav-burger");
  const menu = document.getElementById("mobile-menu");
  if(!burger || !menu) return;
  burger.addEventListener("click", ()=>{
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
    menu.classList.remove("open");
    document.body.style.overflow = "";
  }));
})();

/* ---------- CUSTOM CURSOR (desktop only) ---------- */
(function customCursor(){
  if(window.matchMedia("(max-width:860px)").matches) return;
  if(window.matchMedia("(pointer:coarse)").matches) return;
  const cursor = document.getElementById("cursor");
  const label = document.getElementById("cursor-label");
  if(!cursor || !label) return;
  let mx=0,my=0,cx=0,cy=0;
  window.addEventListener("mousemove", e=>{mx=e.clientX;my=e.clientY;});
  function raf(){
    cx += (mx-cx)*0.2; cy += (my-cy)*0.2;
    cursor.style.left = cx+"px"; cursor.style.top = cy+"px";
    label.style.left = mx+"px"; label.style.top = my+"px";
    requestAnimationFrame(raf);
  }
  raf();

  function bindTargets(){
    document.querySelectorAll("a, button, .work-media, .filter-btn").forEach(el=>{
      if(el.dataset.cursorBound) return;
      el.dataset.cursorBound = "1";
      el.addEventListener("mouseenter", ()=>{
        cursor.style.width="46px"; cursor.style.height="46px";
        if(el.classList.contains("work-media")){
          label.textContent = "View Project →";
          label.classList.add("show");
        }
      });
      el.addEventListener("mouseleave", ()=>{
        cursor.style.width="10px"; cursor.style.height="10px";
        label.classList.remove("show");
      });
    });
  }
  bindTargets();
  new MutationObserver(bindTargets).observe(document.body, {childList:true, subtree:true});
})();

/* ---------- MAGNETIC BUTTONS ---------- */
(function magnetic(){
  document.querySelectorAll(".btn").forEach(btn=>{
    btn.addEventListener("mousemove", e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.12}px, ${y*0.28}px)`;
    });
    btn.addEventListener("mouseleave", ()=> btn.style.transform = "translate(0,0)");
  });
})();

/* ---------- FOOTER ---------- */
(function footer(){
  const mount = document.getElementById("footer-mount");
  if(!mount) return;
  mount.innerHTML = `
  <footer>
    <div class="container">
      <div class="footer-top">
        <div>
          <div class="footer-logo display">Vinayak Mittal</div>
          <p class="footer-tag">Visual storyteller working across photography, film, editing and design.</p>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Site</div>
          <a href="index.html">Home</a>
          <a href="work.html">Work</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Connect</div>
          <a href="https://www.instagram.com/chhayakritvaasu/?__pwa=1" target="_blank" rel="noopener">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noopener">YouTube</a>
          <a href="https://behance.net" target="_blank" rel="noopener">Behance</a>
          <a href="https://www.linkedin.com/in/vinayak-mittal-a972a4381/" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <div class="hairline"></div>
      <div class="footer-bottom" style="padding-top:24px;">
        <span>© ${new Date().getFullYear()} Vinayak Mittal. All rights reserved.</span>
        <button id="back-to-top">Back to top
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 11V1M6 1L1.5 5.5M6 1L10.5 5.5" stroke="currentColor" stroke-width="1"/></svg>
        </button>
      </div>
    </div>
  </footer>`;
  document.getElementById("back-to-top").addEventListener("click", ()=>{
    window.scrollTo({top:0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  });
})();

/* ---------- CONTACT FORM ---------- */
(function contactForm(){
  const form = document.getElementById("contact-form");
  if(!form) return;
  const status = document.getElementById("cf-status");
  const submitBtn = document.getElementById("cf-submit");

  function setError(field, msg){
    const el = form.querySelector(`[data-error-for="${field}"]`);
    if(el) el.textContent = msg || "";
  }

  function validate(data){
    let ok = true;
    ["name","email","projectType","message"].forEach(f=>setError(f,""));
    if(!data.name || data.name.trim().length < 2){ setError("name","Please enter your name."); ok=false; }
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ setError("email","Please enter a valid email."); ok=false; }
    if(!data.projectType){ setError("projectType","Please select a project type."); ok=false; }
    if(!data.message || data.message.trim().length < 10){ setError("message","Tell me a little more (10+ characters)."); ok=false; }
    return ok;
  }

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(!validate(data)) return;

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.className = "form-status";

    try{
      const res = await fetch(API_BASE + "/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(json.message || "Something went wrong.");
      status.textContent = "Message sent — I'll reply within 48 hours.";
      status.className = "form-status ok";
      form.reset();
    }catch(err){
      status.textContent = err.message || "Could not send. Please email hello@kaiasher.com directly.";
      status.className = "form-status err";
    }finally{
      submitBtn.disabled = false;
    }
  });
})();
