<?php
if (session_status() == PHP_SESSION_NONE) {
    // Set cookie parameters for safety
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'secure' => false, // Set to true if running HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}
?>
