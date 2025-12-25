
# IITGEEPREP: Production Deployment Protocol v5.5.3

Follow these strict folder mapping rules to deploy the application to a production server (Hostinger, XAMPP, or any PHP/MySQL environment).

---

## 1. Directory Structure Mapping

Your server's root folder (usually `public_html` or `htdocs`) MUST follow this structure after deployment:

```text
/public_html/ (Server Root)
├── assets/             (Copy entire folder from your local 'dist/assets/')
├── api/                (CREATE THIS FOLDER and extract Build ZIP content here)
│   ├── config/         (database.php)
│   ├── controllers/    (18+ Controller logic files)
│   ├── core/           (Router.php and BaseController.php)
│   ├── models/         (18+ Data Model files)
│   ├── sql/            (master_schema_v5.5.3.sql)
│   ├── index.php       (Main API Gateway Entry)
│   ├── check.php       (System Health Check)
│   └── .htaccess       (Rewrites for Clean URLs)
├── index.html          (Copy from local 'dist/index.html')
└── [Other files]       (All other files from local 'dist/')
```

---

## 2. Step-by-Step Execution

### Phase A: Frontend (UI) Preparation
1. Open your local terminal in the project root.
2. Run `npm run build`. This generates the optimized `dist/` folder.
3. Upload the **entire contents** of the `dist/` folder to your server's root (`public_html/`).

### Phase B: Backend (API) Configuration
1. Log in to the **IITGEEPREP Admin Console** on your local/demo site.
2. Navigate to **System Hub** -> **Deployment Blueprint**.
3. Input your production Database credentials (Host, DB Name, User, Pass).
4. Click **"Download Build"** to get the `iitgeeprep-production-mvc-v5.5.3.zip`.
5. On your server, create an **`api/`** folder in the root.
6. Extract the ZIP contents directly into that **`api/`** folder.

### Phase C: Database Initialization
1. Open **phpMyAdmin** on your hosting control panel.
2. Select your production database.
3. Import the **`api/sql/master_schema_v5.5.3.sql`** file. This will create 40+ required relational tables with telemetry support.

---

## 3. Post-Deployment Handshake

1. Visit your live domain (e.g., `https://yourdomain.com`).
2. Log in as Admin (Email: `admin@jeepro.in`).
3. In the Admin Dashboard header, toggle **"Data Bridge"** to **Production (SQL)**.
4. The system will now stop using local browser storage and sync everything to your MySQL database.

---

## 4. Security & Maintenance
- **SSL Required:** Always use HTTPS to protect student/parent handshakes.
- **PHP Version:** Ensure your server is running **PHP 8.2 or higher**.
- **File Permissions:** Set `api/config/database.php` permissions to `640` for maximum security.
