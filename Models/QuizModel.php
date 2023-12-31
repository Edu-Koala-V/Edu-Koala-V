<?php
class QuizModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function createNewQuiz($title, $category)
    {
        $stmt = $this->db->prepare("INSERT INTO quizzes (title, category) VALUES (?, ?)");
        $stmt->bind_param("ss", $title, $category);
        $stmt->execute();
        $id = $stmt->insert_id;
        $stmt->close();
        return $id;
    }

    public function insertQuizContent(array $data)
    {
        foreach ($data as $key => $value) {
            $stmt = $this->db->prepare("INSERT INTO questions (quiz_id, question, answerA, answerB, answerC, answerD, answer)
         VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param(
                "sssssss",
                $data[$key]["quiz_id"],
                $data[$key]["question"],
                $data[$key]["answerA"],
                $data[$key]["answerB"],
                $data[$key]["answerC"],
                $data[$key]["answerD"],
                $data[$key]["answer"],
            );
            $stmt->execute();
        }
        $stmt->close();
    }

    public function getAllQuizzes()
    {
        $stmt = $this->db->query("SELECT * FROM quizzes ORDER BY category");
        return $stmt;
    }
    public function getAllQuizzesInArrayForStudent($classID)
    {
        $result = $this->db->query("SELECT name FROM `classes` WHERE id = $classID;");
        $className = $result->fetch_row();
        $className = $className[0];
        $nrStudent = $_SESSION['user']['nr_student'];
        strtolower($className);
        $stmt = $this->db->prepare("SELECT * FROM $className WHERE student_nr=?;");
        $stmt->bind_param("s", $nrStudent);
        $stmt->execute();
        $result = $stmt->get_result();

        $fields = mysqli_fetch_fields($result);
        $column_names = array();
        $column_names_string = "";
        foreach ($fields as $field) {
            $column_names[] = $field->name;
        }
        foreach ($fields as $field) {
            $column_names_string = $column_names_string . 'title="' . $field->name . '" OR ';
        }
        $taskNameArray = substr($column_names_string, 0, strlen($column_names_string) - 3);
        $stmt = $this->db->query("SELECT * FROM `quizzes` WHERE $taskNameArray;");

        $taskArray = [$result, $stmt];

        return $taskArray;
    }
}
