<?php
namespace Core\Models;
use Core\Base\BaseModel;

class ExamModel extends BaseModel
{
    public function getExam($quiz_id)
    {
        $result = self::DB("SELECT question_id, points, type, question, img, video, answers, correct, qz.id, name, time
                            FROM questions AS q
                            INNER JOIN quizzes AS qz ON q.quiz_id = qz.id
                            INNER JOIN student_exam AS se ON se.quiz_id = qz.id
                            WHERE qz.id = ? AND se.user_id = ?;
                            ","ii",[$quiz_id,$_SESSION['user']['id']]);
        return $result->fetch_all(MYSQLI_ASSOC);

    } 
    public static function getDateFromArchive($archive_id){
        $result = self::DB("SELECT date_approach_one, date_approach_two FROM `archive_exam` WHERE id=?","i",[$archive_id]);
        return $result->fetch_assoc();
    }

    public function getAllActivatedExams(){
        $result = self::DB("SELECT * FROM `student_exam` WHERE user_id=?","i",[$_SESSION['user']['id']]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getArchivedApproachExams($archivedApproachExamsID){
        // Zbuduj dynamicznie zapytanie SQL
        $placeholders = implode(',', array_fill(0, count($archivedApproachExamsID), '?'));
        $sql = "SELECT approach_two_activate, archive_exam.quiz_id, name, date_approach_one, date_approach_two FROM `archive_exam`
                INNER JOIN quizzes ON archive_exam.quiz_id = quizzes.id
                WHERE archive_exam.id IN ($placeholders)";
        
        // Przygotuj typy parametrów
        $types = str_repeat('i', count($archivedApproachExamsID));
        
        $result = self::DB($sql, $types, $archivedApproachExamsID);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function isShowExam($examID){
        $result = self::DB("SELECT quiz_id, date_approach_one, date_approach_two 
                    FROM archive_exam WHERE 
                    archive_exam.id = (SELECT archive_id FROM `student_exam` WHERE quiz_id=? LIMIT 1);"
                ,"i",[$examID]);
        $dates = $result->fetch_assoc();
        if(isset($dates['quiz_id']) AND !isset($dates['date_approach_one'])){
            return true;
        }
        else if( $dates['date_approach_one'] != NULL){
            $dateApproachOne = new \DateTime($dates['date_approach_one']);
            $dateApproachOne->modify('+7 days');
            $currentDate = new \DateTime();
            $interval = $currentDate->diff($dateApproachOne);
            $daysRemaining = $interval->format('%a');
            if($daysRemaining >= 0){
                return true;
            }
        }
        return false;
    }

    public static function activateExam($quizID, $classID, $students){
       
        $sql = "INSERT INTO `student_exam` (user_id, quiz_id, time) VALUES ";
        $values = [];
        foreach($students as $student){
            if($student[2]){
                $result = self::DB("SELECT archive_id FROM `student_exam` WHERE user_id=? AND quiz_id=?","ii",[$student[0],$quizID]);
                $archiveID = $result->fetch_assoc()['archive_id'];
                self::DB("UPDATE `archive_exam` SET approach_two_activate=1 WHERE id=?","i",[$archiveID]);
            }else{
                $result = self::DB("SELECT * FROM `student_exam` WHERE user_id=? AND quiz_id=?","ii",[$student[0],$quizID]);
                if($result->num_rows > 0){
                    continue;
                }
                $values[] = "({$student[0]},{$quizID},{$student[1]})";
            }
        }
        if(empty($values)){
            return;
        }
        $sql .= implode(",",$values);
        self::DB($sql);
    }

}