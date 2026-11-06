<?php
declare(strict_types=1);

function e(?string $value): string {
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function t(string $id): string {
    $lang = $_SESSION['lang'] ?? 'id';
    $dict = [
        'id' => [
            'home'=>'Beranda','explore'=>'Jelajahi','journal'=>'Jurnal','login'=>'Masuk',
            'register'=>'Daftar','logout'=>'Keluar','write'=>'Tulis cerita','welcome'=>'Selamat datang di ruang ceritamu.',
            'tagline'=>'Tempat untuk menulis, berbagi, dan menjadi diri sendiri.',
            'latest'=>'Tulisan terbaru','public'=>'Publik','private'=>'Pribadi','title'=>'Judul',
            'body'=>'Ceritakan sesuatu...','save'=>'Simpan tulisan','no_posts'=>'Belum ada tulisan. Jadilah yang pertama berbagi.',
            'email'=>'Email','password'=>'Kata sandi','name'=>'Nama tampilan','submit'=>'Kirim',
            'my_posts'=>'Tulisan saya','visibility'=>'Siapa yang bisa membaca?','edit'=>'Edit','delete'=>'Hapus',
            'by'=>'Ditulis oleh','created'=>'Dibuat','profile'=>'Profil','about'=>'Tentang',
            'login_needed'=>'Silakan masuk untuk melanjutkan.','invalid'=>'Email atau kata sandi tidak cocok.',
            'saved'=>'Tulisan berhasil disimpan.','deleted'=>'Tulisan dihapus.','search'=>'Cari tulisan...',
            'language'=>'Bahasa','all'=>'Semua tulisan','intro'=>'Setiap cerita punya tempat.'
        ],
        'en' => [
            'home'=>'Home','explore'=>'Explore','journal'=>'Journal','login'=>'Log in',
            'register'=>'Sign up','logout'=>'Log out','write'=>'Write a story','welcome'=>'Welcome to your space for stories.',
            'tagline'=>'A place to write, share, and be yourself.',
            'latest'=>'Latest stories','public'=>'Public','private'=>'Private','title'=>'Title',
            'body'=>'Write something...','save'=>'Save story','no_posts'=>'No stories yet. Be the first to share.',
            'email'=>'Email','password'=>'Password','name'=>'Display name','submit'=>'Submit',
            'my_posts'=>'My stories','visibility'=>'Who can read this?','edit'=>'Edit','delete'=>'Delete',
            'by'=>'Written by','created'=>'Created','profile'=>'Profile','about'=>'About',
            'login_needed'=>'Please log in to continue.','invalid'=>'Email or password is incorrect.',
            'saved'=>'Your story has been saved.','deleted'=>'Story deleted.','search'=>'Search stories...',
            'language'=>'Language','all'=>'All stories','intro'=>'Every story deserves a place.'
        ]
    ];
    return $dict[$lang][$id] ?? $id;
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function verify_csrf(): void {
    $sent = $_POST['csrf'] ?? '';
    if (!is_string($sent) || !hash_equals($_SESSION['csrf'] ?? '', $sent)) {
        http_response_code(403);
        exit('Invalid request token. Please go back and try again.');
    }
}

function current_user(): ?array {
    return $_SESSION['user'] ?? null;
}

function require_login(): void {
    if (!current_user()) {
        header('Location: auth.php?action=login');
        exit;
    }
}

function excerpt(string $text, int $length = 180): string {
    $text = trim(strip_tags($text));
    if (function_exists('mb_strimwidth')) return mb_strimwidth($text, 0, $length, '…', 'UTF-8');
    return strlen($text) > $length ? substr($text, 0, $length) . '…' : $text;
}
