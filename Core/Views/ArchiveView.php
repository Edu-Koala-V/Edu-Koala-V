<?php
namespace Core\Views;
use Core\Base\BaseView;
use Core\Views\Components\QuestionComponent;
use Core\Views\Components\BlockSortingComponent;
use Core\Controllers\ArchiveController;
class ArchiveView extends BaseView
{
    private  $points = 0;
    public function render($checkedExamAnswers, $userChecked, $data, $lastDate = null)
    {
        if(isset($_SESSION['examHTML'])){
            $htmlExamCode = $_SESSION['examHTML'];
        }else{
            $htmlExamCode = $this->examHTML($checkedExamAnswers, $userChecked, $data);
        }
        
        echo self::renderPage("testWiedzy",$htmlExamCode,"examApp");
        ArchiveController::SaveExamHTML($htmlExamCode, $data['id'], $this->points);
        $_SESSION['examHTML'] = NULL;
    }

    public function examHTML($checkedExamAnswers, $userChecked, $data)
    {
        $questionNumber = 0;

        $html = file_get_contents(__DIR__ . "/../../Pages/ExamPage.html");
        $html = str_replace('%%EXAM_TITLE%%', $data['name'], $html);
        $html = str_replace('%%EXAM_ID%%', $data['id'], $html);
        $html = str_replace('%%RESULT%%', $this->resultHTML($checkedExamAnswers, $data), $html);
        $questionsHTML = "";
        foreach ($data['questions'] as $key => $question) {
            $questionNumber++;
            $questionsHTML .= QuestionComponent::getElementHTML($question['type'], $question, $questionNumber, $checkedExamAnswers, $userChecked);
        }
        $html = str_replace('%%QUESTIONS%%', $questionsHTML, $html);
        $html = str_replace('%%BTN_END_QUIZ%%', "", $html);
        $html = str_replace('%%BTN_END_QUIZ%%', "", $html);//TODO: Dadaj czas na rozwiązanie

        return $html;
    }

    private function resultHTML($checkedExamAnswers, $data){
        $maxPoints = 0;
        $points = 0;
        foreach($checkedExamAnswers as $key => $value){
            foreach($value[1] as $item){
                if($item== "true"){
                    $points += 1;
                }
            }
        }
        $this->points = $points;
        foreach($data['questions'] as $key => $value){
            $maxPoints += $value['points'];
        }
        $percentage = ($points/$maxPoints)*100;
        $score = $this->getScoreOnPoints($percentage);
        $resultHTML = '
            <div id="quiz-results">
                <p id="quiz-results-text">Wynik '.$points.'/'.$maxPoints.' - '.$percentage.'%</p>
                <p id="quiz-results-grade">Ocena: '.$score[0].'</p>
                <p id="quiz-results-comment">Komentarz: '.$score[1].'</p>
            </div>
        ';
        return $resultHTML;
    }
    private function getScoreOnPoints($percentage){
        if ($percentage >= 90) {
            return ["(5) Bardzo dobry", "Gratulacje! Bardzo dobrze ci poszło."];
        } elseif ($percentage >= 70) {
            return ["(4) Dobry", "Dobrze ci poszło, ale mogło być lepiej."];
        } elseif ($percentage >= 60) {
            return ["(3) Dostateczny", "Średnio ale stabilnie. Możesz lepiej!"];
        } elseif ($percentage >= 40) {
            return ["(2) Dopuszczajacy", "Nie jest źle, ale mogło być lepiej."];
        } elseif ($percentage >= 0) {
            return ["(1) Niedostateczny", "Niestety nie zdobyłeś wymaganej ilości punktów."];
        } else {
            return ["(0) Błąd", "Wystąpił błąd podczas obliczania wyniku."];
        }
    }




    public function renderExams($examsData)
    {
        echo self::renderPage("Archiwum",$this->examsListHTML($examsData),"archiveApp");
    }

   private function examsListHTML($examsData)
    {
        $examsList = '
         <table class="archive">
                <tr>
                    <th>Nazwa testu</th>
                    <th>Najlepszy czas rozwiązania</th>
                    <th>Wynik w pierwszym podejściu</th>
                    <th>Data pierwszego podejścia</th>
                    <th>Szczegóły pierwszego podejścia</th>
                    <th>Wynik w drugim podejściu</th>
                    <th>Data drugiego podejścia</th>
                    <th>Szczegóły drugiego podejścia</th>

                </tr>
                ';
        if(empty($examsData[0])){
            $examsList .= '
                <tr>
                    <td colspan="8" class="text-center">Brak testów w archiwum</td>
                </tr>
            ';
        }
        foreach ($examsData as $key => $exam) {
            if(isset($exam[0]['time']))
            {

           
            $seconds = $exam[0]['time'];
            $minutes = floor($seconds / 60);
            $remainingSeconds = $seconds % 60;
            $timeFormatted = sprintf('%02d:%02d', $minutes, $remainingSeconds);

            $examsList .= '
           
                
                <tr>
                    <td>'.$exam['quiz_name'].'</td>
            


                    <td>'.$timeFormatted.'</td>

                    <td>'.$exam[0]['score_one'].'/'.$exam['max_points'].' - '.
                    $this->getScoreOnPoints($exam[0]['score_one']/$exam['max_points'] * 100)[0].
                    '</td>
                    <td>'.$exam[0]['date_approach_one'].'</td>
                    <td><a href="/archiwum/'.$exam[0]['id'].'/1">Zobacz szczegóły</a></td>';
            if(isset($exam[0]['score_two'])){
                $examsList .= '
                <td>'.$exam[0]['score_two'].'/'.$exam['max_points'].' - '.
                $this->getScoreOnPoints($exam[0]['score_two']/$exam['max_points'] * 100)[0].
                '</td>
                <td>'.$exam[0]['date_approach_two'].'</td>
                <td><a href="/archiwum/'.$exam[0]['id'].'/2">Zobacz szczegóły</a></td>';
            }
          
            $examsList .= '    
                </tr>
            ';
            }
        }
        $examsList .= '</table>';
        return $examsList;
    }
    public function renderApproach($examHTML)
    {
        echo self::renderPage("Archiwum Test",json_decode($examHTML),"examApp");
    }
}

