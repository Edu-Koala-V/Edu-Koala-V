<?php
namespace Core\Views;
use Core\Base\BaseView;
use Core\Models\QuizManagerModel;
use Core\Views\Components\QuestionComponent;
use Core\Services\Github\GetAllFileNameFromGithubRepo;

class QuizManagerView extends BaseView
{
    public function render($data)
    {
        $lessonsData = $this->renderContent($data);
        echo self::renderPage("Zarządzanie testami",$lessonsData,"ExamsManagerApp");
    }

    public function renderEdit($data)
    {
        $lessonsData = $this->renderEditContent($data);
        echo self::renderPage("Edycja testu",$lessonsData,"quizManagerApp");
    }

    private function renderContent($data)
    {
        $quizListManagePage = file_get_contents(__DIR__ . "/../../Pages/quizListManagePage.html");
        $quizListHTML = "";
        foreach($data as $value){
            $quizListHTML .= '
                 <tr>
                <td>'.$value["id"].'</td>
                <td>'.$value["name"].'</td>
                <td>
                    <a href="/testy-aktywacja/'.$value["id"].'" class="btn secondary">Aktywacja dla klas i uczniów</a>
                    <a href="/testy-edycja/'.$value["id"].'" class="btn primary">Edytuj</a>
                    <a href="/quiz-delete/'.$value["id"].'" class="btn danger">Usuń</a>
                </td>
                </tr>
            ';
        }
        $html = str_replace("%%QUIZ_LIST%%", $quizListHTML, $quizListManagePage);
        return $html;
    }

    private function renderEditContent($data)
    {
        $quizEditPage = file_get_contents(__DIR__ . "/../../Pages/quizEditPage.html");
        $html = str_replace("%%QUIZ_NAME%%", $data[0]["name"], $quizEditPage);
        $html = str_replace("%%DATA_GITHUB_IMG%%", $this->getResources("IMAGES"), $html);
        $questionHTML = "";
        foreach($data as $value){
            $questionHTML .= QuestionComponent::getElementHTML($value['type'], $value, 'X');
        }
        $html = str_replace("%%QUESTIONS%%", $questionHTML, $html);
        return $html;
    }
    private function getResources($path)
    {
        $github = new GetAllFileNameFromGithubRepo();
        $files = $github->getFiles($path);
        return json_encode($files);
    }

    public function renderActivate($classes, $quiz_id)
    {
        $quizActivatePage = file_get_contents(__DIR__ . "/../../Pages/quizActivatePage.html");
        $classHTML = "";
        foreach($classes as $value){
        $studentsHTML = "";
        $classDataHTML = "";
        $classDataHTML= str_replace("%%CLASS_NAME%%", $value["name"], $quizActivatePage);
        $classDataHTML= str_replace("%%CLASS_ID%%", $value["id"], $classDataHTML);
        $classDataHTML= str_replace("%%QUIZ_ID%%", $quiz_id, $classDataHTML);
        $classHTML.= $classDataHTML;
            $students = QuizManagerModel::getStudentsByClass($value["id"]);
            foreach($students as $student){
                $studentsHTML.= '

                <div class="studentActivateBox"> '.$student["student_nr"].' '.$student["fname"].' '.$student["sname"].' '.$student["lname"];
                if(isset($student["time"])){
                    $studentsHTML.= '  
                    <div class="extendedTime"><input type="checkbox" name="time_student_'.$student["id"].'" id="time_student_'.$student["id"].'" data-time="'.$student["time"].'"> Przedłużony czas</div>
                    <input type="checkbox" checked name="student_'.$student["id"].'" id="student_'.$student["id"].'">';
                }else{
                $studentsHTML.= '  
                <div class="extendedTime"><input type="checkbox" name="time_student_'.$student["id"].'" id="time_student_'.$student["id"].'"> Przedłużony czas</div>
                <input type="checkbox" name="student_'.$student["id"].'" id="student_'.$student["id"].'">';
                }
                $studentsHTML.= '</div>
                <div class="studentApproachBox"> Data pierwszego podejścia: '.$student["date_approach_one"].' </div>
                <div class="studentApproachBox"> Data drugiego podejścia: '.$student["date_approach_two"].' </div>';
                if($student["date_approach_one"] != NULL){
                    $studentsHTML.= '
                    <div class="approach_two"><input type="checkbox" name="approach_two_student_'.$student["id"].'" id="approach_two_student_'.$student["id"].'">Rozpocznij drugie podejście</div>
                    ';
                }else{
                    $studentsHTML.= '
                    <div class="approach_two"><input disabled type="checkbox" name="approach_two_student_'.$student["id"].'" id="approach_two_student_'.$student["id"].'">Rozpocznij drugie podejście [Uczeń nie podszedł do pierwszego podejścia]</div>
                    ';
                }
            }
            $classHTML = str_replace("%%STUDENTS%%", $studentsHTML, $classHTML);
        }
        echo self::renderPage("Aktywacja testu",$classHTML,"ActiveExamsManagerApp");

    }

}