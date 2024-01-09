<?php
require_once  __DIR__ . '/../Models/ClassesModel.php';
require_once  __DIR__ . '/../Views/Dashboards/ListOfArticles.php';

class ClassesController
{
    private $model;
    private $view;

    public function __construct($model, $view)
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
                $this->createScoreTableForClass($name);
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


    public function getAllClassesArray($error = '', $render = true)
    {
        $articles = $this->model->getAllClasses();
        $data = $articles->fetch_all(MYSQLI_ASSOC);
        if ($render) {
            $this->view->renderTable($data, $error);
        } else {
            return $data;
        }
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
        // print_r($data);
        // echo $data[0]["nr_student"];
        $values=[];
        foreach ($data as $student) {
        $result = $this->getStudentScoresFromClassTable( $className, $student["nr_student"]);
        
        array_push($values, mysqli_fetch_row( $result ));
        }
        $fields = mysqli_fetch_fields($result);
        $fieldsNames = [];
        foreach ($fields as $field) {
            array_push($fieldsNames, $field->name);
        }

        
      
        $this->view->renderTableStudentsFromClass($data, $className, $fieldsNames, $values);
    }

    public function createScoreTableForClass($name)
    {
        $this->model->createScoreTableForClass($name);
    }
    public function addTaskToClassByName()
    {
        $className = $_POST["className"];
        $taskName = $_POST["taskName"];

        if ($this->model->checkColumnExistByNameFromClass($className, $taskName) === 0) {
            $this->model->addTaskToClassByName(strtolower($className), $taskName);
        }
    }
    public function addTestToClassByName()
    {
        $className = $_POST["className"];
        $testName = $_POST["quizName"];
        if ($this->model->checkColumnExistByNameFromClass($className, $testName) === 0) {
            $this->model->addTestToClassByName($className, $testName);
        }
    }

    public function addStudentToClassByName($name, $student_nr)
    {
        $this->model->addStudentToClassByName($name, $student_nr);
    }
    public function getStudentScoresFromClassTable( $className, $student_nr)
    {
        return $this->model->getStudentScoresFromClassTable( $className, $student_nr);
    }


    public function changeClassPoints()
    {
        $className = $_POST["className"];
        $points = $_POST["point"];
        $this->model->changeClassPoints($className, $points);
    }
}
