<?php
require_once __DIR__ . '/../Models/UserModel.php';
require_once __DIR__ . '/../Views/Auth/LoginView.php';

class LoginController
{
    private $model;
    private $view;

    public function __construct($model, $view)
    {
        $this->model = $model;
        $this->view = $view;
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user = $this->model->getUser($_POST['username']);
            $password = $_POST['password'];
            if($user['password'] == "ZAQ!2wsx")
            {    
                $this->view->render("pass", $_POST['username']);
                        
            } 
            else 
            {
                if ($user !== null && password_verify($password, $user["password"])) {
                    $_SESSION['user'] = $user;
                    $_SESSION['privileges'] = $user["privileges"];
                    header('Location: /'); 
                } else {
                    $this->view->render('x');
                }
            } 
        }
        else {
            $this->view->render();
        }
        
    }
    public function changeCryptPassword(){
        $password = $_POST['password'];
        $username = $_POST['username'];
        $hashPassword = password_hash($password, PASSWORD_BCRYPT);
        $this->model->changeCryptPassword($username, $hashPassword);
        $this->logout();

    }
    public function logout()
    {
        // Nie używane / w sidebar-menu.js jest kod który usuwa sesje
        unset($_SESSION['user']);

        session_abort();
        session_destroy();

        header('Location: /');
    }
    public function updateUserAvatar()
    {
        $username = $_SESSION['user']['username'];
        if (isset($_POST['fileName'])) {
            $filename = $_POST['fileName'];
            $this->model->updateUserAvatar($username, $filename);
            $_SESSION["user"]["avatar"] = $filename;
        } else {
            echo "POST is empty";
        }
    }
}
