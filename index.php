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
## Errors
require_once 'Controllers/ErrorsController.php';
## Articles
require_once 'Models/ArticleModel.php';
require_once 'Views/CMS/ArticleView.php';
require_once 'Controllers/ArticleController.php';

require_once 'Views/Dashboards/ListOfArticles.php';
require_once 'Views/Dashboards/Dashboards.php';
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
  if ($uri === '/Logowanie' or $uri === '/Rejestracja' or $uri === '/' or $uri === '/Dashboard') {
    $view = new AppView();
    $controller = new AppController($view);
    $controller->index("Dashboard");
    $test->render();
  } else if ($uri === '/LOGOUT') {
    $view = new LoginView();
    $controller = new LoginController($modelUser, $view);
    $controller->logout();
  } else if ($uri === '/create-article') {
    $view = new ArticleView();
    $controller = new ArticleController($modelArticle, $view);
    $controller->createArticle();
  } else if (preg_match('/^\/Lekcje\/(.*)$/', $uri, $matches)) {
    $view = new ArticleView();
    $controller = new ArticleController($modelArticle, $view);
    $controller->displayArticle($matches[1]);
  } else if ($uri === "/articles-List") {
    $view = new ListOfArticles();
    $controller = new ArticleController($modelArticle, new ListOfArticles());
    $controller->getAllArticlesArray();
  } else {
    http_response_code(404);
  }
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
      $controller = new RegisterController($modelUser, $view);
      $controller->register();
      break;
  }
}




switch (http_response_code()) {
  case 401:
    handle_401_error();
    break;
  case 404:
    handle_404_error();
    break;
  case 500:
    handle_500_error();
    break;
}

// Włącz raportowanie błędów
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Funkcja do obsługi błędów 401
function handle_401_error()
{
  header('HTTP/1.1 401 Unauthorized');
  echo 'Nie masz uprawnień do wyświetlenia tej strony.';
  exit;
}

// Funkcja do obsługi błędów 404
function handle_404_error()
{
  header('HTTP/1.1 404 Not Found');
  $view = new ErrorView();
  $controller = new ErrorsController($view);
  $controller->error(404);
  exit;
}

// Funkcja do obsługi błędów 500
function handle_500_error()
{
  header('HTTP/1.1 500 Internal Server Error');
  echo 'Wystąpił błąd serwera.';
  exit;
}
