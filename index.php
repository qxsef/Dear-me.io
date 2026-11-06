<?php
require 'config.php';
require 'functions.php';
if (isset($_GET['lang']) && in_array($_GET['lang'], ['id','en'], true)) {
    $_SESSION['lang'] = $_GET['lang'];
    header('Location: index.php'); exit;
}
$page_title = 'Home';
$stmt = $pdo->query("SELECT p.id,p.title,p.body,p.created_at,u.display_name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.visibility='public' ORDER BY p.created_at DESC LIMIT 6");
$posts = $stmt->fetchAll();
require 'header.php';
?>
<section class="hero">
  <div class="eyebrow">A PERSONAL JOURNAL · EST. 2026</div>
  <h1><?= e(t('welcome')) ?></h1>
  <p><?= e(t('tagline')) ?></p>
  <div class="hero-actions">
    <?php if (current_user()): ?><a class="button" href="post.php"><?= e(t('write')) ?> ↗</a>
    <?php else: ?><a class="button" href="auth.php?action=register"><?= e(t('register')) ?> ↗</a><?php endif; ?>
    <a class="button ghost" href="explore.php"><?= e(t('explore')) ?></a>
  </div>
  <div class="hero-note">“Some feelings are easier to write than to say.”</div>
</section>
<section class="section-heading">
  <div><div class="eyebrow">THE COMMUNITY</div><h2><?= e(t('latest')) ?></h2></div>
  <a class="text-link" href="explore.php"><?= e(t('all')) ?> →</a>
</section>
<div class="story-grid">
<?php foreach ($posts as $post): ?>
  <article class="story-card">
    <div class="card-meta"><?= e(date('d M Y', strtotime($post['created_at']))) ?> · <?= e(t('by')) ?> <?= e($post['display_name']) ?></div>
    <h3><a href="view.php?id=<?= (int)$post['id'] ?>"><?= e($post['title']) ?></a></h3>
    <p><?= e(excerpt($post['body'])) ?></p>
    <a class="text-link" href="view.php?id=<?= (int)$post['id'] ?>">Read story ↗</a>
  </article>
<?php endforeach; ?>
</div>
<?php if (!$posts): ?><div class="empty"><?= e(t('no_posts')) ?></div><?php endif; ?>
<?php require 'footer.php'; ?>
