/* =========================================================
   ADMIN.JS — login + CRUD dashboard (talks to /api/*)
   ========================================================= */

const API = "/api";
let TOKEN = localStorage.getItem("admin_token") || "";

const loginPanel = document.getElementById("login-panel");
const dashboardPanel = document.getElementById("dashboard-panel");
const logoutBtn = document.getElementById("logout-btn");

function authHeaders(){
  return TOKEN ? { "Authorization": "Bearer " + TOKEN } : {};
}

async function api(path, opts={}){
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers||{})
    }
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

function showDashboard(){
  loginPanel.style.display = "none";
  dashboardPanel.style.display = "block";
  logoutBtn.style.display = "inline-block";
  loadProjects();
  loadTestimonials();
  loadMessages();
}

function showLogin(){
  loginPanel.style.display = "block";
  dashboardPanel.style.display = "none";
  logoutBtn.style.display = "none";
}

document.getElementById("login-btn").addEventListener("click", async ()=>{
  const email = document.getElementById("a-email").value.trim();
  const password = document.getElementById("a-pass").value;
  const errEl = document.getElementById("login-error");
  errEl.textContent = "";
  try{
    const json = await api("/auth/login", { method:"POST", body: JSON.stringify({email, password}) });
    TOKEN = json.token;
    localStorage.setItem("admin_token", TOKEN);
    showDashboard();
  }catch(err){
    errEl.textContent = err.message || "Login failed.";
  }
});

logoutBtn.addEventListener("click", ()=>{
  TOKEN = "";
  localStorage.removeItem("admin_token");
  showLogin();
});

if(TOKEN){ showDashboard(); } else { showLogin(); }

/* ---------- TABS ---------- */
document.querySelectorAll(".admin-tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".admin-tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

function msg(text, ok=true){
  const el = document.getElementById("admin-msg");
  el.textContent = text;
  el.className = ok ? "ok" : "";
  setTimeout(()=> el.textContent = "", 3500);
}

/* ---------- PROJECTS ---------- */
async function loadProjects(){
  try{
    const json = await api("/projects");
    const body = document.getElementById("admin-projects-body");
    body.innerHTML = json.data.map(p=>`
      <tr>
        <td>${p.order ?? 0}</td>
        <td>${escapeHtml(p.title)}</td>
        <td>${p.category}</td>
        <td>${p.year || ""}</td>
        <td><span class="badge">${p.featured ? "Featured" : "—"}</span></td>
        <td>
          <button class="a-btn" data-edit="${p._id}">Edit</button>
          <button class="a-btn danger" data-del="${p._id}">Delete</button>
        </td>
      </tr>`).join("") || `<tr><td colspan="6">No projects yet.</td></tr>`;

    body.querySelectorAll("[data-edit]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const p = json.data.find(x=>x._id === btn.dataset.edit);
        fillProjectForm(p);
        document.querySelector('.admin-tab[data-tab="new-project"]').click();
      });
    });
    body.querySelectorAll("[data-del]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        if(!confirm("Delete this project?")) return;
        try{
          await api("/projects/" + btn.dataset.del, { method:"DELETE" });
          msg("Project deleted.");
          loadProjects();
        }catch(err){ msg(err.message, false); }
      });
    });
  }catch(err){ msg(err.message, false); }
}

function fillProjectForm(p){
  document.getElementById("proj-form-heading").textContent = p ? "Edit Project" : "New Project";
  document.getElementById("p-id").value = p ? p._id : "";
  document.getElementById("p-title").value = p ? p.title : "";
  document.getElementById("p-slug").value = p ? p.slug : "";
  document.getElementById("p-category").value = p ? p.category : "photography";
  document.getElementById("p-year").value = p ? p.year : new Date().getFullYear();
  document.getElementById("p-location").value = p ? (p.location||"") : "";
  document.getElementById("p-order").value = p ? (p.order||0) : 0;
  document.getElementById("p-cover").value = p ? (p.coverImage||"") : "";
  document.getElementById("p-featured").value = p ? String(!!p.featured) : "false";
  document.getElementById("p-desc").value = p ? (p.description||"") : "";
  document.getElementById("p-gallery").value = p && p.gallery ? p.gallery.map(g=>g.url).join("\n") : "";
}
document.getElementById("reset-project-form").addEventListener("click", ()=>fillProjectForm(null));

document.getElementById("save-project-btn").addEventListener("click", async ()=>{
  const id = document.getElementById("p-id").value;
  const galleryUrls = document.getElementById("p-gallery").value.split("\n").map(s=>s.trim()).filter(Boolean);
  const payload = {
    title: document.getElementById("p-title").value.trim(),
    slug: document.getElementById("p-slug").value.trim(),
    category: document.getElementById("p-category").value,
    year: Number(document.getElementById("p-year").value),
    location: document.getElementById("p-location").value.trim(),
    order: Number(document.getElementById("p-order").value),
    coverImage: document.getElementById("p-cover").value.trim(),
    featured: document.getElementById("p-featured").value === "true",
    description: document.getElementById("p-desc").value.trim(),
    gallery: galleryUrls.map(url=>({ type: /\.(mp4|webm|mov)$/i.test(url) ? "video" : "image", url }))
  };
  if(!payload.title){ msg("Title is required.", false); return; }
  try{
    if(id){
      await api("/projects/" + id, { method:"PUT", body: JSON.stringify(payload) });
      msg("Project updated.");
    }else{
      await api("/projects", { method:"POST", body: JSON.stringify(payload) });
      msg("Project created.");
    }
    fillProjectForm(null);
    loadProjects();
  }catch(err){ msg(err.message, false); }
});

/* ---------- TESTIMONIALS ---------- */
async function loadTestimonials(){
  try{
    const json = await api("/testimonials");
    const body = document.getElementById("admin-testi-body");
    body.innerHTML = json.data.map(t=>`
      <tr>
        <td>${escapeHtml((t.quote||"").slice(0,60))}${(t.quote||"").length>60?"…":""}</td>
        <td>${escapeHtml(t.name)}</td>
        <td><button class="a-btn danger" data-del-t="${t._id}">Delete</button></td>
      </tr>`).join("") || `<tr><td colspan="3">No testimonials yet.</td></tr>`;
    body.querySelectorAll("[data-del-t]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        if(!confirm("Delete this testimonial?")) return;
        try{ await api("/testimonials/" + btn.dataset.delT, {method:"DELETE"}); loadTestimonials(); }
        catch(err){ msg(err.message, false); }
      });
    });
  }catch(err){ msg(err.message, false); }
}

document.getElementById("save-testi-btn").addEventListener("click", async ()=>{
  const payload = {
    quote: document.getElementById("t-quote").value.trim(),
    name: document.getElementById("t-name").value.trim(),
    role: document.getElementById("t-role").value.trim(),
    avatar: document.getElementById("t-avatar").value.trim()
  };
  if(!payload.quote || !payload.name){ msg("Quote and name are required.", false); return; }
  try{
    await api("/testimonials", { method:"POST", body: JSON.stringify(payload) });
    msg("Testimonial added.");
    ["t-quote","t-name","t-role","t-avatar"].forEach(id=>document.getElementById(id).value="");
    loadTestimonials();
  }catch(err){ msg(err.message, false); }
});

/* ---------- MESSAGES ---------- */
async function loadMessages(){
  try{
    const json = await api("/contact");
    const body = document.getElementById("admin-messages-body");
    body.innerHTML = json.data.map(m=>`
      <tr class="${m.read ? "" : "unread"}">
        <td>${new Date(m.createdAt).toLocaleDateString()}</td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td>${escapeHtml(m.projectType||"")}</td>
        <td>${escapeHtml((m.message||"").slice(0,80))}${(m.message||"").length>80?"…":""}</td>
        <td>
          ${!m.read ? `<button class="a-btn" data-read="${m._id}">Mark Read</button>` : ""}
          <button class="a-btn danger" data-del-m="${m._id}">Delete</button>
        </td>
      </tr>`).join("") || `<tr><td colspan="6">No messages yet.</td></tr>`;
    body.querySelectorAll("[data-read]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        try{ await api("/contact/" + btn.dataset.read, {method:"PUT", body: JSON.stringify({read:true})}); loadMessages(); }
        catch(err){ msg(err.message, false); }
      });
    });
    body.querySelectorAll("[data-del-m]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        if(!confirm("Delete this message?")) return;
        try{ await api("/contact/" + btn.dataset.delM, {method:"DELETE"}); loadMessages(); }
        catch(err){ msg(err.message, false); }
      });
    });
  }catch(err){ msg(err.message, false); }
}

function escapeHtml(str){
  return String(str||"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
