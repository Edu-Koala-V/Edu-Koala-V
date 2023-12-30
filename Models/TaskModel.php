<?php
class TaskModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getAllTasks()
    {
        $stmt = $this->db->query("SELECT * FROM tasks ORDER BY category");
        return $stmt;
    }
    public function createTask($nameTask, $descriptionTask, $categoryTask)
    {
        $stmt = $this->db->prepare("INSERT INTO tasks (name, description, category) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nameTask, $descriptionTask, $categoryTask);
        $stmt->execute();
        $stmt->close();
    }


    public function getAllTasksInArrayForStudent($classID)
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
            $column_names_string = $column_names_string . 'name="' . $field->name . '" OR ';
        }
        $taskNameArray = substr($column_names_string, 0, strlen($column_names_string) - 3);
        $stmt = $this->db->query("SELECT * FROM `tasks` WHERE $taskNameArray;");
        // $stmt->bind_param("s", $taskNameArray);
        // $stmt->execute();
        // $allTaskActivated = $stmt->get_result();
        // $arrayTest = [$taskNameArray];

        $taskArray = [$result, $stmt];



        return $taskArray;
    }
}
