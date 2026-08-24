/* =========================================================
   PROJECTS.JS — fetch + render project listings & detail page
   ========================================================= */

const CATEGORY_LABELS = {
  photography: "Photography",
  videography: "Videography",
  editing: "Editing",
  design: "Graphic Design"
};

async function getProjects(){
  const res = await apiGet("/projects");
  if(res && res.data && res.data.length) return res.data;
  return window.__FALLBACK_PROJECTS__ || [];
}

function workRowTemplate(project, index){
  const cover = project.coverImage || (project.gallery && project.gallery[0] && project.gallery[0].url) || "";
  return `
  <div class="work-row" data-category="${project.category}">
    <div class="work-index">${String(index+1).padStart(2,"0")}</div>
    <div class="work-main">
      <a class="work-media" href="project.html?slug=${encodeURIComponent(project.slug)}">
        <img src="${cover}" alt="${escapeHtml(project.title)} — cover image" loading="lazy" decoding="async">
        <div class="work-media-overlay"><span class="work-media-tag">${CATEGORY_LABELS[project.category]||project.category}</span></div>
      </a>
      <div class="work-info">
        <a href="project.html?slug=${encodeURIComponent(project.slug)}">
          <h3 class="work-title display">${escapeHtml(project.title)}</h3>
        </a>
        <div class="work-tags">
          <span>${CATEGORY_LABELS[project.category]||project.category}</span>
          <span>${project.year}</span>
          <span>${escapeHtml(project.location||"")}</span>
        </div>
        <p class="work-desc">${escapeHtml(project.description||"")}</p>
      </div>
    </div>
  </div>`;
}

/* ---------- HOME: FEATURED WORK ---------- */
async function renderFeaturedWork(){
  const mount = document.getElementById("featured-work-list");
  if(!mount) return;
  const projects = (await getProjects()).filter(p=>p.featured).sort((a,b)=>(a.order||0)-(b.order||0));
  const list = projects.length ? projects : (await getProjects()).slice(0,3);
  mount.innerHTML = list.map(workRowTemplate).join("");
  initWorkMediaReveal();
  initReveals();
}

/* ---------- WORK PAGE: ALL WORK + FILTER ---------- */
async function renderAllWork(){
  const mount = document.getElementById("all-work-list");
  if(!mount) return;
  const projects = (await getProjects()).sort((a,b)=>(a.order||0)-(b.order||0));
  mount.innerHTML = projects.map(workRowTemplate).join("");
  initWorkMediaReveal();
  initReveals();

  const filterBar = document.getElementById("filter-bar");
  if(!filterBar) return;
  filterBar.addEventListener("click", (e)=>{
    const btn = e.target.closest(".filter-btn");
    if(!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    mount.querySelectorAll(".work-row").forEach(row=>{
      const match = filter === "all" || row.dataset.category === filter;
      row.classList.toggle("filtered-out", !match);
    });
  });
}

/* ---------- PROJECT DETAIL PAGE ---------- */
async function renderProjectDetail(){
  const root = document.getElementById("project-root");
  if(!root) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const projects = await getProjects();
  const project = projects.find(p=>p.slug === slug) || projects[0];
  if(!project){
    root.innerHTML = `<div class="container" style="padding:200px 0;"><p>Project not found.</p></div>`;
    return;
  }

  document.title = `${project.title} — Kai Asher`;
  const metaDesc = document.getElementById("proj-desc-meta");
  if(metaDesc) metaDesc.setAttribute("content", project.description || "");

  const gallery = project.gallery && project.gallery.length ? project.gallery : [{type:"image", url:project.coverImage}];

  root.innerHTML = `
    <section class="pj-hero">
      ${gallery[0].type === "video"
        ? `<video src="${gallery[0].url}" autoplay muted loop playsinline poster="${project.coverImage||''}"></video>`
        : `<img src="${project.coverImage || gallery[0].url}" alt="${escapeHtml(project.title)}">`}
      <div class="hero-overlay"></div>
      <div class="pj-hero-content container">
        <div class="eyebrow">${CATEGORY_LABELS[project.category]||project.category}</div>
        <h1 class="display" style="font-size:clamp(38px,7vw,90px);">${escapeHtml(project.title)}</h1>
      </div>
    </section>
    <section class="section" style="padding-bottom:20px;">
      <div class="container">
        <p class="pj-desc display">${escapeHtml(project.description||"")}</p>
        <div class="pj-meta-grid">
          <div><span class="k">Category</span><span class="v">${CATEGORY_LABELS[project.category]||project.category}</span></div>
          <div><span class="k">Year</span><span class="v">${project.year||""}</span></div>
          <div><span class="k">Location</span><span class="v">${escapeHtml(project.location||"")}</span></div>
          <div><span class="k">Direction</span><span class="v" style="font-size:14px;line-height:1.5;">${escapeHtml(project.creativeDirection||"—")}</span></div>
        </div>
        <div class="pj-gallery" id="pj-gallery"></div>
      </div>
    </section>
  `;

  const galleryMount = document.getElementById("pj-gallery");
  galleryMount.innerHTML = gallery.map((m,i)=>`
    <figure class="lb-trigger" data-i="${i}">
      ${m.type === "video"
        ? `<video src="${m.url}" muted loop playsinline></video>`
        : `<img src="${m.url}" alt="${escapeHtml(project.title)} — image ${i+1}" loading="lazy" decoding="async">`}
    </figure>`).join("");

  window.__CURRENT_GALLERY__ = gallery.map(m=>({url:m.url, type:m.type, caption:project.title}));
  bindLightboxTriggers(galleryMount.querySelectorAll(".lb-trigger"));

  // next project
  const idx = projects.findIndex(p=>p.slug === project.slug);
  const nextProject = projects[(idx+1) % projects.length];
  const nextMount = document.createElement("div");
  nextMount.className = "container";
  nextMount.innerHTML = `
    <a class="pj-next" href="project.html?slug=${encodeURIComponent(nextProject.slug)}">
      <div><span class="lbl">Next Project</span><div class="title display">${escapeHtml(nextProject.title)}</div></div>
      <svg width="34" height="20" viewBox="0 0 34 20" fill="none"><path d="M1 10H33M33 10L24 1M33 10L24 19" stroke="currentColor" stroke-width="1"/></svg>
    </a>`;
  root.appendChild(nextMount);

  initReveals();
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderFeaturedWork();
  renderAllWork();
  renderProjectDetail();
});
