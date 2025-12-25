# JEE-Prep Tracker: Professional Deployment Protocol

Follow these strict folder mapping rules to deploy the application to a production server (Hostinger, XAMPP, or any PHP/MySQL environment).

---

## 1. Directory Structure Mapping

Your server's root folder (usually `public_html` or `htdocs`) should follow this structure after deployment:

```text
/public_html/
├── assets/             (Copy entire folder from local 'dist/assets/')
├── api/                (Extracted folder from the Master Build ZIP)
│   ├── config/         (Contains database.php)
│   ├── controllers/    (Contains 18+ Controller files)
│   ├── core/           (Contains Router.php and BaseController.php)
│   ├── models/         (Contains 18+ Model files)
│   ├── sql/            (Contains master_schema.sql)
│   ├── index.php       (Main API Gateway)
│   └── .htaccess       (Routing configuration)
├── index.html          (Copy from local 'dist/index.html')
└── [Other UI files]    (Copy all files from local 'dist/')
```

---

## 2. Step-by-Step Execution

### Phase A: Frontend (UI) Preparation
1.  Open your local terminal and run:
    ```bash
    npm install
    npm run build
    ```
2.  Open your server via FTP or File Manager.
3.  Upload the **entire contents** of your local `dist/` folder into the server's root (`public_html/`).

### Phase B: Backend (API) Configuration
1.  Log in to the **IITGEEPREP Admin Console** (Default email: `admin@jeepro.in` in Mock mode).
2.  Navigate to **System** -> **Deployment Control**.
3.  Enter your Production Database Credentials (Host, DB Name, User, Password).
4.  Click **"Download Build ZIP"** to get the `jeepro-api-complete-v18.0.zip`.
5.  Upload this ZIP to your server's root and **Extract** it. This creates the `api/` directory.

### Phase C: Database Initialization
1.  Open **phpMyAdmin** on your hosting panel.
2.  Select your target database.
3.  Navigate to the `api/sql/` folder on your server or in your ZIP.
4.  Import **`master_schema.sql`**. This will automatically create all 40+ required relational tables.

---

## 3. Post-Deployment Activation

1.  Visit your domain (e.g., `https://your-jee-prep.com`).
2.  Log in as Admin.
3.  Navigate to **System** -> **Data Bridge**.
4.  Toggle **"Production Server Mode"** to active. 
    *   *Effect:* The app will stop using Browser LocalStorage and start syncing with your PHP/MySQL backend.

---

## 4. Security Recommendations
*   **SSL:** Always use HTTPS to protect student/parent data.
*   **Permissions:** Set `api/config/database.php` to `600` or `640` to prevent unauthorized file reads.
*   **Obfuscation:** You can rename the `api/` folder to something unique for extra security (remember to update `apiService.ts` to match).
