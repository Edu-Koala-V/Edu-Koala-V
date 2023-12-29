<?php
require_once  __DIR__ . '/../Models/ClassesModel.php';
require_once  __DIR__ . '/../Views/Dashboards/ListOfArticles.php'; // TODO

class ClassesController
{
    private $model;
    private $view;

    public function __construct($model, $view) // Określ który chcesz widok
    {
        $this->model = $model;
        $this->view = $view;
    }

    public function createClass()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['className'];
            if (!$this->model->indexClass($name)) {
                $this->model->createClass($name);
                $this->getAllClassesArray();
            }
        } else {
            $this->getAllClassesArray("Klasa o tej nazwie już istnieje.");
        }
    }

    public function displayClass($name)
    {
        $class = $this->model->indexClass($name);
        if ($class) {
            $this->view->renderClass($class);
        } else {
            http_response_code(404);
        }
    }


    public function getAllClassesArray($error = '')
    {
        $articles = $this->model->getAllClasses();
        $data = $articles->fetch_all(MYSQLI_ASSOC);
        $this->view->renderTable($data, $error);
    }

    public function removeClass()
    {
        $id = $_POST['classID'];
        $this->model->removeClass($id);
        $this->getAllClassesArray();
    }

    public function getAllStudentsFromClassID()
    {
        $id = $_GET['classID'];
        $className = $_GET["className"];
        $students = $this->model->getAllStudentsFromClassID($id);
        $data = $students->fetch_all(MYSQLI_ASSOC);
        $this->view->renderTableStudentsFromClass($data, $className);
    }
}
