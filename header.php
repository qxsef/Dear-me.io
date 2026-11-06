<?php
$lang = $_SESSION['lang'] ?? 'id';
$user = current_user();
?>
<!doctype html>
<html lang="<?= e($lang) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#7651ad">
  <title><?= e($page_title ?? 'DEAR ME') ?> · DEAR ME</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="topbar">
  <a class="brand" href="index.php">dear me<span>.</span></a>
  <nav>
    <a href="index.php"><?= e(t('home')) ?></a>
    <a href="explore.php"><?= e(t('explore')) ?></a>
    <?php if ($user): ?><a href="journal.php"><?= e(t('journal')) ?></a><?php endif; ?>
  </nav>
  <div class="nav-actions">
    <a class="lang" href="?lang=<?= $lang === 'id' ? 'en' : 'id' ?>"><?= $lang === 'id' ? 'EN' : 'ID' ?></a>
    <?php if ($user): ?>
      <span class="welcome-user"><?= e($user['display_name']) ?></span>
      <a class="button small" href="logout.php"><?= e(t('logout')) ?></a>
    <?php else: ?>
      <a class="button small ghost" href="auth.php?action=login"><?= e(t('login')) ?></a>
      <a class="button small" href="auth.php?action=register"><?= e(t('register')) ?></a>
    <?php endif; ?>
  </div>
</header>
<main class="container">
