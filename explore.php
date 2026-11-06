<?php
require 'config.php'; require 'functions.php';
if (isset($_GET['lang']) && in_array($_GET['lang'], ['id','en'], true)) { $_SESSION['lang']=$_GET['lang']; header('Location: explore.php'); exit; }
$q = trim($_GET['q'] ?? '');
$sql = "SELECT p.id,p.title,p.body,p.created_at,u.display_name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.visibility='public'";
$args = [];
if ($q !== '') { $sql .= " AND (p.title LIKE ? OR p.body LIKE ?)"; $args = ["%$q%","%$q%"]; }
$sql .= " ORDER BY p.created_at DESC LIMIT 60";
$stmt = $pdo->prepare($sql); $stmt->execute($args); $posts = $stmt->fetchAll();
$page_title = t('explore'); require 'header.php';
?>
<section class="page-intro"><div class="eyebrow">OPEN JOURNALS</div><h1><?= e(t('explore')) ?></h1><p>Stories shared by the DEAR ME community.</p></section>
<form class="search-form" method="get"><input name="q" value="<?= e($q) ?>" placeholder="<?= e(t('search')) ?>"><button class="button"><?= e(t('explore')) ?></button></form>
<div class="story-grid">
<?php foreach ($posts as $post): ?><article class="story-card"><div class="card-meta"><?= e(date('d M Y',strtotime($post['created_at']))) ?> · <?= e($post['display_name']) ?></div><h3><a href="view.php?id=<?= (int)$post['id'] ?>"><?= e($post['title']) ?></a></h3><p><?= e(excerpt($post['body'])) ?></p><a class="text-link" href="view.php?id=<?= (int)$post['id'] ?>">Read story ↗</a></article><?php endforeach; ?>
</div>
<?php if (!$posts): ?><div class="empty"><?= e(t('no_posts')) ?></div><?php endif; ?>
<?php require 'footer.php'; ?>
