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
            $user = $this->model->getUser($_POST['username'], $_POST['password']);
            if ($user) {
                session_start();
                $_SESSION['user'] = $user;
                header('Location: /');
                exit();
            } else {
                $this->view->render("Invalid username or password.");
            }
        } else {
            $this->view->render();
        }
    }
    public function logout()
    {
        unset($_SESSION['user']);
        session_destroy();
        header('Location: /');
    }
}
