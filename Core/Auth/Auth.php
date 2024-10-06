<?php
namespace Core\Auth;
class Auth {
    public static function getPrivileges() {
        if(isset($_SESSION["user"]["privileges"])){
            return $_SESSION["user"]["privileges"];
        }else{
            return "guest";
        }
    }

     /**
     * Ustawia token CSRF na czas 1h.
     */
    public static function tokenCSRF(){
        if(!isset($_SESSION['csrf_token_time']) || $_SESSION['csrf_token_time'] < time()){
            self::regenerateTokenCSRF();
        }
        return $_SESSION['csrf_token'];
    }
    public static function regenerateTokenCSRF(){
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time() + 3600;
    }
}