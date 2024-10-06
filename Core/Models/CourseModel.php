<?php
namespace Core\Models;
use Core\Base\BaseModel;
class CourseModel extends BaseModel{
    public static function getAllCourses(){
        $result = self::DB("SELECT * FROM courses");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function getCourseID($courseName){
        $result = self::DB("SELECT id FROM courses WHERE title_description = ? LIMIT 1","s",[$courseName]);
        return $result->fetch_assoc();
    }
}