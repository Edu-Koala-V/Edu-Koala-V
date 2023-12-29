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
}
