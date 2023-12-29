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
}
