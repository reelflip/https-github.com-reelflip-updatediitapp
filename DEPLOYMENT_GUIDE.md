
# IITGEEPREP: Production Deployment Protocol v21.0

Follow these strict directory mappings and security steps to deploy the high-performance academic engine.

---

## 1. Directory Structure Mapping

Your server's root folder (usually `public_html` or `htdocs`) MUST look like this:

```text
/public_html/ (Server Root)
├── assets/             (Optimized frontend assets from 'dist/assets/')
├── api/                (CORE BACKEND GATEWAY)
│   ├── config/         (database.php - CONFIGURE DB HERE)
│   ├── controllers/    (Functional logic controllers)
│   ├── sql/            (master_schema_v21.sql - IMPORT FIRST)
│   └── index.php       (Main API Router)
├── index.html          (Main frontend entry point)
└── .htaccess           (For URL rewriting if using clean paths)
```

---

## 2. Step-by-Step Execution

### Phase A: Frontend Build
1. Run `npm run build` in your local project root.
2. Upload the contents of the `dist/` folder to your server's root.

### Phase B: Backend API
1. Log in as **Admin** on your platform (Demo key: `admin@demo.in`).
2. Go to **System Hub** -> **Deployment Blueprint**.
3. Download the **Production ZIP (v21)**.
4. Upload and extract the ZIP inside the `api/` folder on your server.

### Phase C: SQL Database Initialization
1. Open **phpMyAdmin**.
2. Create a database named `iitgrrprep_v21`.
3. Import `api/sql/master_schema_v21.sql`.
4. Edit `api/config/database.php` with your production MySQL credentials.

---

## 3. Global Activation

1. Visit your live domain.
2. Sign in as Admin.
3. In the header toggle, switch to **"Production (MySQL)"**.
4. The frontend will now bypass mock storage and perform real-time SQL persistence via the PHP gateway.

---

## 4. Hardening & Requirements
- **PHP Version:** 8.2+ is mandatory for proper Typed Response handling.
- **SSL (HTTPS):** Mandatory. The "Family Handshake" and "Login" modules require encryption for data integrity.
- **Vite Config:** Ensure `base: './'` is set in `vite.config.ts` if deploying to a subfolder.
- **Security Note:** In production, rename the `admin@demo.in` account and set a strong master key via the SQL `users` table.
