<?php
namespace Core\Views;

use Core\Base\BaseView;
use Core\Base\BaseStringURL;

class TopicsView extends BaseView {

    /**
     * Renderuje stronę z listą lekcji.
     * 
     * @param array $lessonsData Dane lekcji.
     * @param string $courseName Nazwa kursu.
     */
    public function render($lessonsData, $courseName) {
        $lessonsHTML = $this->lessonsList($lessonsData);
        $filesJS_CSS_NAME = "lessonApp";
        if(isset($_SESSION["user"]["privileges"]) && $_SESSION["user"]["privileges"] != "student"){
            $filesJS_CSS_NAME="lessonEditorApp";
        }

        echo self::renderPage("Lekcje - " . $courseName, $lessonsHTML, $filesJS_CSS_NAME);
    }

    /**
     * Generuje listę lekcji w formacie HTML.
     * 
     * @param array $lessonsData Dane lekcji.
     * @return string HTML lista lekcji.
     */
    public function lessonsList($lessonsData) {
        $url = $_SERVER['REQUEST_URI'];
        $componentLessonListHTML = file_get_contents(__DIR__ . "/../../Pages/Components/Lesson-Topics-List.html");
        $componentLessonGroupHTML = file_get_contents(__DIR__ . "/../../Pages/Components/Lesson-Group.html");
        ob_start();

        $topicGroups = $this->groupLessonsByGroup($lessonsData, $componentLessonListHTML, $url);
        $groupNames = $this->extractGroupNames($lessonsData);

        $this->renderLessonGroups($topicGroups, $groupNames, $componentLessonGroupHTML);

        return ob_get_clean();
    }

    /**
     * Grupuje lekcje według grupy.
     * 
     * @param array $lessonsData Dane lekcji.
     * @param string $componentLessonListHTML Szablon HTML dla pojedynczej lekcji.
     * @param string $url Bieżący URL.
     * @return array Pogrupowane lekcje.
     */
    private function groupLessonsByGroup($lessonsData, $componentLessonListHTML, $url) {
        $topicGroups = [];
        foreach ($lessonsData as $lessonRef) {
            $htmlElement = str_replace('%%LESSON_ID%%', $lessonRef['lesson_id'], $componentLessonListHTML);
            $htmlElement = str_replace('%%LESSON_TITLE%%', $lessonRef['title'], $htmlElement);
            $htmlElement = str_replace('%%LESSON_URL%%', $url . '/' . BaseStringURL::convertStringToURL($lessonRef['title']), $htmlElement);
            $topicGroups[$lessonRef['lesson_group']][] = $htmlElement;
        }
        return $topicGroups;
    }

    /**
     * Wyodrębnia unikalne nazwy grup z danych lekcji.
     * 
     * @param array $lessonsData Dane lekcji.
     * @return array Unikalne nazwy grup.
     */
    private function extractGroupNames($lessonsData) {
        $groupNames = [];
        $groupIDs = [];
        foreach ($lessonsData as $lessonRef) {
            if (!in_array($lessonRef['name'], $groupNames)) {
                $groupNames[] = $lessonRef['name'];
                $groupIDs[] = $lessonRef['lesson_group_id'];
            }
        }
        return $groupNames;
    }

    /**
     * Renderuje grupy lekcji.
     * 
     * @param array $topicGroups Pogrupowane lekcje.
     * @param array $groupNames Nazwy grup.
     * @param string $componentLessonGroupHTML Szablon HTML dla grupy lekcji.
     */
    private function renderLessonGroups($topicGroups, $groupNames, $componentLessonGroupHTML) {
        $i = 0;
        foreach ($topicGroups as $groupID => $groupContent) {
            $htmlElementWrap = str_replace('%%LESSON_LIST_CONTENT%%', implode("", $groupContent), $componentLessonGroupHTML);
            $htmlElementWrap = str_replace('%%LESSON_GROUP_NAME%%', $groupNames[$i], $htmlElementWrap);
            $htmlElementWrap = str_replace('%%LESSON_GROUP_ID%%', $groupID, $htmlElementWrap);
            echo $htmlElementWrap;
            $i++;
        }
    }
}