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

            $name = $_POST['name'];
            $surname = $_POST['surname'];
            $nr = $_POST['nr'];
            $class = $_POST['classID'];
            $className = $_POST['className'];
            $privileges = 'student';
            $avatar = 'defaultAvatar.jpg';
            $theme = NULL;
            $score = 1;
            $username = substr($name, 0, 2) . substr($surname, 0, 2) . substr($nr, 0, 2);
            $password = 'ZAQ!2wsx';

            $user = $this->model->getUserByUsername($username);
            if ($user) {
                $this->view->render("Username already exists.");
                return;
            }



            $this->model->createUser($username, $password, $name, $surname, $class, $nr, $privileges, $avatar, $theme, $score);
            $this->view->render("User created successfully.");
            return array($className, $nr);
        } else {
            $this->view->render();
        }
    }
}
