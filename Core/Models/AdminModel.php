<?php 
namespace Core\Models;
use Core\Base\BaseModel;
class AdminModel extends BaseModel{
    public static function getTeachers(){
        $result = self::DB("SELECT accounts.id, accounts.login, accounts.status, teachers.fname, teachers.sname, teachers.lname
                            FROM `accounts`
                            LEFT JOIN teachers ON accounts.id = teachers.id
                            WHERE accounts.privileges = 'teacher'
                            ORDER BY accounts.id;
                        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}