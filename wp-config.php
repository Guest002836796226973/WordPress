/* Add any custom values between this line and the "stop editing" line. */

// Sécurité et cookie
header('Content-Type: text/html; charset=utf-8');
header('Surrogate-Control: BigPipe/1.0');
header('X-Accel-Buffering: no');

ini_set('session.cookie_secure', 'On');
unset( $_SESSION[$name] );
session_start();
session_unset();
session_destroy();
session_write_close();
setcookie(session_name(),'',0,'/');
session_regenerate_id(true);
session_set_cookie_params(['lifetime' => 0, 'secure' => true, 'samesite' => 'strict']);

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
