<?php
namespace Core\Models;
use Core\Base\BaseModel;

class QuizManagerModel extends BaseModel{
    public static function getQuiz($quiz_id)
    {
        $result = self::DB("SELECT question_id, points, type, question, img, video, answers, correct, qz.id, name, time
FROM questions AS q
INNER JOIN quizzes AS qz ON q.quiz_id = qz.id
INNER JOIN student_exam AS se ON se.quiz_id = qz.id
WHERE qz.id = ?
                            ","i",[$quiz_id]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function getAllQuizzes()
    {
        $result = self::DB("SELECT * FROM quizzes");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getStudentsByClass($class_id)
    {
        $result = self::DB("SELECT students.id, students.fname, students.sname, students.lname, students.student_nr, date_approach_one, date_approach_two, student_exam.time
                            FROM `students` 
                                INNER JOIN classes ON students.class_id = classes.id
                                LEFT JOIN accounts ON accounts.id = students.id
                                LEFT JOIN student_exam ON student_exam.user_id= students.id
                                LEFT JOIN archive_exam ON archive_exam.id = student_exam.archive_id
                            WHERE class_id = ?
                            ORDER BY students.student_nr;"
                            ,"i",[$class_id]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}