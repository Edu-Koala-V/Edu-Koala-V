<?php
class AppController
{


    private $view;

    public function __construct($view)
    {
        $this->view = $view;
    }

    public function index($page)
    {
        $this->view->render($page);
    }
}
