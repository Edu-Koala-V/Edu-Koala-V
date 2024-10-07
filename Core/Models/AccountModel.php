<?php
namespace Core\Models;

use Core\Base\BaseModel;

class AccountModel extends BaseModel{

    public static function isExitAccountByLogin($login){
        $result = self::DB("SELECT COUNT(*) 
                            FROM accounts 
                            WHERE login = ?
                            LIMIT 1
            ","s", [$login]);
        return $result->fetch_array()[0] > 0;
    }

    public static function checkStatus($login){
        $result = self::DB("SELECT status 
                            FROM accounts 
                            WHERE login = ?
                            LIMIT 1
            ","s", [$login]);
        return $result->fetch_array()[0];
    }

    public static function checkPassword($login, $old_password){
        $result = self::DB("SELECT password 
                            FROM accounts 
                            WHERE login = ?
                            LIMIT 1
            ","s", [$login]);
        $result=$result->fetch_assoc();
        return password_verify($old_password, $result['password']);
    }

    public static function getAccountData($login){
        $result = self::DB("SELECT id, role, settings 
                            FROM accounts 
                            WHERE login = ?
                            LIMIT 1
            ","s", [$login]);
        return $result->fetch_assoc();
    }
    public static function getUpdateDate($login){
        $result = self::DB("SELECT updated_at 
                            FROM accounts
                            WHERE login = ?
                            LIMIT 1
            ","s", [$login]);
        return $result->fetch_assoc();
    }
    public static function getUserData($table, $id){
        if($table == "admins"){
            $table = "teachers";
        }
        $result = self::DB("SELECT * 
                            FROM $table 
                            WHERE id = ?
                            LIMIT 1
            ","i", [$id]);
        return $result->fetch_assoc();
    }

    public static function changePassword($login, $password){
        $password = password_hash($password, PASSWORD_DEFAULT);
        $result = self::DB("UPDATE accounts 
                            SET password = ?
                            WHERE login = ?
            ","ss", [$password, $login]);
        return $result;
    }

    public static function changeStatus($login, $status){
        $result = self::DB("UPDATE accounts 
                            SET status = ?
                            WHERE login = ?
            ","ss", [$status, $login]);
        return $result;
    }
    public static function addAccount($login, $password,$role){
        $password = password_hash($password, PASSWORD_DEFAULT);
        try{
            self::DB("INSERT INTO accounts 
                            (login, password, role, status) 
                            VALUES (?,?,?, 'new')
            ","sss", [$login, $password, $role]);
            return ["status"=> "success", "message"=> "Konto zostało utworzone. Login: {$login}, Hasło: {$password}"];

        }catch(\mysqli_sql_exception $e){
            // Sprawdzenie, czy błąd jest związany z duplikatem wpisu
            if(strpos($e->getMessage(), "Duplicate entry") !== false && strpos($e->getMessage(), "for key 'UNIQUES_login_accounts'") !== false){
                // Zwrócenie komunikatu o istniejącym koncie
                return ["status"=> "error", "message"=> "konto o tym loginie już istnieje"];
            }
            // Możesz zwrócić inny komunikat lub obsłużyć błąd inaczej, jeśli to nie duplikat
            return ["status"=> "error", "message"=> "Wystąpił błąd podczas dodawania konta: " . $e->getMessage()];
        }
    }

    public static function deleteAccount($login){
        $result = self::DB("DELETE FROM accounts 
                            WHERE login = ?
            ","s", [$login]);
        return $result;
    }

    public static function changeAvatar($user_id, $avatar_id){
        
        $settings = self::getSettings($user_id);
        $settings["avatar"] = $avatar_id;
        $settings = json_encode($settings);
        $result = self::DB("UPDATE accounts 
                            SET settings = ?
                            WHERE id = ?
            ","si", [$settings, $user_id]);
        return $result;
    }
    public static function getSettings($user_id){
        $result = self::DB("SELECT settings FROM `accounts` WHERE id=?","i",[$user_id]);
        return json_decode($result->fetch_assoc()["settings"], true);
    }
    
    public static function resetPassword($login){
        $password = password_hash("ZAQ!2wsx1234", PASSWORD_DEFAULT);
        $result = self::DB("UPDATE accounts 
                            SET password = ?,
                            status = 'new'
                            WHERE login = ?
            ","ss", [$password, $login]);
        return $result;
    }
    
}