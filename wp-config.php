/* Add any custom values between this line and the "stop editing" line. */

// Sécurité
header('Content-Type: text/html; charset=utf-8');
header('Surrogate-Control: BigPipe/1.0');
header('X-Accel-Buffering: no');

// Cookie
ini_set('session.cookie_secure', 'On');

session_unset();
session_destroy();
session_write_close();

unset($_COOKIE[$key]);
setcookie(session_name(),'',0,'/','monsite.fr');
session_set_cookie_params(['lifetime' => 0, 'secure' => true, 'samesite' => 'strict']);

if (isset($_COOKIE['session_name'])) {
            ini_set("session.use_trans_sid",false);
            session_start();
            $_SESSION['cookie_support']=1;
} else {
            ini_set("session.use_trans_sid",true);
            session_start();
            $_SESSION['cookie_support']=0;
} 

if (isset($_SESSION['destroyed'])
    && $_SESSION['destroyed'] < time() - 300) {
    remove_all_authentication_flag_from_active_sessions($_SESSION['userid']);
    throw(new DestroyedSessionAccessException);
}

$old_sessionid = session_id();
$_SESSION['destroyed'] = time();

session_regenerate_id();

unset($_SESSION['destroyed']);

$new_sessionid = session_id();

// url site
define('WP_SITEURL', 'https://monsite.fr');
define('WP_HOME', 'https://monsite.fr');
define('NOBLOGREDIRECT', 'https://monsite.fr'); // sous-doumaine

// Désactive mise à jour
define('AUTOMATIC_UPDATER_DISABLED', true);

// Désactive la réparation et la mise à jour des tables
define('WP_ALLOW_REPAIR', false);
define('DO_NOT_UPGRADE_GLOBAL_TABLES', true);

// Désactive page "erreur fatale"
define('WP_DISABLE_FATAL_ERROR_HANDLER', true);

// Bloquer les sites exterieurs
define('WP_HTTP_BLOCK_EXTERNAL', true);

// Multisite
define('WP_ALLOW_MULTISITE', false);

// Bloquer l'éditeur de theme et l'éditeur de plugin
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

// Téléchargement sans filtre stop
define('ALLOW_UNFILTERED_UPLOADS', false);

// Image multi activé/désactivé
define('IMAGE_EDIT_OVERWRITE', false);

/* That's all, stop editing! Happy publishing. */
