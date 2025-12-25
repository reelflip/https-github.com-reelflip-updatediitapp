# JEE-Prep Tracker Deployment Guide

This guide covers setting up your local environment and your production shared hosting.

---

## 1. Local Deployment (XAMPP)

1.  **Install XAMPP**: Ensure Apache and MySQL are running.
2.  **Database Setup**:
    *   Open `http://localhost/phpmyadmin`.
    *   Create a new database named `jeepro_db`.
    *   Click the **Import** tab and select the `deployment/setup.sql` file.
3.  **API Files**:
    *   Navigate to your XAMPP installation folder (usually `C:\xampp\htdocs\`).
    *   Create a folder named `api`.
    *   Copy the `deployment/api.php` file into this `api` folder.
4.  **Uplink**:
    *   In the JEE-Prep Dashboard, go to **System -> Data Utility Bridge**.
    *   Enable **Production Server Mode**.
    *   Logout and Login to verify data persistence.

---

## 2. Production Deployment (Hostinger Shared Hosting)

1.  **Database Creation**:
    *   Log in to your Hostinger hPanel.
    *   Go to **Databases -> MySQL Databases**.
    *   Create a database (e.g., `u123_jeepro`) and a user with a strong password.
    *   **Note down** the Database Name, User, and Password.
2.  **Schema Import**:
    *   Enter **phpMyAdmin** from the hPanel.
    *   Select your new database and import `deployment/setup.sql`.
3.  **API Configuration**:
    *   Open `api.php` in a text editor.
    *   Update the configuration section:
        ```php
        $db_host = "localhost"; // Usually localhost for Hostinger
        $db_name = "u123_jeepro"; // Your real DB name
        $db_user = "u123_user";   // Your real DB user
        $db_pass = "your_strong_password";
        ```
4.  **File Upload**:
    *   Go to **Files -> File Manager**.
    *   Open `public_html`.
    *   Create a folder named `api`.
    *   Upload the modified `api.php` into `public_html/api/`.
5.  **Frontend Config**:
    *   If your frontend is hosted separately, ensure `apiService.ts` BASE_URL points to `https://yourdomain.com/api/api.php`.
    *   Ensure CORS is active (the provided `api.php` already includes `Access-Control-Allow-Origin: *`).

---

## Troubleshooting
*   **404 Error**: Ensure the path in `apiService.ts` matches exactly where you uploaded `api.php`.
*   **Database Error**: Double-check credentials in `api.php`. Most shared hosts use "localhost", but some use custom IP addresses.
*   **Permission Error**: Ensure the `api` folder on your server has `755` permissions.