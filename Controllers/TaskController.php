<?php
require_once  __DIR__ . '/../Models/ArticleModel.php';
require_once  __DIR__ . '/../Views/CMS/ArticleView.php';

class TaskController
{
    private $model;
    private $view;

    public function __construct($model, $view) // Określ który chcesz widok
    {
        $this->model = $model;
        $this->view = $view;
    }
    public function getAllTasksInArray($classesArray)
    {
        $tasks = $this->model->getAllTasks();
        $data = $tasks->fetch_all(MYSQLI_ASSOC);
        $categories = array();
        foreach ($data as $row) {
            $category = $row['category'];
            unset($row['category']);
            $categories[$category][] = $row;
        }
        if ($categories) {
            $this->view->renderTasksTable($data, $classesArray);
        }
        return $categories;
    }

    public function createNewTask()
    {
        $nameTask = $_POST['nameTask'];
        $description = $_POST['description'];
        $category = $_POST['taskCategory'];
        $this->model->createTask($nameTask, $description, $category);
    }
}
