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
                $_SESSION['user'] = $user;


                $_SESSION['privileges'] = $user["privileges"];
                header('Location: /');
            } else {
                $this->view->render("Invalid username or password.");
            }
        } else {
            $this->view->render();
        }
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
