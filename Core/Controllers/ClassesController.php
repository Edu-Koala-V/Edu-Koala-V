<?php
namespace Core\Controllers;

use Core\Models\ClassesModel;
use Core\Views\ClassesView;
use Core\Base\BaseController;

class ClassesController extends BaseController
{
    /**
     * Wyświetla listę klas.
     */
    public function index()
    {   
        $classes = ClassesModel::getClasses();
        $view = new ClassesView();
        $view->render($classes);
    }

    /**
     * Zwraca listę klas w formacie JSON.
     */
    public function getClasses()
    {
        if ($_SESSION['user']['privileges'] !== 'student' && $_SESSION['user']['privileges'] !== 'guest') {
            $classes = ClassesModel::getClasses();
            self::echo_asJSON($classes);
        }  
    }

    /**
     * Wyświetla listę uczniów w danej klasie.
     * @param int $classId Identyfikator klasy
     */
    public function studentsList($classId)
    {
        $students = ClassesModel::getStudents($classId);
        $view = new ClassesView();
        if (empty($students)) {
            // return header("Location: /classes");
            $className = ClassesModel::getClassName($classId);
            return $view->renderStudents($className);
        }
        $view->renderStudents($students);
    }

    /**
     * Zwraca listę uczniów w formacie JSON.
     */
    public function getStudents()
    {
        if ($_SESSION['user']['privileges'] != 'teacher') {
            return;
        }
        $request = self::getRequestData();
        $classID = $request['classID'];
        $students = ClassesModel::getStudents($classID);
        self::echo_asJSON($students);
    }

    /**
     * Dodaje nową klasę i zwraca informację o id i nazwie klasy jako JSON.
     */
    public function addClass()
    {
        $request = self::getRequestData();
        if (!isset($request['className']) || empty($request['className']) || $_SESSION['user']['privileges'] == 'student') {
            return;
        }
        $className = $request['className'];
        $teacherId = $_SESSION['user']['id'];

        if (ClassesModel::addClass($className, $teacherId)) {

            $addedClassData = ClassesModel::getClassByName($className);
            // Wybieranie kluczy, które mają zostać zachowane w tablicy asocjacyjnej $addedClassData
            $keysToKeep = ["id", "name"];
            $classData = array_intersect_key($addedClassData, array_flip($keysToKeep));

            self::echo_asJSON(["added" => "true","classData"=>$classData]);
        } else {
            self::echo_asJSON(["added" => "false"]);
        }
    }

    /**
     * Dodaje ucznia do klasy.
     * @requires $request['FName']
     * @requires $request['LName']
     * @requires $request['NR']
     * @requires $request['classID']
     */
    public function addStudentInClass()
    {
        $request = self::getRequestData();
        
        if (!isset($request['FName']) || empty($request['FName']) ||
            !isset($request['LName']) || empty($request['LName']) ||
            !isset($request['NR']) || empty($request['NR']) ||
            !isset($request['classID']) || empty($request['classID'])) {
            return;
        }

        $Fname = $request['FName'];
        $Sname = $request['SName'];
        $Lname = $request['LName'];
        $NR = $request['NR'];
        $classId = $request['classID'];

        $account = $this->createUserAccount($Fname, $Lname, $NR, $classId);
        if (is_array($account) && $account["status"] == 'success') {
            $accountID = $account["AccountID"];
            ClassesModel::addStudentInClass($accountID, $Fname, $Sname, $Lname, $NR, $classId);
        }
    }

    /**
     * Tworzy konto użytkownika.
     * @param string $Fname Imię
     * @param string $Lname Nazwisko
     * @param string $NR Numer
     * @param int $classId Identyfikator klasy
     * @return array Wynik tworzenia konta
     */
    private function createUserAccount($Fname, $Lname, $NR, $classId)
    {
        // Skracanie $Fname i $Lname do maksymalnie 3 znaków
        $FnameShort = substr($Fname, 0, 3);
        $LnameShort = substr($Lname, 0, 3);

        // Formatowanie $NR do postaci z wiodącymi zerami, jeśli jest mniejsze niż 100
        $NRFormatted = str_pad($NR, 3, '0', STR_PAD_LEFT);

        // Tworzenie nazwy użytkownika
        $username = $FnameShort . $LnameShort . $NRFormatted . "_" . $classId;

        $accountController = new AccountController();
        $resultMessage = $accountController->createAccount($username, "student");
        return $resultMessage;
    }
}