<?php
namespace Core\Views;
use Core\Base\BaseView;

class TasksView extends BaseView
{
    public function render($tasks)
    {
        $lessonsData = $this->renderContent($tasks);
        if($_SESSION["user"]["privileges"] !== "student" && $_SESSION["user"]["privileges"] !== "guest"){
            echo self::renderPage("Zadania",$lessonsData,"tasksEditorApp");
        }else{
        echo self::renderPage("Zadania",$lessonsData,"tasksApp");
        }
    }
    
    public function renderManage($tasks)
    {
        $lessonsData = $this->renderManageContent($tasks);
        echo self::renderPage("Zadania",$lessonsData,"tasksManageApp");
    }


    private function renderContent($tasks)
    {
        $taskPage = file_get_contents(__DIR__ . "/../../Pages/taskPage.html");
        $taskList = file_get_contents(__DIR__ . "/../../Pages/taskList.html");

        $taskElementHTML = "";
        foreach($tasks as $task){
            $taskElement = str_replace("%%TASK_ID%%", $task["id"], $taskList);
            $taskElement = str_replace("%%TASK_NAME%%", $task["name"], $taskElement);
            $taskElement = str_replace("%%TASK_LINK_DATA%%", $task["link"], $taskElement);
            $taskElement = str_replace("%%TASK_STATUS%%", $task["status"]??"", $taskElement);
            $taskElementHTML .= $taskElement;
        }
        $taskPage = str_replace("%%TASK_LIST%%", $taskElementHTML, $taskPage);
        $html = $taskPage;
        return $html;
    }

    private function renderManageContent($tasks)
    {
        $taskPage = file_get_contents(__DIR__ . "/../../Pages/taskPage.html");
        $taskList = file_get_contents(__DIR__ . "/../../Pages/taskList.html");

        $taskElementHTML = "";
        foreach($tasks as $task){
            $taskElement = str_replace("%%TASK_ID%%", $task["id"], $taskList);
            $taskElement = str_replace("%%TASK_NAME%%", $task["name"], $taskElement);
            $taskElement = str_replace("%%TASK_LINK_DATA%%", "", $taskElement);
            $taskElement = str_replace("%%TASK_STATUS%%", "", $taskElement);
            $taskElementHTML .= $taskElement;
        }
        $taskPage = str_replace("%%TASK_LIST%%", $taskElementHTML, $taskPage);
        $html = $taskPage;
        return $html;
    }
}