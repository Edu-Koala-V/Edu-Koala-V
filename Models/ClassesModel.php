<?php
class ClassesModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function createClass($name)
    {

        $stmt = $this->db->prepare("INSERT INTO classes (name, points) VALUES (?, 0)");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $stmt->close();
    }

    public function updateClass($id, $name, $points)
    {
        $stmt = $this->db->prepare("UPDATE classes SET name = ?, points = ? WHERE id = ?");
        $stmt->bind_param("sss", $name, $points, $id);
        $stmt->execute();
        $stmt->close();
    }
    public function indexClass($name)
    {
        $stmt = $this->db->prepare("SELECT * FROM classes WHERE name = ?");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result->num_rows > 0;
    }

    public function getAllClasses()
    {
        $stmt = $this->db->query("SELECT * FROM classes ORDER BY name");
        return $stmt;
    }

    public function removeClass($id)
    {
        $stmt = $this->db->prepare("DELETE FROM classes WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();
    }

    public function getAllStudentsFromClassID($id)
    {
        $stmt = $this->db->prepare("SELECT user_id, name, surname, nr_student, score FROM users WHERE class = ? ORDER BY nr_student");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result;
    }

    public function createScoreTableForClass($name)
    {
        $stmt = $this->db->prepare("CREATE TABLE $name (id INT NOT NULL AUTO_INCREMENT,student_nr INT NOT NULL, PRIMARY KEY (`id`) )");
        $stmt->execute();
        $stmt->close();
    }

    public function addTaskToClassByName($name, $taskName)
    {
        $stmt = $this->db->prepare("ALTER TABLE $name ADD `$taskName` BOOLEAN NOT NULL");
        $stmt->execute();
        $stmt->close();
    }
    public function addTestToClassByName($name, $testName)
    {
        $stmt = $this->db->prepare("ALTER TABLE $name ADD `$testName` VARCHAR(10) NOT NULL");
        $stmt->execute();
        $stmt->close();
    }

    public function checkColumnExistByNameFromClass($class, $name)
    {
        $stmt = $this->db->prepare("SHOW COLUMNS FROM $class LIKE '$name';");
        $stmt->execute();
        $result = $stmt->num_rows;
        $stmt->close();
        return $result;
    }

    public function addStudentToClassByName($name, $student_nr)
    {
        $stmt = $this->db->prepare("INSERT INTO $name (`student_nr`) VALUES ($student_nr);");
        $stmt->execute();
        $stmt->close();
    }

    public function getStudentScoresFromClassTable( $className, $student_nr)
    {
        $stmt = $this->db->prepare("SELECT * FROM $className WHERE student_nr=$student_nr;");
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result;
    }
    
    public function changeClassPoints($className, $points)
    {
        $stmt = $this->db->prepare("SELECT points FROM `classes` WHERE name = ?;");
        $stmt->bind_param("s", $className);
        $stmt->execute();
        $result = $stmt->get_result();
        $result = $result->fetch_row();
        $newPoints = $result[0] + $points;
        $stmt = $this->db->prepare("UPDATE `classes` SET `points` = ? WHERE name = ?;");
        $stmt->bind_param("is", $newPoints, $className);
        $stmt->execute();
        $stmt->close();
    }
    
}
