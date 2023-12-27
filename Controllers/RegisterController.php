<?php
class RegisterController
{
    private $model;
    private $view;

    public function __construct($model, $view)
    {
        $this->model = $model;
        $this->view = $view;
    }

    public function register()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $name = $_POST['name'];
            $surname = $_POST['surname'];
            $class = $_POST['class'];
            $privileges = 'student';
            $avatar = 'defaultAvatar.jpg';
            $theme = ['root' => [], 'style.css'];

            $user = $this->model->getUserByUsername($username);
            if ($user) {
                $this->view->render("Username already exists.");
                return;
            }



            $this->model->createUser($username, $password, $name, $surname, $class, $privileges, $avatar, $theme);
            $this->view->render("User created successfully.");
        } else {
            $this->view->render();
        }
    }
}
