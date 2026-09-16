let levelSekarang = 1;
const LEVEL_MAKSIMUM = 10;
let posisi = 0;
let arah = "kanan";
let daftarPerintah = [];
let rintanganAktif = [];
let rintanganDinamisTerakhir = null;
let jumlahPercobaan = 0;
let riwayatPercobaan = [];
let hasilSemuaLevel = [];
let rekapSemuaSiswa = [];
let identitasSiswa = {
    nama: "",
    kelas: ""
};
const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbxvIlgahmFFNayJ0n1JExfXzpsLqkRP_LquHyQpDRjU8dcwSdlmp5TMOwuLewHhsvHT/exec";

const KODE_KELAS = "IBURAHMA";

// ===============================
// AUDIO GERAK LOGIKA
// ===============================

const audioGame = {
    langkah: new Audio("assets/audio/langkah.wav"),
    klik: new Audio("assets/audio/klik.wav"),
    gagal: new Audio("assets/audio/gagal.wav"),
    peti: new Audio("assets/audio/peti.wav"),
    bintang: new Audio("assets/audio/bintang.wav")
};
audioGame.langkah.volume = 1.0;
audioGame.klik.volume = 0.35;
audioGame.gagal.volume = 0.7;
audioGame.peti.volume = 0.8;
audioGame.bintang.volume = 0.7;

function mainkanSuara(nama) {
    const audio = audioGame[nama];

    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
}
let permainanDimulai = false;

const dataLevel = {
    1: {
        posisiAwal: 0,
        arahAwal: "kanan",
        posisiTujuan: 3,
        rintangan: [],
        targetBlok: 1,
        konsepWajib: ["SEQUENCE", "LOOP"]
    },

    2: {
        posisiAwal: 0,
        arahAwal: "kanan",
        posisiTujuan: 15,
        rintangan: [5],
        targetBlok: 3,
        konsepWajib: ["SEQUENCE"]
    },

    3: {
        posisiAwal: 12,
        arahAwal: "kanan",
        posisiTujuan: 3,
        rintangan: [5, 6, 9],
        targetBlok: 5,
        konsepWajib: ["SEQUENCE", "LOOP"]
    },

    4: {
        posisiAwal: 0,
        arahAwal: "kanan",
        posisiTujuan: 5,
        rintangan: [2],
        targetBlok: 3,
        wajibKondisi: true,
        konsepWajib: ["SEQUENCE", "CONDITIONAL"]
    },
    5: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 11,

    rintangan: [
        0, 1, 2, 3,
        4, 5, 6,
        8, 9,
        15
    ],

    targetBlok: 5,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
},
6: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 3,

    rintangan: [
        0, 1, 2,
        4, 5, 6,
        8, 9,
        15
    ],

    targetBlok: 7,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
},
7: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 3,

    rintangan: [
        0, 1, 2,
        4,
        8,
        10, 11,
        14, 15
    ],

    targetBlok: 7,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
},
8: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 2,

    rintangan: [
        0, 1,
        4,
        8,
        11,
        15
    ],

    rintanganDinamis: [5, 10],

    targetBlok: 8,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
},
9: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 3,

    rintangan: [
        0, 1,
        4,
        8,
        11,
        15
    ],

    rintanganDinamis: [5, 10],

    targetBlok: 10,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
},
10: {
    posisiAwal: 12,
    arahAwal: "kanan",
    posisiTujuan: 3,

    rintangan: [
        1,
        4,
        8,
        11,
        15
    ],

    rintanganDinamis: [5, 10],

    targetBlok: 11,
    wajibKondisi: true,
    konsepWajib: ["SEQUENCE", "LOOP", "CONDITIONAL"]
}
};

const kotak = document.querySelectorAll(".arena div");
const tampilanPerintah = document.getElementById("daftar-perintah");
const statusGame = document.getElementById("status-game");
const hasilSemuaLevelTampilan =
    document.getElementById("hasil-semua-level");
const rekapKelasTampilan =
    document.getElementById("rekap-kelas");
    const judulLevel = document.getElementById("judul-level");
const daftarLevelTampilan =
    document.getElementById("daftar-level");
    const jumlahBlok = document.getElementById("jumlah-blok");
const targetBlok = document.getElementById("target-blok");
const jumlahPercobaanTampilan = document.getElementById("jumlah-percobaan");
const riwayatPercobaanTampilan = document.getElementById("riwayat-percobaan");
const statusDebugging = document.getElementById("status-debugging");
const perkembanganAlgoritma =
    document.getElementById("perkembangan-algoritma");
function tampilkanRiwayatPercobaan() {
    jumlahPercobaanTampilan.textContent = jumlahPercobaan;
    riwayatPercobaanTampilan.innerHTML = "";

    riwayatPercobaan.forEach((item, index) => {
        const p = document.createElement("p");

        p.textContent =
            "Percobaan " + (index + 1) +
            " | " + item.hasil +
            " | " + item.blok + " blok";

        riwayatPercobaanTampilan.appendChild(p);
    });
}
function analisisDebugging() {

    if (riwayatPercobaan.length === 0) {
        statusDebugging.textContent = "Belum ada data";
        return;
    }

    const percobaanTerakhir =
        riwayatPercobaan[riwayatPercobaan.length - 1];

    if (
        jumlahPercobaan === 1 &&
        percobaanTerakhir.hasil === "Berhasil"
    ) {
        statusDebugging.textContent =
            "Solusi langsung ditemukan";
    }

    else if (
        jumlahPercobaan > 1 &&
        percobaanTerakhir.hasil === "Berhasil"
    ) {
        statusDebugging.textContent =
            "Berhasil memperbaiki algoritma";
    }

    else {
        statusDebugging.textContent =
            "Masih melakukan debugging";
    }
}
function analisisPerkembangan() {

    if (riwayatPercobaan.length < 2) {
        perkembanganAlgoritma.textContent =
            "Butuh lebih dari satu percobaan";
        return;
    }

    const percobaanSebelumnya =
        riwayatPercobaan[riwayatPercobaan.length - 2];

    const percobaanTerakhir =
        riwayatPercobaan[riwayatPercobaan.length - 1];

    if (percobaanTerakhir.blok < percobaanSebelumnya.blok) {
        perkembanganAlgoritma.textContent =
            "Semakin efisien";
    }

    else if (percobaanTerakhir.blok === percobaanSebelumnya.blok) {
        perkembanganAlgoritma.textContent =
            "Efisiensi belum berubah";
    }

    else {
        perkembanganAlgoritma.textContent =
            "Menggunakan lebih banyak blok";
    }
}
function ambilLevel() {
    return dataLevel[levelSekarang];
}

function simbolKarakter() {
    if (arah === "kanan") return "assets/geka/geka-kanan.png";
    if (arah === "bawah") return "assets/geka/geka-depan.png";
    if (arah === "kiri") return "assets/geka/geka-kiri.png";
    if (arah === "atas") return "assets/geka/geka-belakang.png";
}
function siapkanRintanganLevel() {

    const level = ambilLevel();

    rintanganAktif = [...level.rintangan];

    if (
        level.rintanganDinamis &&
        level.rintanganDinamis.length > 0
    ) {

        let pilihanTersedia =
            level.rintanganDinamis.filter(
                posisi =>
                    posisi !== rintanganDinamisTerakhir
            );

        // Jika belum ada pilihan sebelumnya,
        // gunakan semua posisi yang tersedia
        if (pilihanTersedia.length === 0) {
            pilihanTersedia =
                level.rintanganDinamis;
        }

        const pilihanBaru =
            pilihanTersedia[
                Math.floor(
                    Math.random() *
                    pilihanTersedia.length
                )
            ];

        rintanganDinamisTerakhir =
            pilihanBaru;

        rintanganAktif.push(
            pilihanBaru
        );
    }
}
function gambarRintangan(index) {

    const daftarRintangan = [
        "assets/obstacles/batu.png",
        "assets/obstacles/semak.png",
        "assets/obstacles/jamur.png",
        "assets/obstacles/pohon.png",
        "assets/obstacles/batang-kayu.png",
        "assets/obstacles/pagar.png"
    ];

    const pilihan =
        (index + levelSekarang) % daftarRintangan.length;

    return daftarRintangan[pilihan];
}
function tampilkanArena() {
    const level = ambilLevel();

    kotak.forEach((item, index) => {
        item.textContent = "";

        if (rintanganAktif.includes(index)) {

    const rintangan = document.createElement("img");

    rintangan.src = gambarRintangan(index);
    rintangan.alt = "Rintangan";
    rintangan.className = "rintangan-game";

    item.innerHTML = "";
    item.appendChild(rintangan);
}

        if (index === level.posisiTujuan) {

    const peti = document.createElement("img");

    peti.src = "assets/treasure/peti-tutup.png";
    peti.alt = "Peti Harta";
    peti.className = "peti-target";

    item.innerHTML = "";
    item.appendChild(peti);
}
    });

    const gambarGeka = document.createElement("img");

gambarGeka.src = simbolKarakter();
gambarGeka.alt = "Geka";
gambarGeka.className = "geka-karakter";

kotak[posisi].innerHTML = "";
kotak[posisi].appendChild(gambarGeka);
}

function tambahPerintah(perintah) {

    if (!permainanDimulai) {
        alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
        return;
    }

    daftarPerintah.push(perintah);
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function hapusPerintahTerakhir() {
    daftarPerintah.pop();
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}

function hapusSemuaPerintah() {
    daftarPerintah = [];
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function ulangiPerintahTerakhir(jumlah) {
    if (!permainanDimulai) {
    alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
    return;
}
    if (daftarPerintah.length === 0) return;

    const perintahTerakhir = daftarPerintah.pop();

    daftarPerintah.push({
        tipe: "ULANGI",
        jumlah: jumlah,
        perintah: perintahTerakhir
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function ulangiDuaPerintahTerakhir(jumlah) {
    if (!permainanDimulai) {
    alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
    return;
}
    if (daftarPerintah.length < 2) return;

    const perintah2 = daftarPerintah.pop();
    const perintah1 = daftarPerintah.pop();

    daftarPerintah.push({
        tipe: "ULANGI_BLOK",
        jumlah: jumlah,
        perintah: [perintah1, perintah2]
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function tambahKondisiRintanganKanan() {
    if (!permainanDimulai) {
    alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
    return;
}
    daftarPerintah.push({
        tipe: "JIKA_RINTANGAN",
        aksi: "KANAN"
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function tambahKondisiRintanganKiri() {
    if (!permainanDimulai) {
    alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
    return;
}
    daftarPerintah.push({
        tipe: "JIKA_RINTANGAN",
        aksi: "KIRI"
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function tambahKondisiJalanKosongMaju() {
    if (!permainanDimulai) {
    alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
    return;
}
    daftarPerintah.push({
        tipe: "JIKA_JALAN_KOSONG",
        aksi: "MAJU"
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function tambahPercabangan() {

    if (!permainanDimulai) {
        alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
        return;
    }

    daftarPerintah.push({
        tipe: "PERCABANGAN",
        jikaRintangan: "KIRI",
        jikaTidak: "MAJU"
    });
    mainkanSuara("klik");
    tampilkanDaftarPerintah();
}
function tampilkanDaftarPerintah() {
    tampilanPerintah.innerHTML = "";

    daftarPerintah.forEach((item, index) => {
        const span = document.createElement("span");

        if (typeof item === "string") {
            span.textContent = item;
        }

        else if (item.tipe === "ULANGI") {
            span.textContent =
                "ULANGI " +
                item.jumlah +
                "x { " +
                item.perintah +
                " }";
        }

        else if (item.tipe === "ULANGI_BLOK") {
            span.textContent =
                "ULANGI " +
                item.jumlah +
                "x { " +
                item.perintah.join(", ");
        }
        else if (item.tipe === "JIKA_RINTANGAN") {
            span.textContent =
                "JIKA ADA RINTANGAN { " +
                item.aksi +
                " }";
        }
        else if (item.tipe === "JIKA_JALAN_KOSONG") {
    span.textContent =
        "JIKA JALAN KOSONG { " +
        item.aksi +
        " }";
}
else if (item.tipe === "PERCABANGAN") {
    span.textContent =
        "JIKA RINTANGAN { " +
        item.jikaRintangan +
        " } JIKA TIDAK { " +
        item.jikaTidak +
        " }";
}

        tampilanPerintah.appendChild(span);

        if (index < daftarPerintah.length - 1) {
    tampilanPerintah.append(", ");
}
    });
}
 {
    const level = ambilLevel();

    let baris = Math.floor(posisi / 4);
    let kolom = posisi % 4;
    let posisiDepan = posisi;

    if (arah === "kanan" && kolom < 3) {
        posisiDepan++;
    }
}
function cekRintanganDiDepan() {
    const level = ambilLevel();

    const baris = Math.floor(posisi / 4);
    const kolom = posisi % 4;

    let posisiDepan = null;

    if (arah === "kanan") {
        if (kolom < 3) {
            posisiDepan = posisi + 1;
        }
    }

    else if (arah === "kiri") {
        if (kolom > 0) {
            posisiDepan = posisi - 1;
        }
    }

    else if (arah === "bawah") {
        if (baris < 3) {
            posisiDepan = posisi + 4;
        }
    }

    else if (arah === "atas") {
        if (baris > 0) {
            posisiDepan = posisi - 4;
        }
    }

    if (posisiDepan === null) {
        return false;
    }

    return rintanganAktif.includes(posisiDepan);
}
function maju() {
    const level = ambilLevel();

    let baris = Math.floor(posisi / 4);
    let kolom = posisi % 4;
    let posisiBaru = posisi;

    if (arah === "kanan" && kolom < 3) posisiBaru++;
    else if (arah === "kiri" && kolom > 0) posisiBaru--;
    else if (arah === "bawah" && baris < 3) posisiBaru += 4;
    else if (arah === "atas" && baris > 0) posisiBaru -= 4;

    if (rintanganAktif.includes(posisiBaru)) {
    statusGame.textContent = "🚧 Menabrak rintangan!";
    mainkanSuara("gagal");
    return false;
}

    posisi = posisiBaru;
mainkanSuara("langkah");
tampilkanArena();

return true;
}

function belokKiri() {
    if (arah === "kanan") arah = "atas";
    else if (arah === "atas") arah = "kiri";
    else if (arah === "kiri") arah = "bawah";
    else if (arah === "bawah") arah = "kanan";

    tampilkanArena();
}

function belokKanan() {
    if (arah === "kanan") arah = "bawah";
    else if (arah === "bawah") arah = "kiri";
    else if (arah === "kiri") arah = "atas";
    else if (arah === "atas") arah = "kanan";

    tampilkanArena();
}

async function jalankanPerintah() {

    if (!permainanDimulai) {
        alert("Isi nama dan kelas, lalu klik Mulai Bermain.");
        return;
    }

    statusGame.textContent = "";

    jumlahPercobaan++;
    tampilkanRiwayatPercobaan();

    for (let item of daftarPerintah) {

        // PERINTAH BIASA
        if (typeof item === "string") {

            const berhasil =
                await jalankanSatuPerintah(item);

            if (!berhasil) {
                simpanPercobaan("Menabrak rintangan");
                return;
            }
        }

        // LOOP SATU PERINTAH
        else if (item.tipe === "ULANGI") {

            for (let i = 0; i < item.jumlah; i++) {

                const berhasil =
                    await jalankanSatuPerintah(item.perintah);

                if (!berhasil) {
                    simpanPercobaan("Menabrak rintangan");
                    return;
                }
            }
        }

        // LOOP BLOK
        else if (item.tipe === "ULANGI_BLOK") {

            for (let i = 0; i < item.jumlah; i++) {

                for (let perintah of item.perintah) {

                    const berhasil =
                        await jalankanSatuPerintah(perintah);

                    if (!berhasil) {
                        simpanPercobaan("Menabrak rintangan");
                        return;
                    }
                }
            }
        }

        // CONDITIONAL RINTANGAN
        else if (item.tipe === "JIKA_RINTANGAN") {

            if (cekRintanganDiDepan()) {

                if (item.aksi === "KANAN") {
                    belokKanan();
                    await tunggu(500);
                }

                else if (item.aksi === "KIRI") {
                    belokKiri();
                    await tunggu(500);
                }
            }
        }

        // CONDITIONAL JALAN KOSONG
        else if (item.tipe === "JIKA_JALAN_KOSONG") {

            if (!cekRintanganDiDepan()) {

                const berhasil =
                    await jalankanSatuPerintah("MAJU");

                if (!berhasil) {
                    simpanPercobaan("Menabrak rintangan");
                    return;
                }
            }
        }

        // PERCABANGAN IF - ELSE
        else if (item.tipe === "PERCABANGAN") {

            const adaRintangan =
                cekRintanganDiDepan();

            if (adaRintangan) {

                if (item.jikaRintangan === "KIRI") {
                    belokKiri();
                    await tunggu(500);
                }

                else if (item.jikaRintangan === "KANAN") {
                    belokKanan();
                    await tunggu(500);
                }
            }

            else {

                if (item.jikaTidak === "MAJU") {

                    const berhasil =
                        await jalankanSatuPerintah("MAJU");

                    if (!berhasil) {
                        simpanPercobaan("Menabrak rintangan");
                        return;
                    }
                }
            }
        }
    }

    cekHasil();
}
function simpanPercobaan(hasil) {

    const strategi = analisisStrategiCT();

    riwayatPercobaan.push({
        hasil: hasil,
        blok: daftarPerintah.length,

        strategi: {
            sequence: strategi.sequence,
            loop: strategi.loop,
            conditional: strategi.conditional
        }
    });

    tampilkanRiwayatPercobaan();
    analisisDebugging();
    analisisPerkembangan();
}
function analisisStrategiCT() {
    let memakaiSequence = false;
    let memakaiLoop = false;
    let memakaiConditional = false;

    daftarPerintah.forEach(item => {

        // PERINTAH BIASA
        if (typeof item === "string") {
            memakaiSequence = true;
        }

        // LOOP SATU PERINTAH
        else if (item.tipe === "ULANGI") {
            memakaiLoop = true;

            // Di dalam loop tetap ada instruksi berurutan
            memakaiSequence = true;
        }

        // LOOP BEBERAPA PERINTAH
        else if (item.tipe === "ULANGI_BLOK") {
            memakaiLoop = true;

            if (
                Array.isArray(item.perintah) &&
                item.perintah.length > 0
            ) {
                memakaiSequence = true;
            }
        }

        // CONDITIONAL
        else if (
    item.tipe === "JIKA_RINTANGAN" ||
    item.tipe === "JIKA_JALAN_KOSONG" ||
    item.tipe === "PERCABANGAN"
) {
    memakaiConditional = true;
}
    });

    return {
        sequence: memakaiSequence,
        loop: memakaiLoop,
        conditional: memakaiConditional
    };
}
function simpanHasilLevel() {

    const level = ambilLevel();
    const strategi = analisisStrategiCT();
    const nilai = hitungNilaiLevel();

    const dataHasil = {
        nama: identitasSiswa.nama,
        kelas: identitasSiswa.kelas,

        level: levelSekarang,
        percobaan: jumlahPercobaan,
        blok: daftarPerintah.length,
        targetBlok: level.targetBlok,

        strategi: {
            sequence: strategi.sequence,
            loop: strategi.loop,
            conditional: strategi.conditional
        },

        nilai: {
            ketepatan: nilai.ketepatan,
            efisiensi: nilai.efisiensi,
            konsepCT: nilai.konsepCT,
            debugging: nilai.debugging,
            total: nilai.total
        },

        riwayat: [...riwayatPercobaan]
    };

    const indexLevel = hasilSemuaLevel.findIndex(
        item => item.level === levelSekarang
    );

    if (indexLevel === -1) {
        hasilSemuaLevel.push(dataHasil);
    } else {
        hasilSemuaLevel[indexLevel] = dataHasil;
    }
    simpanDataLokal();
}
function hitungNilaiLevel() {
    const level = ambilLevel();

    // 1. KETEPATAN - maksimal 35
    const skorKetepatan = 35;

    // 2. EFISIENSI - maksimal 25
    const blokDipakai = daftarPerintah.length;
    const target = level.targetBlok;

    let skorEfisiensi = 0;

    if (blokDipakai <= target) {
        skorEfisiensi = 25;
    }
    else if (blokDipakai === target + 1) {
        skorEfisiensi = 20;
    }
    else if (blokDipakai === target + 2) {
        skorEfisiensi = 15;
    }
    else {
        skorEfisiensi = 10;
    }

    // 3. KONSEP CT - maksimal 25
    const strategi = analisisStrategiCT();
    const konsepWajib = level.konsepWajib || [];

    let konsepTerpenuhi = 0;

    konsepWajib.forEach(konsep => {

        if (
            konsep === "SEQUENCE" &&
            strategi.sequence
        ) {
            konsepTerpenuhi++;
        }

        else if (
            konsep === "LOOP" &&
            strategi.loop
        ) {
            konsepTerpenuhi++;
        }

        else if (
            konsep === "CONDITIONAL" &&
            strategi.conditional
        ) {
            konsepTerpenuhi++;
        }
    });

    let skorCT = 25;

    if (konsepWajib.length > 0) {
        skorCT =
            Math.round(
                (konsepTerpenuhi / konsepWajib.length) * 25
            );
    }

    // 4. DEBUGGING - maksimal 15
    let skorDebugging = 0;

    if (jumlahPercobaan === 1) {
        skorDebugging = 15;
    }
    else {
        const percobaanTerakhir =
            riwayatPercobaan[riwayatPercobaan.length - 1];

        const percobaanSebelumnya =
            riwayatPercobaan[riwayatPercobaan.length - 2];

        if (
            percobaanSebelumnya &&
            percobaanTerakhir.blok <
            percobaanSebelumnya.blok
        ) {
            skorDebugging = 15;
        }
        else {
            skorDebugging = 10;
        }
    }

    const total =
        skorKetepatan +
        skorEfisiensi +
        skorCT +
        skorDebugging;

    return {
        ketepatan: skorKetepatan,
        efisiensi: skorEfisiensi,
        konsepCT: skorCT,
        debugging: skorDebugging,
        total: total
    };
}
async function jalankanSatuPerintah(perintah) {
    let berhasilJalan = true;

    if (perintah === "MAJU") {
        berhasilJalan = maju();
    }

    else if (perintah === "KIRI") {
        belokKiri();
    }

    else if (perintah === "KANAN") {
        belokKanan();
    }

    await tunggu(500);

    return berhasilJalan;
}

function cekHasil() {
    const level = ambilLevel();

    // =========================================
    // BERHASIL SAMPAI TUJUAN
    // =========================================
    if (posisi === level.posisiTujuan) {

        // CEK APAKAH LEVEL MEWAJIBKAN CONDITIONAL
        if (level.wajibKondisi === true) {

            const memakaiKondisi = daftarPerintah.some(item =>
                typeof item === "object" &&
                (
                    item.tipe === "JIKA_RINTANGAN" ||
                    item.tipe === "JIKA_JALAN_KOSONG" ||
                    item.tipe === "PERCABANGAN"
                )
            );

            if (!memakaiKondisi) {
                simpanPercobaan("Belum menggunakan conditional");

                statusGame.textContent =
                    "🎯 Tujuan tercapai, tetapi level ini harus diselesaikan menggunakan conditional.";

                return;
            }
        }

        // SIMPAN PERCOBAAN BERHASIL
        simpanPercobaan("Berhasil");

        // =========================================
        // PETI TERBUKA
        // =========================================
        const petakTujuan = kotak[level.posisiTujuan];

        petakTujuan.innerHTML = "";

        const petiTerbuka = document.createElement("img");

        petiTerbuka.src = "assets/treasure/peti-buka.png";
        petiTerbuka.alt = "Peti Harta Terbuka";
        petiTerbuka.className = "peti-target peti-terbuka";

        petakTujuan.appendChild(petiTerbuka);

        mainkanSuara("peti");

        // =========================================
        // BINTANG
        // =========================================
        const hasilBintang = tentukanBintang(
            daftarPerintah.length,
            level.targetBlok
        );

        const efekBintang = document.createElement("div");

        efekBintang.className = "bintang-kemenangan";
        efekBintang.textContent = hasilBintang.bintang;

        petakTujuan.appendChild(efekBintang);

        mainkanSuara("bintang");

        // =========================================
        // SIMPAN HASIL
        // =========================================
        simpanHasilLevel();
        simpanSiswaKeRekap();
        simpanDataLokal();
        tampilkanPemilihLevel();

        // =========================================
        // HITUNG EFISIENSI
        // =========================================
        const blokDipakai = daftarPerintah.length;
        const target = level.targetBlok;

        let bintang = "";

        if (blokDipakai <= target) {
            bintang = "⭐⭐⭐";
        }
        else if (blokDipakai === target + 1) {
            bintang = "⭐⭐";
        }
        else {
            bintang = "⭐";
        }

        statusGame.innerHTML =
            "🎉 Berhasil! Level selesai!<br>" +
            "Efisiensi algoritma: " + bintang +
            "<br>" +
            "Blok digunakan: " + blokDipakai +
            "<br>" +
            "Target optimal: " + target;

        // =========================================
        // LEVEL 1–9
        // =========================================
        if (levelSekarang < LEVEL_MAKSIMUM) {

            const tombolNext =
                document.getElementById("tombol-next");

            if (tombolNext) {
                tombolNext.style.display = "inline-block";
            }
        }

        // =========================================
        // LEVEL 10 — FINAL
        // =========================================
        if (levelSekarang === LEVEL_MAKSIMUM) {

            // Kirim hasil akhir ke Google Sheet
            kirimHasilKeDatabase();

            // Tampilkan ending setelah animasi selesai
            setTimeout(() => {
                tampilkanEnding();
            }, 1200);
        }

    }

    // =========================================
    // BELUM SAMPAI TUJUAN
    // =========================================
    else {

        simpanPercobaan("Belum berhasil");

        statusGame.textContent =
            "Belum berhasil. Coba perbaiki algoritmamu!";
    }
}
function tunggu(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function tampilkanFiturSesuaiLevel() {

    const grupLoop =
        document.getElementById("grup-loop");

    const grupKondisi =
        document.getElementById("grup-kondisi");

    const grupPercabangan =
        document.getElementById("grup-percabangan");

    // Level 1: gerakan dasar saja
    grupLoop.style.display =
        levelSekarang >= 2 ? "block" : "none";

    // Level 4 ke atas: conditional mulai muncul
    grupKondisi.style.display =
        levelSekarang >= 4 ? "block" : "none";

    // Level 8 ke atas: branching mulai muncul
    grupPercabangan.style.display =
        levelSekarang >= 8 ? "block" : "none";
}
function resetGame() {
    const level = ambilLevel();
    siapkanRintanganLevel();
judulLevel.textContent = "Level " + levelSekarang;
tampilkanFiturSesuaiLevel();
    posisi = level.posisiAwal;
    arah = level.arahAwal;
    daftarPerintah = [];
function hitungBlok() {
    jumlahBlok.textContent = daftarPerintah.length;

    const level = ambilLevel();
    targetBlok.textContent = level.targetBlok;
}
    tampilkanDaftarPerintah();
    statusGame.textContent = "";
    document.getElementById("tombol-next").style.display = "none";

    tampilkanArena();
    hitungBlok();
}

function levelBerikutnya() {
    if (levelSekarang < LEVEL_MAKSIMUM) {
        levelSekarang++;
        simpanDataLokal();

        jumlahPercobaan = 0;
        riwayatPercobaan = [];
        statusDebugging.textContent = "Belum ada data";
        perkembanganAlgoritma.textContent = "Belum ada data";

        judulLevel.textContent = "Level " + levelSekarang;

        resetGame();
        tampilkanRiwayatPercobaan();
    }
}
function tentukanBintang(blokDigunakan, targetBlok) {

    if (blokDigunakan <= targetBlok) {
        return {
            bintang: "⭐⭐⭐",
            feedback: "Hebat! Algoritmamu sangat efisien."
        };
    }

    if (blokDigunakan <= targetBlok + 2) {
        return {
            bintang: "⭐⭐",
            feedback: "Berhasil! Coba optimalkan lagi agar lebih efisien."
        };
    }

    return {
        bintang: "⭐",
        feedback: "Tujuan tercapai. Coba susun algoritma yang lebih ringkas."
    };
}
function tampilkanHasilSemuaLevel() {

    hasilSemuaLevelTampilan.innerHTML = "";
const identitas = document.createElement("div");

identitas.innerHTML =
    "<h2>👤 Identitas Siswa</h2>" +
    "<p>Nama: <strong>" +
    identitasSiswa.nama +
    "</strong></p>" +
    "<p>Kelas: <strong>" +
    identitasSiswa.kelas +
    "</strong></p>" +
    "<hr>";

hasilSemuaLevelTampilan.appendChild(identitas);
    if (hasilSemuaLevel.length === 0) {
        hasilSemuaLevelTampilan.textContent =
            "Belum ada level yang diselesaikan.";
        return;
    }

    hasilSemuaLevel.forEach(data => {

        const bagianLevel =
            document.createElement("div");

        const sequence =
            data.strategi.sequence ? "✅" : "❌";

        const loop =
            data.strategi.loop ? "✅" : "❌";

        const conditional =
            data.strategi.conditional ? "✅" : "❌";

        const hasilBintang = tentukanBintang(
    data.blok,
    data.targetBlok
);
            bagianLevel.innerHTML =
            "<h3>Level " + data.level + "</h3>" +

            "<p>Percobaan: " +
            data.percobaan + "</p>" +

            "<p>Blok digunakan: " +
            data.blok + "</p>" +

            "<p>Target optimal: " +
            data.targetBlok + "</p>" +

            "<p>Sequence: " +
            sequence + "</p>" +

            "<p>Loop: " +
            loop + "</p>" +

            "<p>Conditional: " +
            conditional + "</p>" +

            "<div style='font-size:32px; margin-top:10px;'>" +
hasilBintang.bintang +
"</div>" +

"<p><strong>" +
hasilBintang.feedback +
"</strong></p>" +
            "<h4>📊 Nilai</h4>" +

            "<p>Ketepatan: " +
            data.nilai.ketepatan + "/35</p>" +

            "<p>Efisiensi: " +
            data.nilai.efisiensi + "/25</p>" +

            "<p>Konsep CT: " +
            data.nilai.konsepCT + "/25</p>" +

            "<p>Debugging: " +
            data.nilai.debugging + "/15</p>" +

            "<p><strong>Nilai Level: " +
            data.nilai.total +
            "/100</strong></p>" +

            "<hr>";

        hasilSemuaLevelTampilan.appendChild(
            bagianLevel
        );
    });


    // NILAI AKHIR SISWA
    const nilaiAkhir = hitungNilaiAkhir();

    const kategori =
        tentukanKategoriNilai(nilaiAkhir);

    const profilCT = analisisProfilCT();
        const ringkasan =
        document.createElement("div");

    ringkasan.innerHTML =
    "<h2>🏆 Ringkasan Hasil</h2>" +

    "<p>Level diselesaikan: " +
    hasilSemuaLevel.length +
    "</p>" +

    "<p><strong>Nilai Akhir: " +
    nilaiAkhir +
    "/100</strong></p>" +

    "<p>Kategori: <strong>" +
    kategori +
    "</strong></p>" +

    "<h3>🧠 Profil Computational Thinking</h3>" +

    "<p>Sequence: <strong>" +
    profilCT.sequence +
    "</strong></p>" +

    "<p>Loop: <strong>" +
    profilCT.loop +
    "</strong></p>" +

    "<p>Conditional: <strong>" +
    profilCT.conditional +
    "</strong></p>";

    hasilSemuaLevelTampilan.appendChild(
        ringkasan
    );
}
function hitungNilaiAkhir() {

    if (hasilSemuaLevel.length === 0) {
        return 0;
    }

    let totalNilai = 0;

    hasilSemuaLevel.forEach(data => {
        totalNilai += data.nilai.total;
    });

    const rataRata =
        totalNilai / hasilSemuaLevel.length;

    return Math.round(rataRata);
}
function tentukanKategoriNilai(nilai) {

    if (nilai >= 90) {
        return "Sangat Baik";
    }

    else if (nilai >= 80) {
        return "Baik";
    }

    else if (nilai >= 70) {
        return "Cukup";
    }

    else {
        return "Perlu Pendampingan";
    }
}
function analisisProfilCT() {

    if (hasilSemuaLevel.length === 0) {
        return {
            sequence: "Belum ada data",
            loop: "Belum ada data",
            conditional: "Belum ada data"
        };
    }

    function hitungProfilKonsep(namaKonsep) {

        const levelRelevan = hasilSemuaLevel.filter(data => {

            const dataLevelIni = dataLevel[data.level];

            return (
                dataLevelIni.konsepWajib &&
                dataLevelIni.konsepWajib.includes(namaKonsep)
            );
        });

        if (levelRelevan.length === 0) {
            return "Belum dinilai";
        }

        let terpenuhi = 0;

        levelRelevan.forEach(data => {

            if (
                namaKonsep === "SEQUENCE" &&
                data.strategi.sequence
            ) {
                terpenuhi++;
            }

            else if (
                namaKonsep === "LOOP" &&
                data.strategi.loop
            ) {
                terpenuhi++;
            }

            else if (
                namaKonsep === "CONDITIONAL" &&
                data.strategi.conditional
            ) {
                terpenuhi++;
            }
        });

        const persentase =
            (terpenuhi / levelRelevan.length) * 100;

        if (persentase >= 80) {
            return "Sangat Baik";
        }

        else if (persentase >= 60) {
            return "Baik";
        }

        else if (persentase >= 40) {
            return "Cukup";
        }

        else {
            return "Perlu Dikembangkan";
        }
    }

    return {
        sequence: hitungProfilKonsep("SEQUENCE"),
        loop: hitungProfilKonsep("LOOP"),
        conditional: hitungProfilKonsep("CONDITIONAL")
    };
}
    function kategoriStrategi(jumlah) {
        const persentase =
            (jumlah / totalLevel) * 100;

        if (persentase >= 80) {
            return "Sangat Baik";
        }

        else if (persentase >= 60) {
            return "Baik";
        }

        else if (persentase >= 40) {
            return "Cukup";
        }

        else {
            return "Perlu Dikembangkan";
        }
    }
function mulaiBermain() {
    sembunyikanHasilSiswa();

    const namaInput =
        document.getElementById("nama-siswa").value.trim();

    const kelasInput =
        document.getElementById("kelas-siswa").value.trim();

    if (namaInput === "" || kelasInput === "") {
        alert("Nama dan kelas harus diisi terlebih dahulu.");
        return;
    }

    identitasSiswa.nama = namaInput;
    identitasSiswa.kelas = kelasInput;
    const pemainLama = rekapSemuaSiswa.find(
    siswa =>
        siswa.nama === namaInput &&
        siswa.kelas === kelasInput
);

if (pemainLama) {
    alert(
        "Data pemain ini sudah ada. " +
        "Silakan pilih Lanjutkan Permainan agar progres tetap tersimpan."
    );
    return;
}

    hasilSemuaLevel = [];
    jumlahPercobaan = 0;
    riwayatPercobaan = [];

    levelSekarang = 1;
    permainanDimulai = true;
    document.getElementById("form-identitas").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    resetGame();
    simpanDataLokal();

    alert(
        "Selamat bermain, " +
        identitasSiswa.nama +
        "!"
    );
}
function simpanDataLokal() {

    const dataGame = {
        identitasSiswa: identitasSiswa,
        hasilSemuaLevel: hasilSemuaLevel,
        rekapSemuaSiswa: rekapSemuaSiswa,
        levelSekarang: levelSekarang,
        permainanDimulai: permainanDimulai
    };

    localStorage.setItem(
        "gerakLogikaData",
        JSON.stringify(dataGame)
    );
}

function muatDataLokal() {

    const dataTersimpan =
        localStorage.getItem("gerakLogikaData");

    if (!dataTersimpan) {
        return;
    }

    const dataGame =
        JSON.parse(dataTersimpan);

    identitasSiswa =
        dataGame.identitasSiswa || {
            nama: "",
            kelas: ""
        };

    hasilSemuaLevel =
        dataGame.hasilSemuaLevel || [];

        rekapSemuaSiswa =
    dataGame.rekapSemuaSiswa || [];
    levelSekarang =
        dataGame.levelSekarang || 1;

    permainanDimulai =
        dataGame.permainanDimulai || false;

    // Kembalikan identitas ke kolom
    const namaInput =
        document.getElementById("nama-siswa");

    const kelasInput =
        document.getElementById("kelas-siswa");

    if (namaInput) {
        namaInput.value =
            identitasSiswa.nama || "";
    }

    if (kelasInput) {
        kelasInput.value =
            identitasSiswa.kelas || "";
    }
}

function simpanSiswaKeRekap() {

    if (
        identitasSiswa.nama === "" ||
        hasilSemuaLevel.length === 0
    ) {
        return;
    }

    const dataSiswa = {
        nama: identitasSiswa.nama,
        kelas: identitasSiswa.kelas,
        nilaiAkhir: hitungNilaiAkhir(),
        kategori: tentukanKategoriNilai(
            hitungNilaiAkhir()
        ),
        profilCT: analisisProfilCT(),
        hasilLevel: [...hasilSemuaLevel]
    };

    const indexSiswa = rekapSemuaSiswa.findIndex(
        siswa =>
            siswa.nama === identitasSiswa.nama &&
            siswa.kelas === identitasSiswa.kelas
    );

    if (indexSiswa === -1) {
        rekapSemuaSiswa.push(dataSiswa);
    } else {
        rekapSemuaSiswa[indexSiswa] = dataSiswa;
    }
}
function gantiPemain() {

    if (!permainanDimulai) {
        alert("Belum ada pemain yang sedang bermain.");
        return;
    }

    simpanSiswaKeRekap();

    identitasSiswa = {
        nama: "",
        kelas: ""
    };

    hasilSemuaLevel = [];
    jumlahPercobaan = 0;
    riwayatPercobaan = [];

    levelSekarang = 1;
    permainanDimulai = false;
    document.getElementById("form-identitas").style.display = "flex";
    document.getElementById("game-screen").style.display = "none";

    document.getElementById("nama-siswa").value = "";
    document.getElementById("kelas-siswa").value = "";

    hasilSemuaLevelTampilan.innerHTML =
        "Belum ada level yang diselesaikan.";

    resetGame();
    simpanDataLokal();

    alert(
        "Hasil pemain sebelumnya sudah disimpan. " +
        "Silakan masukkan pemain berikutnya."
    );
}
function tampilkanRekapKelas() {

    rekapKelasTampilan.innerHTML = "";

    if (rekapSemuaSiswa.length === 0) {
        rekapKelasTampilan.textContent =
            "Belum ada data siswa dalam rekap.";
        return;
    }

    let html = `
        <h2>📊 Rekap Kelas</h2>

        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Kelas</th>
                    <th>Level Selesai</th>
                    <th>Nilai Akhir</th>
                    <th>Kategori</th>
                    <th>Sequence</th>
                    <th>Loop</th>
                    <th>Conditional</th>
                    <th>⭐ Efisiensi</th>
<th>Total Percobaan</th>
                </tr>
            </thead>

            <tbody>
    `;

    rekapSemuaSiswa.forEach((siswa, index) => {
        let totalPercobaan = 0;
let totalEfisiensi = 0;

siswa.hasilLevel.forEach(level => {
    totalPercobaan += level.percobaan;

    const selisih =
        level.blok - level.targetBlok;

    if (selisih <= 0) {
        totalEfisiensi += 3;
    }
    else if (selisih <= 2) {
        totalEfisiensi += 2;
    }
    else {
        totalEfisiensi += 1;
    }
});

const rataEfisiensi =
    siswa.hasilLevel.length > 0
        ? totalEfisiensi / siswa.hasilLevel.length
        : 0;

let bintangEfisiensi = "⭐";

if (rataEfisiensi >= 2.5) {
    bintangEfisiensi = "⭐⭐⭐";
}
else if (rataEfisiensi >= 1.5) {
    bintangEfisiensi = "⭐⭐";
}

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${siswa.nama}</td>
                <td>${siswa.kelas}</td>
                <td>${siswa.hasilLevel.length}</td>
                <td>${siswa.nilaiAkhir}</td>
                <td>${siswa.kategori}</td>
                <td>${siswa.profilCT.sequence}</td>
                <td>${siswa.profilCT.loop}</td>
                <td>${siswa.profilCT.conditional}</td>
                <td>${bintangEfisiensi}</td>
<td>${totalPercobaan}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    rekapKelasTampilan.innerHTML = html;
}
function lanjutkanPermainan() {
    sembunyikanHasilSiswa();

    const namaInput =
        document.getElementById("nama-siswa").value.trim();

    const kelasInput =
        document.getElementById("kelas-siswa").value.trim();

    if (namaInput === "" || kelasInput === "") {
        alert("Masukkan nama dan kelas terlebih dahulu.");
        return;
    }

    const siswaLama = rekapSemuaSiswa.find(
        siswa =>
            siswa.nama === namaInput &&
            siswa.kelas === kelasInput
    );

    if (!siswaLama) {
        alert(
            "Data pemain tidak ditemukan. " +
            "Silakan klik Mulai Bermain untuk memulai permainan baru."
        );
        return;
    }

    identitasSiswa = {
        nama: siswaLama.nama,
        kelas: siswaLama.kelas
    };

    hasilSemuaLevel =
        siswaLama.hasilLevel
            ? [...siswaLama.hasilLevel]
            : [];

    jumlahPercobaan = 0;
    riwayatPercobaan = [];

    permainanDimulai = true;
    document.getElementById("form-identitas").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    // Lanjut ke level setelah level terakhir yang selesai
    if (hasilSemuaLevel.length > 0) {

        const levelTerakhir =
            Math.max(
                ...hasilSemuaLevel.map(
                    item => item.level
                )
            );

        levelSekarang = levelTerakhir + 1;

        // Untuk sementara game kita baru punya 4 level
        if (levelSekarang > LEVEL_MAKSIMUM) {
            levelSekarang = LEVEL_MAKSIMUM;

            alert(
                "Semua level yang tersedia sudah diselesaikan."
            );
        }
    }
    else {
        levelSekarang = 1;
    }

    const judulLevel =
        document.getElementById("judul-level");

    if (judulLevel) {
        judulLevel.textContent =
            "Level " + levelSekarang;
    }

    resetGame();
    simpanDataLokal();

    alert(
        "Selamat datang kembali, " +
        identitasSiswa.nama +
        "! Lanjut ke Level " +
        levelSekarang +
        "."
    );
}
function downloadRekapKelas() {

    if (rekapSemuaSiswa.length === 0) {
        alert("Belum ada data siswa yang dapat diunduh.");
        return;
    }

    const header = [
        "No",
        "Nama",
        "Kelas",
        "Level Selesai",
        "Nilai Akhir",
        "Kategori",
        "Sequence",
        "Loop",
        "Conditional",
        "Efisiensi",
        "Total Percobaan"
    ];

    const baris = [];

    baris.push(header);

    rekapSemuaSiswa.forEach((siswa, index) => {

        let totalPercobaan = 0;
        let totalEfisiensi = 0;

        siswa.hasilLevel.forEach(level => {

            totalPercobaan += level.percobaan;

            const selisih =
                level.blok - level.targetBlok;

            if (selisih <= 0) {
                totalEfisiensi += 3;
            }
            else if (selisih <= 2) {
                totalEfisiensi += 2;
            }
            else {
                totalEfisiensi += 1;
            }
        });

        const rataEfisiensi =
            siswa.hasilLevel.length > 0
                ? totalEfisiensi / siswa.hasilLevel.length
                : 0;

        let bintangEfisiensi = "⭐";

        if (rataEfisiensi >= 2.5) {
            bintangEfisiensi = "⭐⭐⭐";
        }
        else if (rataEfisiensi >= 1.5) {
            bintangEfisiensi = "⭐⭐";
        }

        baris.push([
            index + 1,
            siswa.nama,
            siswa.kelas,
            siswa.hasilLevel.length,
            siswa.nilaiAkhir,
            siswa.kategori,
            siswa.profilCT.sequence,
            siswa.profilCT.loop,
            siswa.profilCT.conditional,
            bintangEfisiensi,
            totalPercobaan
        ]);
    });

    const csv = baris
        .map(row =>
            row.map(cell => {

                const nilai =
                    String(cell ?? "")
                        .replace(/"/g, '""');

                return `"${nilai}"`;

            }).join(";")
        )
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "Rekap_GERAK_LOGIKA.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
function hitungLevelProgres() {

    if (hasilSemuaLevel.length === 0) {
        return 1;
    }

    const levelTertinggiSelesai =
        Math.max(
            ...hasilSemuaLevel.map(
                data => data.level
            )
        );

    return Math.min(
        levelTertinggiSelesai + 1,
        LEVEL_MAKSIMUM
    );
}


function tampilkanPemilihLevel() {

    daftarLevelTampilan.innerHTML = "";

    const levelProgres =
        hitungLevelProgres();

    for (
        let nomor = 1;
        nomor <= LEVEL_MAKSIMUM;
        nomor++
    ) {

        const tombol =
            document.createElement("button");

        const sudahSelesai =
            hasilSemuaLevel.some(
                data => data.level === nomor
            );

        // LEVEL YANG SUDAH SELESAI
        if (sudahSelesai) {

            tombol.textContent =
                "✅ " + nomor;

            tombol.onclick = function () {
                pilihLevel(nomor);
            };
        }

        // LEVEL PROGRES SAAT INI
        else if (nomor === levelProgres) {

            tombol.textContent =
                "▶️ " + nomor;

            tombol.onclick = function () {
                pilihLevel(nomor);
            };
        }

        // LEVEL TERKUNCI
        else {

            tombol.textContent =
                "🔒 " + nomor;

            tombol.disabled = true;
        }

        daftarLevelTampilan.appendChild(
            tombol
        );
    }
}


function pilihLevel(nomorLevel) {
    sembunyikanHasilSiswa();
    nomorLevel = Number(nomorLevel);

    const levelProgres =
        hitungLevelProgres();

    const sudahSelesai =
        hasilSemuaLevel.some(
            data => data.level === nomorLevel
        );

    if (
        !sudahSelesai &&
        nomorLevel !== levelProgres
    ) {
        alert(
            "Selesaikan level sebelumnya terlebih dahulu."
        );
        return;
    }

    levelSekarang = nomorLevel;

    jumlahPercobaan = 0;
    riwayatPercobaan = [];

    resetGame();
    simpanDataLokal();
    tampilkanPemilihLevel();
}
muatDataLokal();
resetGame();
tampilkanPemilihLevel();
function tampilkanEnding() {
    const ending = document.getElementById("ending-game");

    if (ending) {
        ending.style.display = "flex";
    }
}

function tutupEndingDanLihatHasil() {
    const ending = document.getElementById("ending-game");

    if (ending) {
        ending.style.display = "none";
    }

    // Buat isi hasil Level 1–10
    tampilkanHasilSemuaLevel();

    // Tampilkan panel hasil siswa
    const hasil = document.getElementById("hasil-semua-level");

    if (hasil) {
        const panelHasil = hasil.closest(".student-result");

        if (panelHasil) {
            panelHasil.style.display = "block";
        }

        hasil.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
const PIN_GURU = "4154";

function bukaLoginGuru() {
    document.getElementById("login-guru").style.display = "flex";

    const input = document.getElementById("pin-guru");
    input.value = "";
    input.focus();
}

function tutupLoginGuru() {
    document.getElementById("login-guru").style.display = "none";
}

function masukModeGuru() {
    const pin = document.getElementById("pin-guru").value;

    if (pin !== PIN_GURU) {
        alert("PIN Guru salah.");
        return;
    }

    tutupLoginGuru();

    // Simpan pemain aktif dulu jika ada
    if (
        permainanDimulai &&
        identitasSiswa.nama !== "" &&
        hasilSemuaLevel.length > 0
    ) {
        simpanSiswaKeRekap();
        simpanDataLokal();
    }

    // Sembunyikan tampilan siswa
    const hasilSiswa = document.getElementById("hasil-semua-level");

    if (hasilSiswa) {
        const panelSiswa = hasilSiswa.closest(".student-result");

        if (panelSiswa) {
            panelSiswa.style.display = "none";
        }

        hasilSiswa.style.display = "none";
    }

    // Buat rekap kelas
    tampilkanRekapKelas();

    const rekap = document.getElementById("rekap-kelas");

    if (rekap) {
        rekap.style.display = "block";

        // Jadikan rekap sebagai layar guru
        rekap.style.position = "fixed";
        rekap.style.inset = "0";
        rekap.style.zIndex = "99999";
        rekap.style.background = "#f4f8fc";
        rekap.style.overflowY = "auto";
        rekap.style.padding = "20px";
    }
}
async function kirimHasilKeDatabase() {

    if (hasilSemuaLevel.length === 0) {
        return;
    }

    const profilCT = analisisProfilCT();

    let totalPercobaan = 0;
    let totalEfisiensi = 0;
    let totalBlok = 0;

    // Siapkan nilai Level 1-10
    const nilaiLevel = Array(10).fill("");

    // Siapkan percobaan Level 1-10
    const percobaanLevel = Array(10).fill("");

    hasilSemuaLevel.forEach(data => {

        // Masukkan nilai sesuai nomor level
        if (data.level >= 1 && data.level <= 10) {

            nilaiLevel[data.level - 1] =
                data.nilai.total;

            percobaanLevel[data.level - 1] =
                data.percobaan;
        }

        // Total percobaan
        totalPercobaan +=
            Number(data.percobaan) || 0;

        // Total blok
        totalBlok +=
            Number(data.blok) || 0;

        // Hitung efisiensi
        const selisih =
            data.blok - data.targetBlok;

        if (selisih <= 0) {
            totalEfisiensi += 3;
        }
        else if (selisih <= 2) {
            totalEfisiensi += 2;
        }
        else {
            totalEfisiensi += 1;
        }
    });

    // Bintang efisiensi keseluruhan
    const rataEfisiensi =
        totalEfisiensi / hasilSemuaLevel.length;

    let efisiensi = "⭐";

    if (rataEfisiensi >= 2.5) {
        efisiensi = "⭐⭐⭐";
    }
    else if (rataEfisiensi >= 1.5) {
        efisiensi = "⭐⭐";
    }

    const nilaiAkhir =
        hitungNilaiAkhir();

    const data = {

        kodeKelas: KODE_KELAS,

        nama:
            identitasSiswa.nama,

        kelas:
            identitasSiswa.kelas,

        levelSelesai:
            hasilSemuaLevel.length,

        // DATA PER LEVEL
        nilaiLevel:
            nilaiLevel,

        percobaanLevel:
            percobaanLevel,

        // RINGKASAN
        nilaiAkhir:
            nilaiAkhir,

        kategori:
            tentukanKategoriNilai(nilaiAkhir),

        sequence:
            profilCT.sequence,

        loop:
            profilCT.loop,

        conditional:
            profilCT.conditional,

        efisiensi:
            efisiensi,

        totalPercobaan:
            totalPercobaan,

        totalBlok:
            totalBlok,

        status:
            hasilSemuaLevel.length >= LEVEL_MAKSIMUM
                ? "SELESAI"
                : "BELUM SELESAI"
    };

    try {

        await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify(data)
        });

        console.log(
            "✅ Hasil asesmen berhasil dikirim ke database."
        );

    }
    catch (error) {

        console.error(
            "❌ Gagal mengirim hasil:",
            error
        );
    }
}
function sembunyikanHasilSiswa() {
    const hasil = document.getElementById("hasil-semua-level");

    if (hasil) {
        const panelHasil = hasil.closest(".student-result");

        if (panelHasil) {
            panelHasil.style.display = "none";
        }

        hasil.style.display = "";
    }
}