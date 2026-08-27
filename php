<?php
// Konfigurasi Database
$host     = "localhost";
$user     = "root";
$password = "";
$dbname   = "db_ipnu_ippnu"; // Sesuaikan dengan nama database Anda

// Membuat koneksi ke database
$conn = new mysqli($host, $user, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Cek apakah data dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari form dan amankan dari SQL Injection dasar
    $nama_pemohon = $conn->real_escape_string($_POST['nama_pemohon']);
    $instansi     = $conn->real_escape_string($_POST['instansi']);
    $layanan      = $conn->real_escape_string($_POST['layanan']);
    $keterangan   = $conn->real_escape_string($_POST['keterangan']);
    $tanggal      = date("Y-m-d H:i:s");

    // Query SQL untuk menyimpan data ke tabel (contoh tabel: pengajuan_sk)
    $sql = "INSERT INTO pengajuan_sk (nama_pemohon, instansi, jenis_layanan, keterangan, tanggal_buat) 
            VALUES ('$nama_pemohon', '$instansi', '$layanan', '$keterangan', '$tanggal')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
                alert('Data berhasil disimpan!');
                window.location.href = 'layanan.html';
              </script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Tutup koneksi database
$conn->close();
?>