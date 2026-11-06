<?php
require 'config.php'; require 'functions.php'; require_login();
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) ?: 0;
$post = ['title'=>'','body'=>'','visibility'=>'public'];
if ($id) {
    $s=$pdo->prepare("SELECT * FROM posts WHERE id=? AND user_id=?"); $s->execute([$id,current_user()['id']]); $found=$s->fetch();
    if (!$found) { http_response_code(404); exit('Story not found.'); }
    $post=$found;
}
$error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    verify_csrf();
    $title=trim($_POST['title'] ?? ''); $body=trim($_POST['body'] ?? '');
    $visibility=($_POST['visibility'] ?? 'public') === 'private' ? 'private' : 'public';
    if ($title==='' || $body==='') $error='Judul dan isi tulisan wajib diisi.';
    elseif (mb_strlen($title)>160 || mb_strlen($body)>20000) $error='Judul maksimal 160 karakter dan isi maksimal 20.000 karakter.';
    else {
        if ($id) {
            $s=$pdo->prepare("UPDATE posts SET title=?,body=?,visibility=?,updated_at=NOW() WHERE id=? AND user_id=?");
            $s->execute([$title,$body,$visibility,$id,current_user()['id']]);
        } else {
            $s=$pdo->prepare("INSERT INTO posts(user_id,title,body,visibility) VALUES(?,?,?,?)");
            $s->execute([current_user()['id'],$title,$body,$visibility]);
        }
        header('Location: journal.php?saved=1'); exit;
    }
    $post=['title'=>$title,'body'=>$body,'visibility'=>$visibility];
}
$page_title=t('write'); require 'header.php';
?>
<section class="page-intro"><div class="eyebrow">A PAGE FOR YOUR THOUGHTS</div><h1><?= $id ? e(t('edit')) : e(t('write')) ?></h1><p>Write freely. Choose what you want to share.</p></section>
<?php if ($error): ?><div class="alert"><?= e($error) ?></div><?php endif; ?>
<form method="post" class="editor-form">
<input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
<label><?= e(t('title')) ?><input name="title" maxlength="160" required value="<?= e($post['title']) ?>" placeholder="A little note to myself..."></label>
<label><?= e(t('body')) ?><textarea name="body" rows="12" maxlength="20000" required placeholder="<?= e(t('body')) ?>"><?= e($post['body']) ?></textarea></label>
<label><?= e(t('visibility')) ?><select name="visibility"><option value="public" <?= $post['visibility']==='public'?'selected':'' ?>><?= e(t('public')) ?></option><option value="private" <?= $post['visibility']==='private'?'selected':'' ?>><?= e(t('private')) ?></option></select></label>
<button class="button" type="submit"><?= e(t('save')) ?></button>
</form>
<?php require 'footer.php'; ?>
