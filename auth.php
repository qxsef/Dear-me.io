<?php
require 'config.php'; require 'functions.php';
$action = ($_GET['action'] ?? 'login') === 'register' ? 'register' : 'login';
$error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    verify_csrf();
    $email=strtolower(trim($_POST['email'] ?? '')); $password=$_POST['password'] ?? '';
    if ($action==='register') {
        $name=trim($_POST['display_name'] ?? '');
        if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($password)<10 || $name==='') $error='Isi nama, email valid, dan kata sandi minimal 10 karakter.';
        else {
            $check=$pdo->prepare("SELECT id FROM users WHERE email=?"); $check->execute([$email]);
            if ($check->fetch()) $error='Email sudah terdaftar.';
            else {
                $count=(int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
                $role=$count===0?'admin':'member';
                $s=$pdo->prepare("INSERT INTO users(display_name,email,password_hash,role) VALUES(?,?,?,?)");
                $s->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT),$role]);
                session_regenerate_id(true);
                $_SESSION['user']=['id'=>(int)$pdo->lastInsertId(),'display_name'=>$name,'email'=>$email,'role'=>$role];
                header('Location: journal.php'); exit;
            }
        }
    } else {
        $s=$pdo->prepare("SELECT id,display_name,email,password_hash,role FROM users WHERE email=?"); $s->execute([$email]); $u=$s->fetch();
        if ($u && password_verify($password,$u['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['user']=['id'=>(int)$u['id'],'display_name'=>$u['display_name'],'email'=>$u['email'],'role'=>$u['role']];
            header('Location: journal.php'); exit;
        } else $error=t('invalid');
    }
}
$page_title=$action==='register'?t('register'):t('login'); require 'header.php';
?>
<section class="auth-wrap"><div class="eyebrow">WELCOME TO DEAR ME</div><h1><?= e($page_title) ?></h1><p><?= e(t('tagline')) ?></p>
<?php if ($error): ?><div class="alert"><?= e($error) ?></div><?php endif; ?>
<form method="post" class="editor-form">
<input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
<?php if ($action==='register'): ?><label><?= e(t('name')) ?><input name="display_name" maxlength="80" required></label><?php endif; ?>
<label><?= e(t('email')) ?><input type="email" name="email" maxlength="190" required autocomplete="email"></label>
<label><?= e(t('password')) ?><input type="password" name="password" minlength="10" required autocomplete="<?= $action==='register'?'new-password':'current-password' ?>"></label>
<button class="button" type="submit"><?= e(t('submit')) ?></button>
</form>
<p class="auth-switch"><?php if ($action==='register'): ?>Already have an account? <a href="auth.php?action=login"><?= e(t('login')) ?></a><?php else: ?>Belum punya akun? <a href="auth.php?action=register"><?= e(t('register')) ?></a><?php endif; ?></p>
</section>
<?php require 'footer.php'; ?>
