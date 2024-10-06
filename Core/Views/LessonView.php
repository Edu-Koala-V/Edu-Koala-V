<?php
namespace Core\Views;
use Core\Base\BaseView;
use DateTime, DateTimeZone;

use Core\Views\Components\BlockSortingComponent;
use Core\Views\Components\QuestionComponent;


class LessonView extends BaseView{
    public function render($lessonsData, $quizData = null) {
        
        $lessonsData = $this->lessonsArt(
            $quizData,
            $lessonsData[0]["created_at"],
            $lessonsData[0]["updated_at"],
            $lessonsData[0]["authors"],
            $lessonsData[0]["json_link"],
            $lessonsData[0]["id"]
        );

        $filesJS_CSS_NAME="lessonApp";
        if(isset($_SESSION["user"]["privileges"]) && $_SESSION["user"]["privileges"] != "student"){
            $filesJS_CSS_NAME="lessonEditorApp";
        }
        echo self::renderPage("Lekcja",$lessonsData,$filesJS_CSS_NAME);
    }

    public function lessonsArt($quizData = null, $created_at, $updated_at, $authors, $json_link, $lessonID){ 
        {
        $componentLessonListHTML = file_get_contents(__DIR__ . "/../../Pages/Components/Lesson.html");
        $authorsList ="<ul>";
        $authors = json_decode($authors);
        foreach($authors as $author){
            $authorsList .= "<li>".$author."</li>";
        }
        $authorsList .= "</ul>";
        
        $content = '
        
                    <header class="article-header" data-content="'.$json_link.'" data-lesson-id="'.$lessonID.'">
                        <h1 class="header-lesson-title"></h1>
                        <p>Data publikacji: '.$this->dateToPolishText($created_at).'</p>
                        <p>Ostatnio zaktualizowane: '.$this->dateToPolishText($updated_at).'</p>
                    </header>
                    <article>
                    <section id="authors"><h2>Autorzy:</h2>
                    '.$authorsList.'</section>
                    </article>
                    
                    ';
        ob_start();
        $htmlArtContent = str_replace('%%ARTICLE_CONTENT%%', $content, $componentLessonListHTML);

        if($quizData !== null) {
            $quizHTMLElements = $this->quizArt($quizData);
            $htmlArtContent = str_replace('%%QUIZ_CONTENT%%', $quizHTMLElements, $htmlArtContent);
        }else{
            $htmlArtContent = str_replace('%%QUIZ_CONTENT%%', "", $htmlArtContent);
        }
       
        echo $htmlArtContent;
        return ob_get_clean();
    }
}




    function quizArt($quizData){

        $questionHTML = "";
        $questionNumber = 1;
        foreach($quizData as $key => $value) {  
            switch($value["type"]){
                case "radio":
                    $questionHTML.= QuestionComponent::getElementHTML("radio",$value,$questionNumber);
                    break;
                case "block_sorting":
                    $questionHTML.= BlockSortingComponent::getElementHTML($value,$questionNumber);
                    break;
                case "checked":
                    $questionHTML.= QuestionComponent::getElementHTML("checkbox",$value,$questionNumber);
                    break;
            }
            $questionNumber++;
        }
        return $questionHTML;
    }



    private function dateToPolishText($dateStringDB){
        $date= new DateTime($dateStringDB);
        $date->setTimeZone(new DateTimeZone("Europe/Warsaw"));

        $monthNames = [
            '01' => 'styczeń',
            '02' => 'luty',
            '03' => 'marzec',
            '04' => 'kwiecień',
            '05' => 'maj',
            '06' => 'czerwiec',
            '07' => 'lipiec',
            '08' => 'sierpień',
            '09' => 'wrzesień',
            '10' => 'październik',
            '11' => 'listopad',
            '12' => 'grudzień'
        ];

        $monthNumber = $date->format('m');
        $monthName = $monthNames[$monthNumber];

        return $date->format("d") . ' ' . $monthName . ' ' . $date->format("Y");
    }

}