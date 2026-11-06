DEAR ME — STARTER WEBSITE
=========================

REQUIREMENTS
- PHP 8.0+ recommended (PDO MySQL enabled)
- MySQL 5.7+ or MariaDB
- Hosting account with PHP + MySQL and SSL/HTTPS

INSTALLATION ON IDWEBHOST (GENERAL SHARED-HOSTING STEPS)
1. Open your hosting control panel (often cPanel).
2. Create a MySQL database and a database user. Assign the user to the database with ALL PRIVILEGES.
3. Open phpMyAdmin, select the new database, choose Import, and import database.sql.
4. Edit config.php:
   DB_HOST (usually localhost)
   DB_NAME
   DB_USER
   DB_PASS
5. Upload the contents of this folder into your domain's document root
   (commonly public_html). Keep the assets folder and all PHP files together.
6. Enable SSL/HTTPS for the domain, then open https://your-domain/.
7. Register the first account. The first registered account is assigned the
   admin role; later accounts are members. Both can create and manage their
   own stories. This starter does not yet include a separate admin dashboard.

IMPORTANT SECURITY NOTES
- Change the database credentials; never share config.php publicly.
- Use HTTPS.
- Use a strong unique password (minimum 10 characters).
- Back up the database regularly.
- This is a starter project. Before opening it to a large public audience,
  add rate limiting, email verification, password reset, moderation/reporting,
  spam protection, and a proper admin dashboard.
- Public posts are visible to everyone. Private posts are only shown to their
  owner when logged in. Do not publish sensitive personal information.
- The language switch is available in the header. Some explanatory/helper
  text in this starter is currently Indonesian/English mixed; expand the
  translation dictionary in functions.php for a fully translated site.

FILES
index.php       Homepage
explore.php     Public story directory
auth.php        Registration and login
journal.php     Signed-in user's own stories
post.php        Create/edit a story
view.php        Read public stories or your own private story
delete.php      Confirm and delete your own story
logout.php      Sign out
config.php      Database and session configuration
functions.php   Helpers, translations, CSRF
database.sql    Database schema
assets/         CSS and JavaScript
