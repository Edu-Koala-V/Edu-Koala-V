<?php
namespace Core\Controllers;

use Core\Base\BaseController;
use Core\Base\BaseStringURL;
use Core\Models\LessonModel;
use Core\Models\LessonsModel;
use Core\Views\LessonView;
use Exception;

class LessonController extends BaseController {

    public function getLessons($courseName,$lessonName) {

        $lessonName = BaseStringURL::convertURLToString($lessonName);
        $lessonRecepture = LessonModel::getLesson($lessonName);
        if (empty($lessonRecepture)) {
            throw new Exception("Nie udało się znaleźć lekcji", 404);
        }
   
       $view = new LessonView();
       $view->render($lessonRecepture,null);//$quizData
        
    }

    public function updateLessonContent(){
        $requestData = $requestData = self::getRequestData();
        if(isset($requestData['lessonID']) && isset($requestData['lesson_data_link'])){
            $lessonId = $requestData['lessonID'];
            $jsonLink = $requestData['lesson_data_link'];
            $result = LessonModel::updateLessonContent($lessonId, $jsonLink);
            if($result){
                return self::echo_asJSON(array_merge(["status" => "success", "message" => "Zaktualizowano nazwy lekcji"]));
            }else{
                return self::echo_asJSON(["status" => "error", "message" => "Nie udało się zaktualizować nazw lekcji"]);
            }
        }
    }
    public function updateDateLesson(){
        $requestData = $requestData = self::getRequestData();
        if(isset($requestData['lessonID'])){
            $lessonId = $requestData['lessonID'];
            $result = LessonModel::updateLessonDate($lessonId);
            if($result){
                return self::echo_asJSON(array_merge(["status" => "success", "message" => "Zaktualizowano nazwy lekcji"]));
            }else{
                return self::echo_asJSON(["status" => "error", "message" => "Nie udało się zaktualizować nazw lekcji"]);
            }
        }
    }

    // public function getLesson($lessonId) {
    //     $lesson = $this->model->getLesson($lessonId);
    //     return $lesson;
    // }

    // public function createLesson($lessonData) {
    //     $lesson = $this->model->createLesson($lessonData);
    //     return $lesson;
    // }

    // public function updateLesson($lessonData) {
    //     $lesson = $this->model->updateLesson($lessonData);
    //     return $lesson;
    // }

    // public function deleteLesson($lessonId) {
    //     $lesson = $this->model->deleteLesson($lessonId);
    //     return $lesson;
    // }
}