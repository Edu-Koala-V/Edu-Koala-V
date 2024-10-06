<?php
namespace Core\Controllers;
use Core\Models\TasksModel;
use Core\Views\TasksView;
use Core\Base\BaseController;

use Core\Models\ClassesModel;

class TasksController extends BaseController
{
    public function index($student_id=null)
    {
        if(__PRIVILEGES__== "student"){
            $student_id = $_SESSION["user"]["id"];
        }
        $tasks = TasksModel::getTasks($student_id);
        $view = new TasksView();
        $view->render($tasks);
    }
    public function manage()
    {
        $tasks = TasksModel::getAllTask();
        $view = new TasksView();
        $view->renderManage($tasks);
    }
    public function manageTasksByClass()
    {
        $request = self::getRequestData();
        $class_id = $request['classID'];
        $task_id = $request['taskID'];
        $tasks = TasksModel::getAllTaskByClasses($class_id,$task_id);
        $view = new TasksView();
        $view->renderManage($tasks);
    }

    public function getStudentsInClassWhereTask(){
        $request = self::getRequestData();
        $class_id = $request['classID'];
        $task_id = $request['taskID'];
        $taskByClass =TasksModel::getAllTaskByClasses($class_id,$task_id);
        self::echo_asJSON($taskByClass);
    }

    public function activateTaskByClass(){
        $request = self::getRequestData();
        $task_id = $request['taskID'];
        $class_id = $request['classID'];
        $students = ClassesModel::getStudents($class_id);

        $studentsTaskActivated = [];
        foreach($students as $student){
            $result = TasksModel::activateTaskByStudent($task_id,$student['id']);
            if($result){
                $studentsTaskActivated[] = $student['id'];
            }
        }
        self::echo_asJSON($studentsTaskActivated);
    }

    public function updateTaskStatus(){
        $request = self::getRequestData();
        $statusID = $request['statusID'];
        $status = $request['status'];
        $result = TasksModel::updateTaskStatus($statusID, $status);
        self::echo_asJSON($result);
    }
    
}