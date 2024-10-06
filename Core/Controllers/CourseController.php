<?php
namespace Core\Controllers;
use Core\Base\BaseController;
use Core\Views\CourseView;
use Core\Models\CourseModel;
class CourseController extends BaseController{

    
    public function renderCoursePage(){
        $courseData = CourseModel::getAllCourses();
        $view = new CourseView();
        $view->render($courseData);
    }
    public function getCourseJSON(){
        $courseData = CourseModel::getAllCourses();
        self::echo_asJSON($courseData);
    }

}