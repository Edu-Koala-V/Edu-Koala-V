<?php
namespace Core\Controllers;
use Core\Base\BaseController;
use Core\Models\AdminModel;
use Core\Views\AdminView;

class AdminController extends BaseController{
    function manageTeachers(){
        $teachers = AdminModel::getTeachers();
        $view = new AdminView();
        $view->renderTeachers($teachers);
    }
}