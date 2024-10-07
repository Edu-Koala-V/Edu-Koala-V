<?php

use Core\Router\Router;
use Core\Auth\Auth;

define('__PRIVILEGES__', Auth::getPrivileges());
####################################################################
####                ROUTERS DEFINITIONS                         ####
####################################################################

Router::render("/", "LoginPage","Logowanie", "loginApp");
Router::post("/login", "AccountController", "login");
Router::post("/change-password", "AccountController", "changePassword");

Router::get("/courses/{param}", "TopicsController", "getTopics");
Router::get("/courses", "CourseController", "renderCoursePage");
Router::get("/courses/{param}/{param}", "LessonController", "getLessons");




if(__PRIVILEGES__ !== "guest"){
    Router::get("/logout","AccountController","logout");


    Router::render("/", "HomePage","Strona główna", "homeApp");

        
    Router::get("/courses/{param}", "TopicsController", "getTopics");

    Router::get("/courses/{param}/{param}", "LessonController", "getLessons");
    Router::get("/flashcards/{param}", "FlashcardsController", "getFlashcards");


    Router::put("/file", "FileController", "deployFile");

    Router::get("/wynik", "ArchiveController", "indexSessionExamResults");
    Router::get("/do-pobrania", "ResourcesController", "index");
    Router::get("/achievements", "AchievementsController", "getAchievements");

    Router::post("/avatar-change", "AccountController", "avatarChange");
}



Router::middleware("student", function () {
    Router::get("/courses", "CourseController", "renderCoursePage");
    Router::get("/zadania", "TasksController", "index");
    Router::get("/testy", "ExamController", "index");
    Router::get("/testy/{param}", "ExamController", "approachTwoExam");
    Router::post("/exam-check", "ExamController", "checkExam");
    Router::get("/archiwum", "ArchiveController", "index");
    Router::get("/archiwum/{param}/{param}", "ArchiveController", "showExam");
});

Router::middleware("teacher", function () {
    Router::get("/get-courses", "CourseController", "getCourseJSON");

    Router::get("/courses", "CourseController", "renderCoursePage");
    Router::get("/zadania", "TasksController", "index");
    Router::get("/zadania/{param}", "TasksController", "index");
    Router::get("/zadania-manager", "TasksController", "manage");
    Router::post("/get-students-in-class-where-task", "TasksController", "getStudentsInClassWhereTask");
    Router::post("/activate-task-by-class", "TasksController", "activateTaskByClass");
    Router::post("/update-task-status", "TasksController", "updateTaskStatus");

    Router::get("/testy", "ExamController", "index");
    Router::post("/exam-check", "ExamController", "checkExam");

    Router::get("/testy-manager", "QuizManagerController", "index");
    Router::get("/testy-aktywacja/{param}", "QuizManagerController", "activateExam");
    Router::post("/aktywacja-egzaminu/{param}", "ExamController", "activateExam");

    Router::get("/testy-edycja/{param}", "QuizManagerController", "editExam");
    Router::get("/quiz-delete/{param}", "QuizManagerController", "deleteExam");

    Router::get("/classes", "ClassesController", "index");
    Router::get("/classes/{param}", "ClassesController", "studentsList");

    Router::post("/get-classes", "ClassesController", "getClasses");
    Router::post("/get-students-task", "ClassesController", "getStudents");


    Router::post("/add-new-class", "ClassesController", "addClass");
    Router::post("/add-new-student-in-class", "ClassesController", "addStudentInClass");

    Router::post("/get-token", "AccountController", "getAccountDataGithubToken");
    Router::post("/update-lesson-content-json-link", "LessonController", "updateLessonContent");
    Router::post("/saveTaskData", "TasksController", "saveTaskData");
    Router::post("/updateTaksData", "TasksController", "updateTaskName");
    Router::post("/reset-password", "AccountController", "resetPassword");
});

Router::middleware("admin", function(){
    Router::post("/get-token", "AccountController", "getAccountDataGithubToken");
    Router::post("/update-lesson-content-json-link", "LessonController", "updateLessonContent");
    Router::post("/saveTaskData", "TasksController", "saveTaskData");
    Router::post("/updateTaksData", "TasksController", "updateTaskName");
    Router::post("/reset-password", "AccountController", "resetPassword");




Router::get("/get-courses", "CourseController", "getCourseJSON");

    Router::get("/manage-teachers", "AdminController", "manageTeachers");
    Router::get("/courses", "CourseController", "renderCoursePage");
    Router::get("/zadania", "TasksController", "index");
    Router::get("/zadania/{param}", "TasksController", "index");
    Router::get("/zadania-manager", "TasksController", "manage");
    Router::post("/get-students-in-class-where-task", "TasksController", "getStudentsInClassWhereTask");
    Router::post("/activate-task-by-class", "TasksController", "activateTaskByClass");
    Router::post("/update-task-status", "TasksController", "updateTaskStatus");

    Router::get("/testy", "ExamController", "index");
    Router::post("/exam-check", "ExamController", "checkExam");

    Router::get("/testy-manager", "QuizManagerController", "index");
    Router::get("/testy-aktywacja/{param}", "QuizManagerController", "activateExam");
    Router::post("/aktywacja-egzaminu/{param}", "ExamController", "activateExam");

    Router::get("/testy-edycja/{param}", "QuizManagerController", "editExam");
    Router::get("/quiz-delete/{param}", "QuizManagerController", "deleteExam");

    Router::get("/classes", "ClassesController", "index");
    Router::get("/classes/{param}", "ClassesController", "studentsList");

    Router::post("/get-classes", "ClassesController", "getClasses");
    Router::post("/get-students-task", "ClassesController", "getStudents");


    Router::post("/add-new-class", "ClassesController", "addClass");
    Router::post("/add-new-student-in-class", "ClassesController", "addStudentInClass");

    Router::post("/setTopics", "TopicsController", "setNewTitleName");
});





####################################################################
####################################################################
Router::executeMiddleware(__PRIVILEGES__);
Router::execute($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

