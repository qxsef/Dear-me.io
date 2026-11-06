<?php
require 'config.php'; require 'functions.php';
$id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT) ?: 0;
$s=$pdo->prepare("SELECT p.*,u.display_name FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=? AND (p.visibility='public' OR p.user_id=?)");
$s->execute([$id,current_user()['id'] ?? 0]); $post=$s->fetch();
if (!$post) { http_response_code(404); exit('Story not found or private.'); }
$page_title=$post['title']; require 'header.php';
?>
<article class="reading">
<div class="eyebrow"><?= e($post['visibility']==='public'?'PUBLIC STORY':'PRIVATE STORY') ?></div>
<h1><?= e($post['title']) ?></h1>
<div class="card-meta"><?= e(t('by')) ?> <?= e($post['display_name']) ?> · <?= e(date('d M Y',strtotime($post['created_at']))) ?></div>
<div class="reading-body"><?= nl2br(e($post['body'])) ?></div>
<?php if (current_user() && (int)current_user()['id']===(int)$post['user_id']): ?><a class="button ghost" href="post.php?id=<?= (int)$post['id'] ?>">Edit story</a><?php endif; ?>
</article>
<?php require 'footer.php'; ?>
