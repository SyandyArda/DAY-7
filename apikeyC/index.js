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
app.post('/generate-key', async (req, res) => {
    try {
        const newKey = generateServerApiKey();

        // Simpan key ke database
        const [result] = await pool.query(
            'INSERT INTO api_keys (api_key) VALUES (?)', 
            [newKey]
        );

        console.log(`Key baru disimpan ke DB. ID: ${result.insertId}`);

        // Kirim key baru kembali ke frontend
        res.status(201).json({ success: true, apiKey: newKey });

    } catch (error) {
        console.error('Gagal menyimpan key:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat key di server.' });
    }
});

// (MODIFIKASI) 8. Route untuk VALIDASI key (untuk Postman)
app.post('/checkapi', async (req, res) => {
    // Ambil key dari body JSON
    const { apikey } = req.body; 

    if (!apikey) {
        return res.status(400).json({ success: false, message: 'API key is required' });
    }

    try {
        // Cek apakah key ada di database
        const [rows] = await pool.query(
            'SELECT api_key FROM api_keys WHERE api_key = ?', 
            [apikey]
        );

        // Jika rows.length > 0, berarti key ditemukan
        if (rows.length > 0) {
            return res.json({ success: true, message: 'Valid API key' });
        } else {
            return res.status(404).json({ success: false, message: 'Invalid API key' });
        }

    } catch (error) {
        console.error('Error saat validasi key:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 9. Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log('Database terhubung (semoga).');
});