<?php
namespace Core\Controllers;

use Core\Base\BaseController;
use Core\Models\ArchiveModel;
use Core\Views\ArchiveView;

class ArchiveController extends BaseController {
    private $view;

    public function __construct() {
        $this->view = new ArchiveView();
    }

    /**
     * Wyświetla listę egzaminów archiwalnych.
     */
    public function index() {
        $examsData = ArchiveModel::getExams();
        $archiveExams = array_map(function($exam) {
            return ArchiveModel::getArchiveExams($exam["archive_id"]);
        }, $examsData);
        $this->view->renderExams($archiveExams);
    }

    /**
     * Wyświetla wyniki egzaminów z sesji użytkownika.
     */
    public function indexSessionExamResults() {
        $userChecked = $_SESSION['userChecked'];
        $checkedExamAnswers = $_SESSION['checked'];
        $examData = $_SESSION['exam'];

        $this->view->render($checkedExamAnswers, $userChecked, $examData);
    }

    /**
     * Zapisuje kod HTML egzaminu.
     *
     * @param string $htmlExamCode Kod HTML egzaminu.
     * @param int $quiz_id ID quizu.
     * @param int $points Punkty uzyskane w quizie.
     */
    public static function SaveExamHTML($htmlExamCode, $quiz_id, $points) {
        ArchiveModel::saveExamHTML($htmlExamCode, $quiz_id, $points);
    }

    /**
     * Wyświetla egzamin na podstawie ID i podejścia.
     *
     * @param int $id ID egzaminu.
     * @param int $approach Podejście do egzaminu.
     */
    public function showExam($id, $approach) {
        $examHTML = ArchiveModel::getArchiveExamsHTML($id, $approach);
        $this->view->renderApproach($examHTML);
    }
}