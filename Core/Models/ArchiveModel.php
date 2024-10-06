<?php
namespace Core\Models;
use Core\Base\BaseModel;
//AND archive_id != NULL
class ArchiveModel extends BaseModel{
    public static function getExams(){
        $result = self::DB("SELECT * FROM student_exam WHERE user_id=? ","i",[$_SESSION["user"]["id"]]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getArchiveExams($id){
        $result = self::DB("SELECT id, quiz_id, time, score_one, score_two, date_approach_one, date_approach_two FROM archive_exam WHERE id=? ","i",[$id]);
        $result = $result->fetch_all(MYSQLI_ASSOC);
        foreach($result as $key => $value){
            $result["quiz_name"] = self::getQuizName($value["quiz_id"]);
            $result["max_points"] = self::getExamMaxPoints($value["quiz_id"]);
        }
        return $result;
    }

    public static function getQuizName($quiz_id){
        $result = self::DB("SELECT name FROM quizzes WHERE id=? ","i",[$quiz_id]);
        return $result->fetch_assoc()["name"];
    }
    public static function getExamMaxPoints($quiz_id){
        $result = self::DB("SELECT COUNT(points) AS max_points FROM `questions` WHERE quiz_id=? ","i",[$quiz_id]);
        return $result->fetch_assoc()["max_points"];
    }

 
    public static function saveExamHTML($htmlExamCode, $quiz_id, $points) {
        $result = self::DB("SELECT archive_id FROM `student_exam` WHERE user_id=? AND quiz_id=?", "ii", [$_SESSION["user"]["id"], $quiz_id]);
        $archive_id = $result->fetch_assoc()["archive_id"];
        if ($archive_id == NULL) {
            $result = self::DB("SELECT COUNT(*)+1 AS new_id FROM `student_exam`;");
            $archive_id = $result->fetch_assoc()["new_id"];
            
            // Pobierz aktualną datę w formacie YYYY-MM-DD
            $currentDate = date('Y-m-d');
            
            // Poprawione zapytanie SQL z wypełnieniem wszystkich wymaganych pól
            $result = self::DB("INSERT INTO `archive_exam` (`id`, `quiz_id`, `time`, `approach_one`, `approach_two`, `score_one`, `score_two`, `date_approach_one`, `date_approach_two`)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            "iiississs", [$archive_id, $quiz_id, 2137, json_encode($htmlExamCode), NULL, $points, NULL, $currentDate, NULL]);
            
            $result = self::DB("UPDATE `student_exam` SET `archive_id` = ? WHERE user_id = ? AND quiz_id=?", "iis", [$archive_id, $_SESSION["user"]["id"], $quiz_id]);
        } else {
            $result = self::DB("SELECT * FROM `archive_exam` WHERE id=? AND approach_two_activate=1;", "i", [$archive_id]);
            if($result->num_rows!=0){
                $result = self::DB("UPDATE `archive_exam` SET `approach_two` = ?, `score_two` = ?, `date_approach_two` = ? 
                WHERE `archive_exam`.`id` = ?",
            "sisi", [json_encode($htmlExamCode), $points, date('Y-m-d'), $archive_id]);
            }
        }
    }

    public static function getArchiveExamsHTML($id, $approach){
        $result = self::DB("SELECT approach_one, approach_two FROM archive_exam WHERE id=? ","i",[$id]);
        $result = $result->fetch_assoc();
        if($approach == 1){
            return $result["approach_one"];
        }else{
            return $result["approach_two"];
        }
    }

}