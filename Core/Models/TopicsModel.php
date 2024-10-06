<?php
namespace Core\Models;
use Core\Base\BaseModel;
class TopicsModel extends BaseModel{
    public static function getTopics($courseName){
        $result = self::DB("SELECT lessons.id AS lesson_id, title,lesson_content_id,lesson_course,lesson_group, lessons_groups.id AS lesson_group_id, name, position
                            FROM lessons 
                            INNER JOIN lessons_groups ON lessons.lesson_group=lessons_groups.id
                            WHERE lesson_course = (SELECT id FROM courses WHERE title_description = ?)
                            ORDER BY lesson_group, position ASC;
            ", "s", [$courseName]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function getTopicsByID($courseID){
        $result = self::DB("SELECT lessons.id, lessons.title
                            FROM lessons 
                            INNER JOIN lessons_groups ON lessons.lesson_group=lessons_groups.id
                            WHERE lesson_course = ?
                            ORDER BY lesson_group ASC
            ", "i", [$courseID]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function updateTopicName($newTitle, $lessonGroupID){
        $result = self::DB("UPDATE lessons_groups SET name = ? WHERE lessons_groups.id = ?
            ", "si",[$newTitle, $lessonGroupID]);
        return $result;
    }
    public static function updateLessonPosition($lessonID, $position){
        $result = self::DB("UPDATE lessons SET position = ? WHERE id = ?
            ", "ii",[$position, $lessonID]);
        return $result;
    }

    public static function addTopic($courseID, $lessonGroupID, $title, $position){
        $result =LessonModel::insertLessonEmptyContent();
        $result = self::DB("SELECT MAX(id) FROM lessons_content;");
        $result = $result->fetch_row();
       
        $lesson_content_id = $result[0];

        $result = self::DB("INSERT INTO lessons (title, lesson_content_id, lesson_course, lesson_group,position) VALUES (?, ?, ?, ?, ?);
            ", "siiii",[$title, $lesson_content_id, $courseID, $lessonGroupID, $position]);
        return $result;
    }
}
