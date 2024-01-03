
<?php
require_once  __DIR__ . '/../Models/QuizModel.php';
require_once  __DIR__ . '/../Views/CMS/ArticleView.php';
require_once __DIR__ . '/../Views/Tests/ListOfQuizzes.php';
class QuizController
{
    private $model;
    private $view;
    public function __construct($model, $view) //! Określ który chcesz widok
    {
        $this->model = $model;
        $this->view = $view;
    }

    public function displayQuiz($title) // TODO
    {
        $title = str_replace('-',' ', $title);
        $quiz_id = $this->model->getQuizId($title);
        $quiz_id = mysqli_fetch_row($quiz_id);
        $quiz = $this->model->findQuestions($quiz_id[0]);
        $this->view->renderQuiz($quiz, $title);
    }
    public function createQuiz()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $dataJSON = json_decode(file_get_contents('php://input'), true);
            $title = $dataJSON["titleQuiz"];
            $category = $dataJSON["categoryQuiz"];
            $arrayQuiz = $dataJSON["quizArray"];

            $id = $this->model->createNewQuiz($title, $category);

            $DB_ArrayQueryQuestion = [];
            foreach ($arrayQuiz as $key => $value) {
                array_push($DB_ArrayQueryQuestion, array(
                    "quiz_id" => $id,
                    "question" => $value[0],
                    "answerA" => $value[1],
                    "answerB" => $value[2],
                    "answerC" => $value[3],
                    "answerD" => $value[4],
                    "answer" => $value[5]
                ));
            }
            $this->model->insertQuizContent($DB_ArrayQueryQuestion);
        } else {
            $this->view->renderEditor();
        }
    }

    public function getAllQuizzesInArray($classesArray)
    {
        $quizzes = $this->model->getAllQuizzes();
        $data = $quizzes->fetch_all(MYSQLI_ASSOC);
        $categories = array();
        foreach ($data as $row) {
            $category = $row['category'];
            unset($row['category']);
            $categories[$category][] = $row;
        }
        if ($categories) {
            $this->view->renderQuizzesTable($categories, $classesArray);
        }
        return $categories;
    }

    public function getAllQuizzesInArrayForStudent($classID)
    {
        $tasks = $this->model->getAllQuizzesInArrayForStudent($classID);
        $data = $tasks[1]->fetch_all(MYSQLI_ASSOC);
        $data2 = $tasks[0]->fetch_all(MYSQLI_ASSOC);

        //? Podział tablicy na mniejsze tablice
        $categories = array();
        foreach ($data as $row) {
            $category = $row['category'];
            unset($row['category']);
            $categories[$category][] = $row;
        }
        if ($categories) {
            $this->view->renderQuizzesTable($categories, $data2);
        }
        return $categories;
    }
}
