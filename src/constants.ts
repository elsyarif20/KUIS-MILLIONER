
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation?: string;
}

export interface PrizeLevel {
  level: number;
  prize: string;
  isSafePoint: boolean;
}

export const PRIZE_LADDER: PrizeLevel[] = [
  { level: 15, prize: "Rp 1 Miliar", isSafePoint: true },
  { level: 14, prize: "Rp 500 Juta", isSafePoint: false },
  { level: 13, prize: "Rp 250 Juta", isSafePoint: false },
  { level: 12, prize: "Rp 125 Juta", isSafePoint: false },
  { level: 11, prize: "Rp 64 Juta", isSafePoint: false },
  { level: 10, prize: "Rp 32 Juta", isSafePoint: true },
  { level: 9, prize: "Rp 16 Juta", isSafePoint: false },
  { level: 8, prize: "Rp 8 Juta", isSafePoint: false },
  { level: 7, prize: "Rp 4 Juta", isSafePoint: false },
  { level: 6, prize: "Rp 2 Juta", isSafePoint: false },
  { level: 5, prize: "Rp 1 Juta", isSafePoint: true },
  { level: 4, prize: "Rp 500.000", isSafePoint: false },
  { level: 3, prize: "Rp 300.000", isSafePoint: false },
  { level: 2, prize: "Rp 200.000", isSafePoint: false },
  { level: 1, prize: "Rp 100.000", isSafePoint: false },
];

export const QUIZ_DATA: Question[] = [
  {
    id: 1,
    text: 'Lafad zikir sesudah salat yang artinya "Maha Suci Allah" adalah...',
    options: ["Alhamdulillah", "Allahu Akbar", "Subhanallah", "Astaghfirullah"],
    correctAnswer: 2,
    explanation: "Subhanallah artinya Maha Suci Allah."
  },
  {
    id: 2,
    text: "Seorang laki-laki yang mendapat wahyu dari Allah Swt untuk dirinya sendiri dan wajib menyampaikan kepada umatnya disebut...",
    options: ["Malaikat", "Nabi", "Rasul", "Wali"],
    correctAnswer: 2,
    explanation: "Rasul adalah nabi yang wajib menyampaikan wahyu kepada umatnya."
  },
  {
    id: 3,
    text: "Kitab yang diturunkan Allah Swt kepada Nabi Isa AS adalah...",
    options: ["Taurat", "Zabur", "Injil", "Al-Quran"],
    correctAnswer: 2,
    explanation: "Nabi Isa AS menerima kitab Injil."
  },
  {
    id: 4,
    text: "Gelar yang diterima Nabi Muhammad SAW sejak kecil karena kejujurannya adalah...",
    options: ["Al-Faruq", "Al-Amin", "As-Siddiq", "Dzinnurain"],
    correctAnswer: 1,
    explanation: "Al-Amin artinya yang terpercaya."
  },
  {
    id: 5,
    text: "Nabi yang memiliki mukjizat tidak hangus ketika dibakar oleh Raja Namrud adalah...",
    options: ["Nabi Ibrahim AS", "Nabi Musa AS", "Nabi Isa AS", "Nabi Nuh AS"],
    correctAnswer: 0,
    explanation: "Nabi Ibrahim AS selamat dari api Raja Namrud."
  },
  {
    id: 6,
    text: "Siapa nama ibu susuan yang paling lama menyusui Nabi Muhammad SAW ketika bayi?",
    options: ["Siti Aminah", "Suwaibah Aslamiyah", "Halimatus Sa'diyah", "Ummu Aiman"],
    correctAnswer: 2,
    explanation: "Halimatus Sa'diyah dari bani Sa'ad merawat Nabi selama 4 tahun."
  },
  {
    id: 7,
    text: "Nabi yang bertugas membantu dan menyertai Nabi Musa AS dalam berdakwah adalah...",
    options: ["Nabi Yusuf AS", "Nabi Harun AS", "Nabi Ilyas AS", "Nabi Daud AS"],
    correctAnswer: 1,
    explanation: "Nabi Harun AS adalah saudara sekaligus pembantu dakwah Nabi Musa AS."
  },
  {
    id: 8,
    text: "Adanya alam semesta beserta isinya merupakan bukti bahwa Allah memiliki sifat...",
    options: ["Qidam", "Baqa", "Wujud", "Wahdaniyah"],
    correctAnswer: 2,
    explanation: "Wujud artinya ada."
  },
  {
    id: 9,
    text: "Siapa nama Pendeta yang menemui Abu Thalib dan berpesan agar menjaga baik-baik Muhammad?",
    options: ["Warqah bin Naufal", "Bukhaira", "Salman Al-Farisi", "Zaid bin Amr"],
    correctAnswer: 1,
    explanation: "Pendeta Bukhaira melihat tanda kenabian pada Muhammad kecil."
  },
  {
    id: 10,
    text: "Siapakah yang menyertai Nabi Muhammad SAW ketika melaksanakan peristiwa Isra Mi'raj?",
    options: ["Malaikat Mikail", "Malaikat Israfil", "Malaikat Jibril", "Abu Bakar Ash-Shiddiq"],
    correctAnswer: 2,
    explanation: "Malaikat Jibril mendampingi Rasulullah hingga Sidratul Muntaha."
  },
  {
    id: 11,
    text: "Nabi Muhammad SAW digelari 'Khotaminnabiyyin', yang artinya adalah...",
    options: ["Keluarga Nabi", "Sahabat Nabi", "Nabi yang Mulia", "Nabi Penutup/Terakhir"],
    correctAnswer: 3,
    explanation: "Khotaminnabiyyin artinya penutup para nabi."
  },
  {
    id: 12,
    text: "Keberadaan Allah tidak terdahului oleh siapapun, karena Allah memiliki sifat...",
    options: ["Qidam", "Baqa", "Mukhalafatu lil hawadisi", "Iradat"],
    correctAnswer: 0,
    explanation: "Qidam artinya terdahulu atau tanpa permulaan."
  },
  {
    id: 13,
    text: "Kitab suci yang berfungsi sebagai penyempurna terhadap ajaran-ajaran kitab sebelumnya adalah...",
    options: ["Taurat", "Zabur", "Injil", "Al-Quran"],
    correctAnswer: 3,
    explanation: "Al-Quran adalah kitab terakhir dan penyempurna."
  },
  {
    id: 14,
    text: "Orang pertama yang masuk Islam dari kalangan wanita adalah...",
    options: ["Siti Khodijah", "Siti Aisyah", "Fatimah Az-Zahra", "Siti Aminah"],
    correctAnswer: 0,
    explanation: "Siti Khodijah binti Khuwailid adalah istri dan pendukung pertama Rasulullah."
  },
  {
    id: 15,
    text: "Hukum membaca surat Al-Fatihah dalam shalat adalah...",
    options: ["Sunat", "Mubah", "Rukun Shalat", "Syarat Sah"],
    correctAnswer: 2,
    explanation: "Membaca Al-Fatihah adalah rukun shalat yang tidak boleh ditinggalkan."
  },
  {
    id: 16,
    text: "Nabi yang mampu menghidangkan makanan dari langit atas izin Allah adalah...",
    options: ["Nabi Musa AS", "Nabi Isa AS", "Nabi Sulaiman AS", "Nabi Daud AS"],
    correctAnswer: 1,
    explanation: "Nabi Isa AS memiliki mukjizat Al-Ma'idah (hidangan dari langit)."
  },
  {
    id: 17,
    text: "Bulan terakhir dalam kalender Hijriah adalah...",
    options: ["Ramadhan", "Muharram", "Syawal", "Zulhijjah"],
    correctAnswer: 3,
    explanation: "Zulhijjah adalah bulan ke-12 Hijriah."
  },
  {
    id: 18,
    text: "Nabi Muhammad SAW menerima wahyu Al-Quran pertama kali melalui malaikat...",
    options: ["Jibril", "Mikail", "Israfil", "Izrail"],
    correctAnswer: 0,
    explanation: "Malaikat Jibril adalah penyampai wahyu kepada para Nabi."
  },
  {
    id: 19,
    text: "Kejadian luar biasa yang diberikan Allah kepada para Nabi sebagai bukti kenabian disebut...",
    options: ["Sihir", "Karomah", "Mukjizat", "Ilham"],
    correctAnswer: 2,
    explanation: "Mukjizat adalah kejadian luar biasa untuk para Nabi."
  },
  {
    id: 20,
    text: "Nabi Muhammad SAW menikah dengan Siti Khadijah ketika beliau berusia...",
    options: ["20 tahun", "25 tahun", "30 tahun", "40 tahun"],
    correctAnswer: 1,
    explanation: "Nabi menikah pada usia 25 tahun, Khadijah berusia 40 tahun."
  },
  {
    id: 21,
    text: "Gelar 'Al-Faruq' yang berarti pembeda antara haq dan bathil diberikan kepada...",
    options: ["Abu Bakar", "Umar bin Khattab", "Usman bin Affan", "Ali bin Abi Thalib"],
    correctAnswer: 1,
    explanation: "Umar bin Khattab dijuluki Al-Faruq."
  },
  {
    id: 22,
    text: "Masjid pertama yang dibangun oleh Nabi Muhammad SAW dalam perjalanan hijrah adalah...",
    options: ["Masjid Nabawi", "Masjidil Haram", "Masjid Quba", "Masjidil Aqsa"],
    correctAnswer: 2,
    explanation: "Masid Quba dibangun saat Nabi tiba di pinggiran Madinah."
  },
  {
    id: 23,
    text: "Nama asli kota Madinah sebelum Nabi Muhammad SAW hijrah ke sana adalah...",
    options: ["Makkah", "Yatsrib", "Thaif", "Habsy"],
    correctAnswer: 1,
    explanation: "Kota tersebut dinamai Madinah Al-Munawwarah setelah hijrah."
  },
  {
    id: 24,
    text: "Paman Nabi yang tetap mendukung dakwah Nabi meskipun belum memeluk Islam sampai akhir hayat adalah...",
    options: ["Abu Lahab", "Abu Bakar", "Abu Thalib", "Hamzah"],
    correctAnswer: 2,
    explanation: "Abu Thalib sangat melindungi Nabi meski tidak bersyahadat."
  },
  {
    id: 25,
    text: "Zakat yang wajib dikeluarkan setiap jiwa Muslim pada bulan Ramadhan disebut...",
    options: ["Zakat Mal", "Zakat Perniagaan", "Zakat Fitrah", "Zakat Profesi"],
    correctAnswer: 2,
    explanation: "Zakat Fitrah dikeluarkan sebelum shalat Idul Fitri."
  },
  {
    id: 26,
    text: "Nama pedang terkenal milik Ali bin Abi Thalib yang digunakan dalam perang adalah...",
    options: ["Zulfikar", "Al-Battar", "Dhu al-Faqar", "Al-Qadib"],
    correctAnswer: 0,
    explanation: "Zulfikar adalah pedang legendaris Ali bin Abi Thalib."
  },
  {
    id: 27,
    text: "Berapakah jumlah rakaat shalat fardu dalam sehari semalam?",
    options: ["11 rakaat", "15 rakaat", "17 rakaat", "21 rakaat"],
    correctAnswer: 2,
    explanation: "Subuh (2), Zuhur (4), Ashar (4), Maghrib (3), Isya (4) total 17."
  },
  {
    id: 28,
    text: "Sifat wajib bagi Rasul yang berarti 'menyampaikan' adalah...",
    options: ["Siddiq", "Amanah", "Tabligh", "Fathonah"],
    correctAnswer: 2,
    explanation: "Tabligh artinya menyampaikan wahyu kepada umat."
  },
  {
    id: 29,
    text: "Malaikat yang bertugas meniup sangkakala pada hari kiamat adalah...",
    options: ["Jibril", "Mikail", "Israfil", "Izrail"],
    correctAnswer: 2,
    explanation: "Malaikat Israfil bertugas meniup sangkakala."
  },
  {
    id: 30,
    text: "Golongan yang berhak menerima zakat (asnaf) berjumlah...",
    options: ["5 golongan", "8 golongan", "10 golongan", "12 golongan"],
    correctAnswer: 1,
    explanation: "Ada 8 asnaf penerima zakat menurut Al-Quran."
  },
  {
    id: 31,
    text: "Surah dalam Al-Quran yang dijuluki sebagai 'Jantung Al-Quran' adalah...",
    options: ["Al-Fatihah", "Al-Baqarah", "Yasin", "Al-Ikhlas"],
    correctAnswer: 2,
    explanation: "Surah Yasin sering disebut sebagai jantungnya Al-Quran."
  },
  {
    id: 32,
    text: "Nabi yang memiliki mukjizat bisa berbicara dengan hewan adalah...",
    options: ["Nabi Sulaiman AS", "Nabi Daud AS", "Nabi Ibrahim AS", "Nabi Nuh AS"],
    correctAnswer: 0,
    explanation: "Nabi Sulaiman AS mengerti bahasa semut dan burung."
  },
  {
    id: 33,
    text: "Peristiwa hijrahnya Nabi Muhammad SAW terjadi dari kota Makkah ke...",
    options: ["Yaman", "Thaif", "Madinah", "Habsy"],
    correctAnswer: 2,
    explanation: "Nabi hijrah ke Madinah (Yatsrib)."
  },
  {
    id: 34,
    text: "Surah terpendek dalam Al-Quran adalah...",
    options: ["Al-Ikhlas", "An-Nas", "Al-Kautsar", "Al-Falaq"],
    correctAnswer: 2,
    explanation: "Al-Kautsar hanya terdiri dari 3 ayat."
  },
  {
    id: 35,
    text: "Ibadah puasa diwajibkan bagi umat Islam pada tahun ke...",
    options: ["1 Hijriah", "2 Hijriah", "5 Hijriah", "10 Hijriah"],
    correctAnswer: 1,
    explanation: "Kewajiban puasa Ramadhan turun pada tahun 2 Hijriah."
  }
];

