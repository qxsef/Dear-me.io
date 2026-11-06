<?php
require 'config.php'; require 'functions.php'; require_login();
$id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT) ?: 0;
$s=$pdo->prepare("SELECT id,title FROM posts WHERE id=? AND user_id=?"); $s->execute([$id,current_user()['id']]); $post=$s->fetch();
if (!$post) { http_response_code(404); exit('Story not found.'); }
if ($_SERVER['REQUEST_METHOD']==='POST') {
    verify_csrf();
    $d=$pdo->prepare("DELETE FROM posts WHERE id=? AND user_id=?"); $d->execute([$id,current_user()['id']]);
    header('Location: journal.php'); exit;
}
$page_title='Delete story'; require 'header.php';
?>
<section class="auth-wrap"><h1>Delete this story?</h1><p><?= e($post['title']) ?></p><form method="post"><input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>"><button class="button danger-button">Delete permanently</button> <a class="text-link" href="journal.php">Cancel</a></form></section>
<?php require 'footer.php'; ?>
