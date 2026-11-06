<?php
require 'config.php'; require 'functions.php'; require_login();
if (isset($_GET['lang']) && in_array($_GET['lang'], ['id','en'], true)) { $_SESSION['lang']=$_GET['lang']; header('Location: journal.php'); exit; }
$stmt=$pdo->prepare("SELECT * FROM posts WHERE user_id=? ORDER BY created_at DESC"); $stmt->execute([current_user()['id']]); $posts=$stmt->fetchAll();
$page_title=t('journal'); require 'header.php';
?>
<section class="page-intro"><div class="eyebrow">YOUR PERSONAL SPACE</div><h1><?= e(t('my_posts')) ?></h1><p>Your words, your pace, your space.</p><a class="button" href="post.php">＋ <?= e(t('write')) ?></a></section>
<div class="story-grid">
<?php foreach ($posts as $post): ?><article class="story-card"><div class="card-meta"><?= e(date('d M Y',strtotime($post['created_at']))) ?> · <?= e(t($post['visibility'])) ?></div><h3><?= e($post['title']) ?></h3><p><?= e(excerpt($post['body'])) ?></p><div class="card-links"><a class="text-link" href="post.php?id=<?= (int)$post['id'] ?>"><?= e(t('edit')) ?></a><a class="text-link danger" href="delete.php?id=<?= (int)$post['id'] ?>">Delete</a><?php if ($post['visibility']==='public'): ?><a class="text-link" href="view.php?id=<?= (int)$post['id'] ?>">View ↗</a><?php endif; ?></div></article><?php endforeach; ?>
</div>
<?php if (!$posts): ?><div class="empty"><?= e(t('no_posts')) ?></div><?php endif; ?>
<?php require 'footer.php'; ?>
