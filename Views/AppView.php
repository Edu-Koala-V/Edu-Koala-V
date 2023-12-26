<?php
class AppView
{
    public function render($page)
    {
        switch ($page) {
            case "HomePage":
                $html = file_get_contents("Views/Pages/HomePage.php");
                echo $html;
                break;
                // case "Dashboard":
                //     $html = file_get_contents("Views/Dashboards/Dashboards.php");
                //     echo $html;
                //     break;
            case "":
                echo "Nie podano statycznego renderowania strony w AppView.php";
                break;
        }
    }
}
