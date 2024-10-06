<?php 
namespace Core\Models;

use Core\Base\BaseModel;
use Core\Base\BaseStringURL;
class LessonModel extends BaseModel {



    public static function getLesson($lessonName) {
        $result = self::DB("SELECT * FROM lessons 
                            INNER JOIN lessons_content ON lesson_content_id=lessons_content.id 
                            WHERE lessons.title=?
                        ","s",[$lessonName]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function updateLessonTitle($newTitle, $lessonID){
        $result = self::DB("UPDATE lessons SET title = ? WHERE lessons.id = ?;
            ", "si",[$newTitle, $lessonID]);
        return $result;
    }
    public static function insertLessonEmptyContent(){
        $result = self::DB("INSERT INTO lessons_content (id, json_link, created_at, updated_at, authors, quiz_id) 
            VALUES (NULL, '', current_timestamp(), current_timestamp(), ?, 0);
            ", "s", [
                json_encode([$_SESSION['user']['fname']." ".$_SESSION['user']['lname']])
            ]);
        return $result;
    }
    public static function updateLessonContent($lessonId, $jsonLink){
        $result = self::DB("UPDATE lessons_content SET json_link = ?, updated_at = current_timestamp() WHERE id = ?;
            ", "si",[$jsonLink, $lessonId]);
        return $result;
    }
    public static function updateLessonDate($lessonId){
        $result = self::DB("UPDATE lessons_content SET updated_at = current_timestamp() WHERE id = ?;
            ", "i",[$lessonId]);
        return $result;
    }
}