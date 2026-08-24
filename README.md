# Vinayak Mittal — Creative Portfolio

A premium, cinematic photography / videography / video editing / graphic
design portfolio, with a real Express + MongoDB backend and an admin
dashboard for managing the content.

- **Frontend:** vanilla HTML/CSS/JS (no build step), modular CSS + JS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Media storage:** Cloudinary (falls back to local disk storage under
  `server/uploads` if no Cloudinary credentials are set)
- **Admin auth:** JWT, bcrypt-hashed password

---

## 1. Requirements

- Node.js 18+
- A MongoDB database — either:
  - a local MongoDB server (`mongod`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't want to install MongoDB locally)
- (Optional but recommended) a free [Cloudinary](https://cloudinary.com) account, for image/video uploads from the admin dashboard. Without it, uploads are stored locally in `server/uploads/`.

## 2. Install

```bash
npm install
```

## 3. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | What it's for |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/kai-asher-portfolio` or an Atlas SRV URI. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard, under **Settings → API Keys**. Leave blank to use local disk storage instead. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The login for `/admin`. On first server start, an `Admin` account is created in MongoDB with this email and a **bcrypt-hashed** version of this password — it is never stored in plaintext. To change the password later, either delete the `Admin` document in your database and restart the server, or update it directly (hashed) via a script. |
| `JWT_SECRET` | Any long random string — used to sign admin login tokens. |
| `JWT_EXPIRES_IN` | How long an admin login session lasts (default `7d`). |
| `PORT` | Port the server runs on (default `3000`). |
| `CORS_ORIGIN` | Comma-separated list of origins allowed to call the API. Leave blank if the frontend is served by this same server (the default setup). |

**Never commit your `.env` file** — it's already in `.gitignore`.

## 4. Seed sample content (optional but recommended)

The site works with no data (the frontend has an offline fallback with
sample projects), but for the real, database-backed experience, seed it:

```bash
npm run seed
```

This creates:
- 4 categories (Photography, Videography, Editing, Graphic Design)
- 6 sample projects with real descriptions and placeholder imagery
- 3 client testimonials
- the Admin account from your `.env`

Re-running `npm run seed` is safe — it upserts by slug instead of duplicating.

## 5. Run it

```bash
npm start
```

This starts the Express server, which:
- connects to MongoDB
- serves the API at `/api/*`
- serves the frontend (everything in `client/`) at `/`
- serves the admin dashboard at `/admin`

Open **http://localhost:3000** in your browser.

For development with auto-restart on file changes:

```bash
npm run dev
```

> The frontend and backend are served from the same Express app — there's
> no separate frontend dev server to run.

## 6. Log into the admin dashboard

Go to **http://localhost:3000/admin** and log in with the `ADMIN_EMAIL`
and `ADMIN_PASSWORD` from your `.env` (after running `npm run seed`, or
after the server has started at least once with those variables set).

From the dashboard you can:
- **Projects** — add, edit, delete, mark as featured, reorder, set category
- **Testimonials** — add and delete client quotes
- **Contact Messages** — view, mark as read, and delete messages submitted through the site's contact form

## 7. Adding project images & videos

Two ways to get media into a project:

1. **Paste a URL** directly into the "Cover Image URL" / "Gallery Image URLs" fields in the admin form — works with any publicly hosted image or video URL, no Cloudinary needed.
2. **Upload a file** via `POST /api/upload` (multipart form field `file`, with your admin `Authorization: Bearer <token>` header). If Cloudinary is configured, files are uploaded there and you get back a Cloudinary URL; otherwise they're saved to `server/uploads/` and served at `/uploads/<filename>`. The admin UI currently accepts pasted URLs directly — wire this endpoint into a file `<input type="file">` if you'd like in-dashboard uploading with a picker.

## 8. Project structure

```
portfolio/
├── client/                 Frontend (static, no build step)
│   ├── index.html, work.html, about.html, contact.html, project.html, admin.html
│   ├── css/  (style.css, responsive.css, animations.css)
│   ├── js/   (main.js, animations.js, projects.js, gallery.js, admin.js, data-fallback.js)
│   └── assets/
├── server/
│   ├── server.js            Express app entry point
│   ├── config/               db.js, cloudinary.js
│   ├── models/                Project, Category, Testimonial, Contact, Admin
│   ├── routes/                 REST routes, one file per resource
│   ├── controllers/            Route handler logic
│   ├── middleware/             auth (JWT), upload (multer/Cloudinary), errorHandler
│   ├── utils/                   ensureAdmin.js, seed.js
│   └── uploads/                Local fallback storage for uploaded media
├── .env.example
├── package.json
└── README.md
```

## 9. API reference

All endpoints are prefixed with `/api`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Log in, returns a JWT |
| GET | `/projects` | — | List projects (`?category=` and `?featured=true` filters supported) |
| GET | `/projects/:id` | — | Get one project by id or slug |
| POST | `/projects` | admin | Create a project |
| PUT | `/projects/:id` | admin | Update a project |
| DELETE | `/projects/:id` | admin | Delete a project |
| GET | `/categories` | — | List categories |
| POST | `/categories` | admin | Create a category |
| GET | `/testimonials` | — | List testimonials |
| POST | `/testimonials` | admin | Add a testimonial |
| PUT | `/testimonials/:id` | admin | Update a testimonial |
| DELETE | `/testimonials/:id` | admin | Delete a testimonial |
| POST | `/contact` | — | Submit the contact form (rate-limited: 10/hour/IP) |
| GET | `/contact` | admin | List contact messages |
| PUT | `/contact/:id` | admin | Update a message (e.g. mark as read) |
| DELETE | `/contact/:id` | admin | Delete a message |
| POST | `/upload` | admin | Upload a file (`multipart/form-data`, field `file`) |
| GET | `/health` | — | Health check, reports Mongo connection state |

Admin routes require an `Authorization: Bearer <token>` header with the
token returned from `/auth/login`.

## 10. Deploying it

Any Node hosting platform works (Render, Railway, Fly.io, a VPS, etc.):

1. Push the repo, set the environment variables from `.env.example` in your host's dashboard (use a real MongoDB Atlas URI for `MONGODB_URI` in production).
2. Set the start command to `npm start`.
3. Run `npm run seed` once (via a one-off job/shell) if you want the sample content, or start adding your own projects through `/admin` right away.
4. Point your domain at the host, and make sure `CORS_ORIGIN` is set if you ever split the frontend onto a different domain than the API.

## 11. A note on this build & testing

Everything above — the frontend, the Express app, the Mongoose models,
routes, controllers, JWT auth, validation, rate limiting, and the static
file serving — was built and smoke-tested in this environment: the server
boots cleanly, every module loads without errors, protected routes
correctly reject missing/invalid tokens, the contact form's validation
rejects incomplete submissions, and all pages serve correctly with working
navigation, animations, filtering, and the lightbox.

The one thing that could **not** be exercised end-to-end here is the live
database round-trip (creating/reading/updating real documents), because
this sandboxed environment has no MongoDB server and no network access to
provision one. That part of the code follows standard, well-tested
Mongoose patterns, but you should run through the checklist below yourself
after connecting a real `MONGODB_URI`:

- [ ] `npm run seed` completes and prints "Seed complete"
- [ ] Home, Work, About and Contact pages load projects/testimonials from the API (check the Network tab — you should see calls to `/api/projects` and `/api/testimonials` succeed, not fall back to sample data)
- [ ] Filtering on the Work page shows/hides projects correctly
- [ ] Clicking a project opens its case-study page and lightbox gallery
- [ ] The contact form submits successfully and the message appears under **Admin → Contact Messages**
- [ ] Logging into `/admin` works with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Creating, editing and deleting a project in the admin dashboard is reflected on the public site after a refresh
