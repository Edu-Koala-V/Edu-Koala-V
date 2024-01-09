<?php
session_start();
## Static render pages
require_once "Controllers/AppController.php";
require_once "Views/AppView.php";
## Login
require_once 'Models/UserModel.php';
require_once 'Views/Auth/LoginView.php';
require_once 'Controllers/LoginController.php';
## Register
require_once 'Views/Auth/RegisterView.php';
require_once 'Controllers/RegisterController.php';
require_once 'Models/RegisterModel.php';
## Errors
require_once 'Controllers/ErrorsController.php';
## Articles
require_once 'Models/ArticleModel.php';
require_once 'Views/CMS/ArticleView.php';
require_once 'Controllers/ArticleController.php';
## Files upload images
require_once 'Controllers/ImageController.php';
## Dashboard function loaded
require_once 'Views/Dashboards/Dashboards.php';
## Articles list
require_once 'Views/Dashboards/ListOfArticles.php';
## Tasks List
require_once 'Controllers/TaskController.php';
require_once 'Models/TaskModel.php';
require_once 'Views/Tasks/TaskView.php';
## Quizzes List
require_once 'Controllers/QuizController.php';
require_once 'Models/QuizModel.php';
require_once 'Views/Tests/QuizView.php';
require_once 'Views/Tests/ListOfQuizzes.php';
## Classes management
require_once 'Views/Classes/ClassesView.php';
require_once 'Controllers/ClassesController.php';
require_once 'Models/ClassesModel.php';
$test = new Dashboard();

/* ##############################
   Połączenie z bazą danych MySQL
  ################################*/
$db = new mysqli("localhost", "root", "", "edu_platform");
//$db = new mysqli("sql302.infinityfree.com", "if0_35570089", "9w5gECStoSS63", "if0_35570089_eduplatform");

/* #########################
   Tworzenie obiektów modeli
  ###########################*/
$modelUser = new UserModel($db);
$modelArticle = new ArticleModel($db);

/* #######################################################
   Przechwycenie części adresu URL (www.domena.pl [/dane])
  #########################################################*/
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (isset($_SESSION['user'])) {
  /* ###################################################
     Wykonaj przekierowania dla zalogowanego użytkownika
  ########################################################*/

  if (preg_match('/^\/Lekcje\/(.*)$/', $uri, $matches)) {
    $view = new ArticleView();
    $controller = new ArticleController($modelArticle, $view);
    $controller->displayArticle($matches[1]);
  }
  if (preg_match('/^\/quiz\/(.*)$/', $uri, $matches)) {
    $view = new QuizView();
    $model = new QuizModel($db);
    $controller = new QuizController($model, $view);
    $controller->displayQuiz($matches[1]);
  }

  switch ($uri) {
    
    case '/':
    case '/dashboard':
      $view = new AppView();
      $controller = new AppController($view);
      $controller->index("Dashboard");
      $test->render();
      break;
    case "/Rejestracja":
      $view = new RegisterView();
      $modelRegister = new RegisterModel($db);
      $controller = new RegisterController($modelRegister, $view);
      $arrayInfo = $controller->register();
      $view = new ClassesView();
      $model = new ClassesModel($db);
      $controller = new ClassesController($model, $view);
      print_r($arrayInfo);
      $controller->addStudentToClassByName($arrayInfo[0], $arrayInfo[1]);
      break;
    case "/logout":
      $view = new LoginView();
      $controller = new LoginController($modelUser, $view);
      $controller->logout();
      unset($_SESSION['user']);
      session_destroy();
      break;
    case '/create-article':
      $view = new ArticleView();
      $controller = new ArticleController($modelArticle, $view);
      $controller->createArticle();
      break;
    case '/create-quiz':
      $view = new QuizView();
      $model = new QuizModel($db);
      $controller = new QuizController($model, $view);
      $controller->createQuiz();
      break;
    case '/articles-List':
      if ($_SESSION['user']['privileges'] ==  "teacher") {
        $view = new ClassesView();
        $modelClasses = new ClassesModel($db);
        $controller = new ClassesController($modelClasses, $view);
        $classesArray = $controller->getAllClassesArray('', false);
        $view = new ListOfArticles();
        $model = new ArticleModel($db);
        $controller = new ArticleController($model,  $view);
        $controller->getAllArticlesArray($classesArray);
      } else {
        $view = new ListOfArticles();
        $controller = new ArticleController($modelArticle,  $view);
        $controller->getAllArticlesForStudent($_SESSION['user']['class']);
      }
      break;
    case '/tasks-List':
      if ($_SESSION['user']['privileges'] ==  "teacher") {
        $view = new ClassesView();
        $modelClasses = new ClassesModel($db);
        $controller = new ClassesController($modelClasses, $view);
        $classesArray = $controller->getAllClassesArray('', false);
        $view = new TaskView();
        $model = new TaskModel($db);
        $controller = new TaskController($model, $view);
        $controller->getAllTasksInArray($classesArray);
      } else {
        $view = new TaskView();
        $model = new TaskModel($db);
        $controller = new TaskController($model, $view);
        $controller->getAllTasksInArrayForStudent($_SESSION['user']['class']);
      }
      break;
    case '/quizzes-list':
      if ($_SESSION['user']['privileges'] ==  "teacher") {
        $view = new ClassesView();
        $modelClasses = new ClassesModel($db);
        $controller = new ClassesController($modelClasses, $view);
        $classesArray = $controller->getAllClassesArray('', false);
        $view = new ListOfQuizzes();
        $model = new QuizModel($db);
        $controller = new QuizController($model, $view);
        $controller->getAllQuizzesInArray($classesArray);
      } else {
        $view = new ListOfQuizzes();
        $model = new QuizModel($db);
        $controller = new QuizController($model, $view);
        $controller->getAllQuizzesInArrayForStudent($_SESSION['user']['class']);
      }
      break;
    case '/newTask':
      $view = new TaskView();
      $model = new TaskModel($db);
      $controller = new TaskController($model, $view);
      $controller->createNewTask();
    case '/upload-image':
      $controller = new ImageController();
      $controller->upload();
      break;
    case '/get-classes':
      $view = new ClassesView();
      $modelClasses = new ClassesModel($db);
      $controller = new ClassesController($modelClasses, $view);
      $controller->getAllClassesArray('', true);
      break;
    case '/newClass':
      $view = new ClassesView();
      $modelClasses = new ClassesModel($db);
      $controller = new ClassesController($modelClasses, $view);
      $controller->createClass();
      break;
    case '/removeClass':
      $view = new ClassesView();
      $modelClasses = new ClassesModel($db);
      $controller = new ClassesController($modelClasses, $view);
      $controller->removeClass();
      break;
    case '/getStudentsOfClass':
      $view = new ClassesView();
      $modelClasses = new ClassesModel($db);
      $controller = new ClassesController($modelClasses, $view);
      $controller->getAllStudentsFromClassID();
      break;
    case '/upload-image-avatar':
      $view = new LoginView();
      $model = new UserModel($db);
      $controller = new LoginController($model, $view);
      $controller->updateUserAvatar();
      break;
    case '/addClassToLesson':
      $view = new ArticleView();
      $model = new ArticleModel($db);
      $controller = new ArticleController($model, $view);
      $controller->setActiveArticleForClass();
      break;
    case '/addTaskColumnToClassTable':
      $view = new ClassesView();
      $model = new ClassesModel($db);
      $controller = new ClassesController($model, $view);
      $controller->addTaskToClassByName();
      break;
    case '/addQuizColumnToClassTable':
      $view = new ClassesView();
      $model = new ClassesModel($db);
      $controller = new ClassesController($model, $view);
      $controller->addTestToClassByName();
      break;
    case '/checkQuizAnswer':
      $view = new QuizView();
      $model = new QuizModel($db);
      $controller = new QuizController($model, $view);
      $controller->checkAnswers();
    break;
    case '/change-point':
      $view = new ClassesView();
      $model = new ClassesModel($db);
      $controller = new ClassesController($model, $view);
      $controller->changeClassPoints();
      break;
    default:
      http_response_code(404);
      break;
  }
} else {
  /* #######################################################
     Wykonaj przekierowania dla NIE zalogowanego użytkownika
  #############################################################*/
  switch ($uri) {
    case '/':
    case '/logowanie':
    case '/dashboard':
      $view = new LoginView();
      $controller = new LoginController($modelUser, $view);
      $controller->login();
      break;
      case '/new-password':
        $view = new LoginView();
        $controller = new LoginController($modelUser, $view);
        $controller->changeCryptPassword();
        break;
    default:
      http_response_code(401);
  }
}
