<?php
namespace Core\Controllers;

use Core\Base\BaseController;
use Core\Base\BaseStringURL;
use Core\Models\CourseModel;
use Core\Models\LessonModel;
use Core\Models\TopicsModel;
use Core\Views\TopicsView;

class TopicsController extends BaseController {

    /**
     * Pobiera tematy na podstawie nazwy kursu.
     * 
     * @param string $courseName Nazwa kursu lub jego ID.
     */
    public function getTopics($courseName) {
        if ($this->isCourseID($courseName)) {
            // $courseName zawiera tylko cyfry, traktujemy jako ID kursu
            $this->getTopicsJSON($courseName);
            return;
        }
        $this->getTopicsByName($courseName);
    }

    /**
     * Sprawdza, czy podana wartość jest ID kursu.
     * 
     * @param string $courseName Nazwa kursu lub jego ID.
     * @return bool True, jeśli $courseName zawiera tylko cyfry.
     */
    private function isCourseID($courseName) {
        return ctype_digit($courseName);
    }

    /**
     * Pobiera tematy na podstawie nazwy kursu i renderuje widok.
     * 
     * @param string $courseName Nazwa kursu.
     */
    private function getTopicsByName($courseName) {
        $courseName = BaseStringURL::convertURLToString($courseName);
        $TopicsRef = TopicsModel::getTopics($courseName);

        $view = new TopicsView();
        $view->render($TopicsRef, $courseName);
    }

    /**
     * Pobiera tematy na podstawie ID kursu i zwraca je w formacie JSON.
     * Metoda w przypadku gdy użytkownik jest studentem lub gościem przekierowuje na stronę główną kursów.
     *
     *  @param int $courseID ID kursu.
     */
    public function getTopicsJSON($courseID) {
        if($_SESSION['user']['privileges'] == 'student' || $_SESSION['user']['privileges'] == 'guest') {
            header("Location: /courses");
            return false;
        }
        $Topics = TopicsModel::getTopicsByID($courseID);
        self::echo_asJSON($Topics);
    }

    public function setNewTitleName() {
        
        $requestData = $requestData = self::getRequestData();
        if(isset($requestData['titleData']) && isset($requestData['lessonData']) && isset($requestData['CourseName'])) {
            $courseName = $requestData['CourseName'];
            $courseID = CourseModel::getCourseID($courseName)['id'];
        if(!$courseID) {
            // return self::echo_asJSON(["error" => "Brak kursu"]);
            $courseID=1;
        }
            $titleData = $requestData['titleData'];
            $lessonData = $requestData['lessonData'];
            foreach ($titleData as $vale) {
                TopicsModel::updateTopicName($vale[1], $vale[0]);
            }
            foreach ($lessonData as $key => $lessons) {
                $position = 0;
                foreach ($lessons as $lesson) {
                    if($lesson[0] === "new"){
                        TopicsModel::addTopic( $courseID, $lesson[2], $lesson[1], $position);
                        continue;
                    }
                    LessonModel::updateLessonTitle($lesson[1], $lesson[0]);
                    TopicsModel::updateLessonPosition($lesson[0], $position);
                    // self::echo_asJSON(["lesson_id" => $lesson[0], "lesson_title" => $lesson[1], "lesson_group" => $lesson[2], "course_id" => $courseID]);
                    $position++;
                }
            }
            return self::echo_asJSON(["titleData" => $titleData, "lessonData" => $lessonData]);
        }
        return self::echo_asJSON(["error" => "Brak danych"]);        
    }
    
}