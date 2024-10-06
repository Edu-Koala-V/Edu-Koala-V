<?php
namespace Core\Views;
use Core\Base\BaseView;

class AdminView extends BaseView{
    
    public function renderTeachers($teachersData){
        $teachersList = $this->teachersHTML($teachersData);
        echo self::renderPage("Nauczyciele",$teachersList,"adminApp");
    }
    private function teachersHTML($teachersData){
        $teachersList = "";
        foreach ($teachersData as $teacher) {
            $teachersList .= "<div class='teacherBox'>";
            $teachersList .= "<span>{$teacher['id']}</span>";
            $teachersList .= "<h2>{$teacher['fname']} {$teacher['sname']} {$teacher['lname']}</h2>";
            $teachersList .= "<a href='/teacher/{$teacher['id']}' class='btn primary'>Zobacz</a>";
            $teachersList .= "</div>";
        }
        $teachersPage = file_get_contents(__DIR__ . "/../../Pages/TeachersPage.html");
        $teachersPage = str_replace("%%TEACHERS%%",$teachersList,$teachersPage);

        return $teachersPage;
    }
    public function renderTeacher($teacherData){
        $teacher = $this->teacherHTML($teacherData);
        echo self::renderPage("Nauczyciel",$teacher,"adminApp");
    }
    private function teacherHTML($teacherData){
        $teacher = "";
        $teacher .= "<h2>{$teacherData['fname']} {$teacherData['sname']} {$teacherData['lname']}</h2>";
        $teacher .= "<p>{$teacherData['login']}</p>";
        $teacher .= "<p>{$teacherData['status']}</p>";
        $teacher .= "<a href='/teacher/{$teacherData['id']}/edit' class='btn primary'>Edytuj</a>";
        $teacher .= "<a href='/teacher/{$teacherData['id']}/delete' class='btn primary'>Usuń</a>";

        return $teacher;
    }
    public function renderAddTeacher(){
        $addTeacher = file_get_contents(__DIR__ . "/../../Pages/AddTeacherPage.html");
        echo self::renderPage("Dodaj nauczyciela",$addTeacher,"adminApp");
    }
    public function renderEditTeacher($teacherData){
        $editTeacher = $this->editTeacherHTML($teacherData);
        echo self::renderPage("Edytuj nauczyciela",$editTeacher,"adminApp");
    }
    private function editTeacherHTML($teacherData){
        $editTeacher = "";
        $editTeacher .= "<h2>{$teacherData['fname']} {$teacherData['sname']} {$teacherData['lname']}</h2>";
        $editTeacher .= "<p>{$teacherData['login']}</p>";
        $editTeacher .= "<p>{$teacherData['status']}</p>";
        $editTeacher .= "<form action='/teacher/{$teacherData['id']}/edit' method='post'>";
        $editTeacher .= "<input type='text' name='fname' value='{$teacherData['fname']}' placeholder='Imię'>";
        $editTeacher .= "<input type='text' name='sname' value='{$teacherData['sname']}' placeholder='Drugie imię'>";
        $editTeacher .= "<input type='text' name='lname' value='{$teacherData['lname']}' placeholder='Nazwisko'>";
        $editTeacher .= "<input type='text' name='login' value='{$teacherData['login']}' placeholder='Login'>";
        $editTeacher .= "<input type='text' name='status' value='{$teacherData['status']}' placeholder='Status'>";
        $editTeacher .= "<button type='submit'>Zapisz</button>";
        $editTeacher .= "</form>";

        return $editTeacher;
    }
    
}