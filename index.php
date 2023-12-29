<?php
session_start();
## Static render pages
require_once("Controllers/AppController.php");
require_once("Views/AppView.php");
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

require_once 'Views/Dashboards/ListOfArticles.php';
require_once 'Views/Dashboards/Dashboards.php';

require_once 'Views/Classes/ClassesView.php';
require_once 'Controllers/ClassesController.php';
require_once 'Models/ClassesModel.php';
$test = new Dashboard();

/* ##############################
   Połączenie z bazą danych MySQL
  ################################*/
$db = new mysqli("localhost", "root", "", "edu_platform");

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
  if ($uri === '/Logowanie' or $uri === '/' or $uri === '/Dashboard') {
    $view = new AppView();
    $controller = new AppController($view);
    $controller->index("Dashboard");
    $test->render();
  } else if ($uri === "/Rejestracja") {
    $view = new RegisterView();
    $modelRegister = new RegisterModel($db);
    $controller = new RegisterController($modelRegister, $view);
    $controller->register();
  } else if ($uri === '/LOGOUT') {
    $view = new LoginView();
    $controller = new LoginController($modelUser, $view);
    $controller->logout();
    unset($_SESSION['user']);
    session_destroy();
  } else if ($uri === '/create-article') {
    $view = new ArticleView();
    $controller = new ArticleController($modelArticle, $view);
    $controller->createArticle();
  } else if (preg_match('/^\/Lekcje\/(.*)$/', $uri, $matches)) {
    $view = new ArticleView();
    $controller = new ArticleController($modelArticle, $view);
    $controller->displayArticle($matches[1]);
  } else if ($uri === "/articles-List") {
    if ($_SESSION['user']['privileges'] ==  "teacher") {
      $view = new ClassesView();
      $modelClasses = new ClassesModel($db);
      $controller = new ClassesController($modelClasses, $view);
      $classesArray = $controller->getAllClassesArray('', false);
      $view = new ListOfArticles();
      $controller = new ArticleController($modelArticle, new ListOfArticles());
      $controller->getAllArticlesArray($classesArray);
    } else {
      $view = new ListOfArticles();
      $controller = new ArticleController($modelArticle, new ListOfArticles());
      $controller->getAllArticlesForStudent($_SESSION['user']['class']);
    }
  } else if ($uri === "/upload-image") {
    $controller = new ImageController();
    echo $controller->upload();
  } else if ($uri === "/get-classes") {
    $view = new ClassesView();
    $modelClasses = new ClassesModel($db);
    $controller = new ClassesController($modelClasses, $view);
    $controller->getAllClassesArray('', true);
  } else if ($uri === "/newClass") {
    $view = new ClassesView();
    $modelClasses = new ClassesModel($db);
    $controller = new ClassesController($modelClasses, $view);
    $controller->createClass();
  } else if ($uri === "/removeClass") {
    $view = new ClassesView();
    $modelClasses = new ClassesModel($db);
    $controller = new ClassesController($modelClasses, $view);
    $controller->removeClass();
  } else if ($uri === "/getStudentsOfClass") {
    $view = new ClassesView();
    $modelClasses = new ClassesModel($db);
    $controller = new ClassesController($modelClasses, $view);
    $controller->getAllStudentsFromClassID();
  } else if ($uri === "/upload-image-avatar") {
    $view = new LoginView();
    $model = new UserModel($db);
    $controller = new LoginController($model, $view);
    $controller->updateUserAvatar();
  } else if ($uri === "/addClassToLesson") {
    $view = new ArticleView();
    $model = new ArticleModel($db);
    $controller = new ArticleController($model, $view);
    $controller->setActiveArticleForClass();
  } else {
    http_response_code(404);
  }

  // if ($uri === '/Rejestracja' or $_SESSION['privilege'] === 'teacher') {
  //   $view = new RegisterView();
  //   $modelRegister = new RegisterModel($db);
  //   $controller = new RegisterController($modelRegister, $view);
  //   $controller->register();
  // }
} else {
  /* #######################################################
     Wykonaj przekierowania dla NIE zalogowanego użytkownika
  #############################################################*/
  switch ($uri) {
    case '/':
      // $view = new AppView();
      // $controller = new AppController($view);
      // $controller->index("HomePage"); // TODO: Home Page
      $view = new LoginView();
      $controller = new LoginController($modelUser, $view);
      $controller->login();
      break;
    case '/Logowanie':
      $view = new LoginView();
      $controller = new LoginController($modelUser, $view);
      $controller->login();
      break;
    case '/Rejestracja':
      $view = new RegisterView();
      $modelRegister = new RegisterModel($db);
      $controller = new RegisterController($modelRegister, $view);
      $controller->register();
      break;
    default:
      http_response_code(401);
  }
}
