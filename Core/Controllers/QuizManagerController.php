<?php
namespace Core\Controllers;
use Core\Base\BaseController;
use Core\Models\QuizManagerModel;
use Core\Views\QuizManagerView;
use Core\Models\ClassesModel;
class QuizManagerController extends BaseController
{
    public function index()
    {
        $data = QuizManagerModel::getAllQuizzes();
        $view = new QuizManagerView();
        $view->render($data);
    }
    public function activateExam($quiz_id)
    {
        $classes = ClassesModel::getClasses();
        $view = new QuizManagerView();
        $view->renderActivate($classes, $quiz_id);
        //TODO: activate exam
    }
    public function editExam($quiz_id)
    {
        $data = QuizManagerModel::getQuiz($quiz_id);
        $view = new QuizManagerView();
        $view->renderEdit($data);
    }
    public function deleteExam($quiz_id)
    {
        //TODO: delete exam
    }
 
}