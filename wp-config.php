<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //

if (strstr($_SERVER['SERVER_NAME'], 'localhost')) {
	define( 'DB_NAME', 'university' );
	define( 'DB_USER', 'admin' );
	define( 'DB_PASSWORD', 'abcdef' );
	define( 'DB_HOST', 'localhost' );
} else {
	define( 'DB_NAME', 'host_db' );
	define( 'DB_USER', 'host_db_user' );
	define( 'DB_PASSWORD', '123456' );
	define( 'DB_HOST', 'localhost' );
}

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'GvRw{UP]otsR,Q5WZ 402X):,S5!KG8(SVN&<FRz.|fyHh4UZQMIxUpZ3>[n]saQ' );
define( 'SECURE_AUTH_KEY',  'xl8JUy 9V6L&-<0c6H@)B[&-SbS#SRpy,Kvk=-b+<h?=?wi[g-k_LyGzdW3L!S!S' );
define( 'LOGGED_IN_KEY',    'EZ,JrZtJ<{DC}f6/|~2V-Dt~zcGJ^vx83H;{Me<2;Te{vUk)*h_MEf$FfI wy0Hc' );
define( 'NONCE_KEY',        '`l2=)nIg9?=4w+9qtVi/F13l>:~T9K,~d/<rI;Exa)}s0CxRWAG`y$>&(X>-7}D>' );
define( 'AUTH_SALT',        'CvQ,o(bh^{DgzdB,=<o${3%Qec:v^t#X4qDM/4nj(6{*KQ4Pk*!jSMp+vd>[,(dM' );
define( 'SECURE_AUTH_SALT', 'wk&6I`JY1dJ#lCn?#.Pixlf+**a[:wSfcB}&J0^<I4BQ<Ta@?rlkrS6KGUXk2OYD' );
define( 'LOGGED_IN_SALT',   ';@A> u/_JA70]Zxos!xrl[5kYSpP9=w/1s#yO}YoFelTv#@h( 5~s@<7BfH`Njiw' );
define( 'NONCE_SALT',       '=`&St}js92Xc#xu$4WBOBV,~e {i_*15Sm.BW`5f.t~iQZ,|!a4LV!OlU&QB^G_K' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
