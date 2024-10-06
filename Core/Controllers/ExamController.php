<?php
/**
 * Kontroler obsługujący egzaminy.
 * 
 * Zawiera następujące metody:
 * - index() - wyświetla wszystkie aktywowane egzaminy uczniowi
 * - renderExam($model, $quiz_id) - renderuje egzamin na podstawie quiz_id
 * - renderArchivedExams($model, $archivedApproachExamsID) - renderuje zarchiwizowane egzaminy
 * - approachTwoExam($id) - obsługuje podejście do egzaminu na podstawie id
 * - checkExam() - sprawdza egzamin na podstawie danych z requestu
 * - checkQuestion($value) - sprawdza pojedyncze pytanie
 * - activateExam($quizID) - aktywuje egzamin na podstawie quizID
 * 
 */
namespace Core\Controllers;

use Core\Models\ExamModel;
use Core\Views\ExamView;
use Core\Base\BaseController;

class ExamController extends BaseController
{
    private $view;

    public function __construct() {
        $this->view = new ExamView();
    }

    /**
     * Metoda wyświetlająca wszystkie aktywowane egzaminy uczniowi.
     */
    public function index()
    {
        $model = new ExamModel();
        $allActivatedExams = $model->getAllActivatedExams();
        $archivedApproachExamsID = array_filter($allActivatedExams, function($exam) {
            return $exam['archive_id'] !== NULL;
        });
        if (!empty($allActivatedExams) && empty($archivedApproachExamsID)) {
            $this->renderExam($model, $allActivatedExams[0]['quiz_id']);
        } else {
            $this->renderArchivedExams($model, array_column($archivedApproachExamsID, 'archive_id'));
        }
    }

    /**
     * Metoda renderująca egzamin na podstawie quiz_id.
     * 
     * @param ExamModel $model
     * @param int $quiz_id
     */
    private function renderExam($model, $quiz_id)
    {
        $dateExam = $model->getExam($quiz_id);
        $data = ["name" => $dateExam[0]['name'], "id" => $dateExam[0]['id'], "questions" => $dateExam];
        $_SESSION['exam'] = $data;
        $this->view->render($data);
    }

    /**
     * Metoda renderująca zarchiwizowane egzaminy.
     * 
     * @param ExamModel $model
     * @param array $archivedApproachExamsID
     */
    private function renderArchivedExams($model, $archivedApproachExamsID)
    {
        if (empty($archivedApproachExamsID)) {
            $this->view->renderExams([]);
        } else {
            $archivedApproachExamsFullData = $model->getArchivedApproachExams($archivedApproachExamsID);
            $this->view->renderExams($archivedApproachExamsFullData);
        }
    }

    /**
     * Metoda obsługująca podejście do egzaminu na podstawie id.
     * 
     * @param int $id
     */
    public function approachTwoExam($id)
    {
        $model = new ExamModel();
        if ($model->isShowExam($id)) {
            $this->renderExam($model, $id);
        } else {
            header("Location: /testy");
        }
    }

    /**
     * Metoda sprawdzająca egzamin na podstawie danych z requestu.
     */
    public function checkExam()
    {
        $request = self::getRequestData();
        if (!isset($request['examData'])) {
            return;
        }

        $userChecked = [];
        $questionChecked = [];
        $data = json_decode($request['examData']);

        foreach ($data as $key => $value) {
            $questionChecked[$key] = $this->checkQuestion($value->userCheckedData);
            if (!is_int($questionChecked[$key][0])) {
                return self::echo_asJSON($questionChecked[$key]);
            }
            $userChecked[$key] = $value->userCheckedData;
        }

        $_SESSION['userChecked'] = $userChecked;
        $_SESSION['checked'] = $questionChecked;

        self::echo_asJSON(["gotoLocation" => "/wynik"]);
    }

    /**
     * Metoda sprawdzająca pojedyncze pytanie.
     * 
     * @param array $value
     * @return array
     */
    private function checkQuestion($value)
    {
        $correct = 0;
        $answers = [];
        $key = $value[0]->questionID;
        $answer = $_SESSION['correct'][$key];

        foreach ($value as $item) {
            $corrected = in_array($item->answerRelID, $answer);
            $answers[$item->answerRelID] = $corrected ? "true" : "false";
            $correct += $corrected ? 1 : -1;
        }

        return [$correct < 0 ? 0 : $correct, $answers];
    }

    /**
     * Metoda aktywująca egzamin na podstawie quizID.
     * 
     * @param int $quizID
     */
    public function activateExam($quizID)
    {
        $request = self::getRequestData();
        if (!isset($request['classID']) || !isset($request['students']) || !isset($quizID)) {
            return;
        }

        $students = $request['students'];
        $classID = $request['classID'];
        $model = new ExamModel();
        $model->activateExam($quizID, $classID, $students);

        self::echo_asJSON(["status" => "success", "message" => "Test został aktywowany."]);
    }
}