<?php
namespace Core\Views;
use Core\Base\BaseView;

class ClassesView extends BaseView
{
    public function render($classesData) {

        $classesList = $this->classesHTML($classesData);
        echo self::renderPage("Klasy",$classesList,"classesApp");
    }
    private function classesHTML($classesData) {
        $classesList = "";
        foreach ($classesData as $class) {
            $classesList .= "<div class='classBox'>";
            $classesList .= "<span>{$class['id']}</span>";
            $classesList .= "<h2>{$class['name']}</h2>";
            $classesList .= "<a href='/classes/{$class['id']}' class='btn primary'>Zobacz</a>";
            $classesList .= "<p>{$class['students_count']} uczniów</p>";
            $classesList .= "</div>";
        }
        $classesPage = file_get_contents(__DIR__ . "/../../Pages/ClassesPage.html");
        $classesPage = str_replace("%%CLASSES%%",$classesList,$classesPage);

        return $classesPage;
    }

    public function renderStudents($studentsData) {
        $studentsList = $this->studentsHTML($studentsData);
        echo self::renderPage("Uczniowie",$studentsList,"classesApp");
    }
    private function studentsHTML($studentsData) {
        $studentsList = "<div class='classFunctions' data-show-login-status='false'><i class='eye-icon' style='cursor: pointer;'></i> <span>Domyślne hasło to: ZAQ!2wsx1234</span></div>";
        if(is_array($studentsData)){
            foreach ($studentsData as $student) {
                $className = $student['name'];
                    $studentsList .= '<tr>';
            
                    $studentsList .= "<td><i title='ID ucznia: ".$student["id"]."' class='eye-icon show-student-login' style='cursor: pointer;'></i><span class='student-login' style='display: none; '>{$student['login']}</span></td>";
                    switch($student['status']) {
                        case 'new':
                            $studentsList .= "<td><i class='plus-icon' title='Nowe konto'></i></td>";
                            break;
                        case 'blocked':
                            $studentsList .= "<td><i class='blocked-icon' title='Zablokowany'></i></td>";
                            break;
                        case 'suspended':
                            $studentsList .= "<td><i class='suspended-icon' title='Wstrzymany dostęp'></i></td>";
                            break;
                        default:
                            $studentsList .= "<td></td>";
                            break;
                    }
                    $studentsList .= "<td><button class='btn primary reset-passwd'>Zrestartuj hasło</button></td>";
                    $studentsList .= "<td>{$student['student_nr']}</td>";
                    $studentsList .= "<td>{$student['fname']} {$student["sname"]}</td>";
                    $studentsList .= "<td>{$student['lname']}</td>";
                    $studentsList .= "<td><a href='/grades/{$student['id']}' class='btn primary'>Oceny</a></td>";
                    $studentsList .= '</tr>';
                }
        }else{
            $className = $studentsData;
        }
        $studentsInClassPage = file_get_contents(__DIR__ . "/../../Pages/StudentsInClassPage.html");
        $studentsInClassPage = str_replace("%%CLASS_NAME%%",$className,$studentsInClassPage);
        $studentsInClassPage = str_replace("%%STUDENTS%%",$studentsList,$studentsInClassPage);
        return $studentsInClassPage;
    }
}