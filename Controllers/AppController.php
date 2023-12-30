<?php
class AppController
{
    private $view;
    public function __construct($view)
    {
        $this->view = $view;
    }
    // ? Wyświetla statyczną stronę switch('nazwa')
    public function index($page)
    {
        $this->view->render($page);
    }
}
