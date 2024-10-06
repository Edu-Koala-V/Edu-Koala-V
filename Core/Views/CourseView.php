<?php
namespace Core\Views;
use Core\Base\BaseView;
use Core\Base\BaseStringURL;
class CourseView extends BaseView{
    public function render($courseData) {

        $courseCard = $this->courseCard($courseData);
        echo self::renderPage("Kursy",$courseCard,"courseApp");
    }

    public function courseCard($courseData) {
        $componentCourseHTML = file_get_contents(__DIR__ . "/../../Pages/Components/Course-Wrapper.html");

        ob_start();
        echo "<div id='course-container'>";
        foreach($courseData as $course){
            $htmlElement = str_replace('%%COURSE_ID%%', $course['id'], $componentCourseHTML);
            $htmlElement = str_replace('%%COURSE_TITLE_LINK%%', BaseStringURL::convertStringToURL($course['title_description']) , $htmlElement);
            $htmlElement = str_replace('%%COURSE_TITLE_DESCRIPTION%%', $course['title_description'], $htmlElement);
            echo $htmlElement;
        }
        echo "</div>";
        
        return ob_get_clean();
    }
}