
# IITGEEPREP: Production Deployment Protocol v6.0

Follow these strict directory mappings to deploy the application to a production server (Hostinger, XAMPP, or VPS).

---

## 1. Directory Structure Mapping

Your server's root folder (usually `public_html` or `htdocs`) MUST look like this:

```text
/public_html/ (Server Root)
├── assets/             (Optimized frontend assets from 'dist/assets/')
├── api/                (CORE BACKEND GATEWAY)
│   ├── config/         (database.php - Update DB credentials here)
│   ├── controllers/    (Relational logic nodes)
│   ├── core/           (MVC Router & Base Controller)
│   ├── models/         (SQL Mapping Layer)
│   ├── sql/            (master_schema_v6.0.sql - IMPORT THIS FIRST)
│   ├── index.php       (Main Handshake Entry)
│   └── .htaccess       (Apache rewrite rules for clean URLs)
├── index.html          (The main single-page entry)
└── [Other static files]
```

---

## 2. Step-by-Step Execution

### Phase A: Frontend Build
1. Open your terminal in the project root.
2. Run `npm run build`. This creates the `dist/` directory.
3. Upload everything inside `dist/` to your server's root.

### Phase B: Backend API
1. Log in as **Admin** on your platform.
2. Go to **System Hub** -> **Deployment Blueprint**.
3. Download the **Production ZIP**.
4. Create an `api/` folder on your server and extract the ZIP there.

### Phase C: SQL Database
1. Open **phpMyAdmin** on your server.
2. Create a new database (e.g., `u123_jeepro_db`).
3. Import the `api/sql/master_schema_v6.0.sql` file.
4. Edit `api/config/database.php` with your database `host`, `username`, `password`, and `dbname`.

---

## 3. Global Activation

1. Visit your live domain.
2. Log in with the Master Key: `admin@jeepro.in`.
3. In the header, toggle **"Production (MySQL)"**.
4. The system will immediately start syncing all student telemetry to the relational database.

---

## 4. Key Configurations
- **PHP Requirements:** 8.2 or 8.3 (Ensures compatibility with typed models).
- **SSL Certificate:** Mandatory for secure data handshakes between parents and students.
- **Vite Base Path:** Ensure `vite.config.ts` has `base: './'` for subdirectory support.
