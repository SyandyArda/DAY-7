// 1. Impor library yang diperlukan
const express = require('express');
const path = require('path');
const crypto = require('crypto'); // Modul 'crypto' bawaan Node.js
const mysql = require('mysql2/promise'); // Menggunakan 'mysql2/promise' untuk async/await

// 2. Inisialisasi aplikasi Express
const app = express();
const port = 3000;

// 3. Setup Middleware
// (BARU) Middleware untuk membaca JSON dari body request (penting untuk Postman)
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// (BARU) 4. Konfigurasi Koneksi Database MySQL
// GANTI DENGAN DETAIL DATABASE ANDA
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',
    password: 'Arsyan290105',
    database: 'api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// (BARU) 5. Fungsi untuk generate key di sisi server
function generateServerApiKey(length = 32) {
    // Menghasilkan 32 byte data acak dan mengubahnya jadi string hex (64 karakter)
    return crypto.randomBytes(length).toString('hex');
}

// 6. Route untuk menyajikan halaman HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// (BARU) 7. Route untuk GENERATE dan MENYIMPAN key


// 9. Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log('Database terhubung (semoga).');
});