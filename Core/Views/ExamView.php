<?php
namespace Core\Views;
use Core\Base\BaseView;
use Core\Views\Components\QuestionComponent;
use Core\Views\Components\BlockSortingComponent;
use DateTime;
class ExamView extends BaseView
{
    public function render($data)
    {
        echo self::renderPage("Test wiedzy - ".$data['name'],$this->examHTML($data),"examApp");
    }

    public function examHTML($data)
    {
        $endQuizBtnHTML = '<button class="quiz-end btn primary" type="submit" aria-label="Kliknij gdy bedziesz pewien że chcesz zakończyć test." title="Kliknij gdy bedziesz pewien że chcesz zakończyć test.">Zakończ test</button>';
        $questionNumber = 0;

        $html = file_get_contents(__DIR__ . "/../../Pages/ExamPage.html");
        $html = str_replace('%%EXAM_TITLE%%', $data['name'], $html);
        $html = str_replace('%%EXAM_ID%%', $data['id'], $html);
        $html = str_replace('%%RESULT%%', "", $html);
        $html = str_replace('%%TIME%%', $data["questions"][0]["time"], $html);

        $questionsHTML = "";
        foreach ($data['questions'] as $key => $question) {
            $questionNumber++;
            $questionsHTML .= QuestionComponent::getElementHTML($question['type'], $question, $questionNumber);
        }
        $html = str_replace('%%QUESTIONS%%', $questionsHTML, $html);
        $html = str_replace('%%BTN_END_QUIZ%%', $endQuizBtnHTML, $html);
        return $html;
    }

    public function renderExams($data)
    {
        echo self::renderPage("Testy wiedzy",$this->examApproachHTML($data),"examApp");
    }

    private function examApproachHTML($data)
    {
        $html = file_get_contents(__DIR__ . "/../../Pages/ExamApproachPage.htm");
        $examData = "";
        $html = str_replace('%%TIME%%', "", $html);
        if(empty($data)){
            $html = str_replace('%%EXAM_INFO%%', "<tr><td colspan='3'>Brak aktywnych testów</td></tr>", $html);
            return $html;
        }
        foreach($data as $examInfo){
            $examData .= "<tr>";
            $examData .= "<td>".$examInfo['name']."</td>";
            if($examInfo['date_approach_one'] != NULL){
                $examData .= "<td>".$examInfo['date_approach_one']."</td>";
            }
            else{
                $examData .= "<td><a href='/testy/".$examInfo["quiz_id"].">Przejdź do testu</a></td>";
            }


            $dateApproachOne = new DateTime($examInfo['date_approach_one']);
            $dateApproachOne->modify('+14 days');
            $currentDate = new DateTime();

            $interval = $currentDate->diff($dateApproachOne);
            $daysRemaining = $interval->format('%a')+1;
             
            if($examInfo['approach_two_activate'] && $examInfo['date_approach_two'] == NULL){
                $examData .= "<td><a href='/testy/".$examInfo["quiz_id"]."'>Przejdź do testu</a></td>";
            }else if($examInfo['date_approach_two'] != NULL){
                $examData .= "<td>".$examInfo['date_approach_two']."</td>";
            }
            else if ($currentDate < $dateApproachOne) {
                $examData .= "<td>Test dostępny za $daysRemaining dni</td>";
            }
            else {
                $examData .= "<td>Poproś nauczyciela aby aktywował drugie podejście</td>";
            }
            $examData .= "</tr>";
        }
        $html = str_replace('%%EXAM_INFO%%', $examData, $html);
        return $html;
    }
}