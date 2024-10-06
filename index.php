<?php
header_remove("X-Powered-By");
session_start();
require 'vendor/autoload.php';
require 'Core/Router/web.php';

use Plugins\Minify\minifyJS;


if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1' || $_SERVER['REMOTE_ADDR'] == '::1') {
### Metody uruchamiane tylko lokalnie ###
    minifyJS();
}

function minifyJS()
{
    minifyJS::minifyJS(["GlobalFunctions/AddEventElement","GlobalFunctions/CreateElements","GlobalFunctions/ModalWindow",
       "achievements","svgIconsSeter","main","imgLoading","cookie","isAnimation","notification","senderToServer"], "globalApp");

    $globalFilesCSS = ["progressbar",
    "achievements","modal-window","root","kbd","btn","navbar","imgLoading", "main","notification","functionalClass"];


    // #######################################################################################################################
    // https://rephp.mvc/testy-manager

    $styleComponents = [
        "CssComponents/Table","CssComponents/basic-class"
    ];
    minifyJS::minifyCSS( $styleComponents, "ExamsManagerApp", $globalFilesCSS);
    $scriptComponents = [
        "table-mobile-fix"
    ];
    minifyJS::minifyJS($scriptComponents, "ExamsManagerApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/testy-aktywacja/1

    
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",

        "CssComponents/activateExam"
    ];
    minifyJS::minifyCSS($styleComponents , "ActiveExamsManagerApp", $globalFilesCSS);
    $scriptComponents = [
        "table-mobile-fix",
        "exam-manage-activate"
    ];
    minifyJS::minifyJS($scriptComponents, "ActiveExamsManagerApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/archiwum
    
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class"
    ];
    minifyJS::minifyCSS($styleComponents, "archiveApp", $globalFilesCSS);
    $scriptComponents = [
        "table-mobile-fix"
    ];
    minifyJS::minifyJS($scriptComponents, "archiveApp");

    // #######################################################################################################################

    // #######################################################################################################################
    $styleComponents = [
        "CssComponents/Table",
        
        "quiz",
        "exam"
    ];
    minifyJS::minifyCSS($styleComponents, "examApp", $globalFilesCSS);
    $scriptComponents = [
        "table-mobile-fix",
        "exam"
    ];
    minifyJS::minifyJS($scriptComponents, "examApp");
    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/classes/1
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "form",
        "classes"
    ];
    minifyJS::minifyCSS($styleComponents, "classesApp", $globalFilesCSS);

    $scriptComponents = [
        "table-mobile-fix",
        "classes"
    ];
    minifyJS::minifyJS($scriptComponents, "classesApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/tasks

    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "form",
        "tasks",
        "tasksManage"
    ];
    minifyJS::minifyCSS($styleComponents, "tasksManageApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "GenerateArticleFromJSON",
        "table-mobile-fix",
        "tasks",
        "tasksManage"
    ];
    minifyJS::minifyJS($scriptComponents, "tasksManageApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/zadania

    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "form",
        "task-art",
        "tasks",
    ];
    minifyJS::minifyCSS($styleComponents, "tasksApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "GenerateArticleFromJSON",
        "convertStringURL",
        "table-mobile-fix",
        "tasks"
    ];
    minifyJS::minifyJS($scriptComponents, "tasksApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/lesson/1

    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "lesson-art",
        "lesson-list",
        "lesson",
        "dragAndDrop",
        "lessonEditor",
        "form",
        "editorToolsBox"
    ];
    minifyJS::minifyCSS($styleComponents, "lessonEditorApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "GenerateArticleFromJSON",
        "GenerateJSONFromArticle",
        "convertStringURL",
        "table-mobile-fix",
        "lesson",
        "GlobalFunctions/DragAndDrop",
        "lessonEditor",
        "topicEditor",
        "editorToolsBox"
    ];
    minifyJS::minifyJS($scriptComponents, "lessonEditorApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/course/Winodws-10
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "lesson-art",
        "lesson-list",
        "lesson",
    ];
    minifyJS::minifyCSS($styleComponents, "lessonApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "GenerateArticleFromJSON",
        "convertStringURL",
        "table-mobile-fix",
        "lesson",
    ];
    minifyJS::minifyJS($scriptComponents, "lessonApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/do-pobrania
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "form",
        "download"
    ];
    minifyJS::minifyCSS($styleComponents, "downloadApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "table-mobile-fix",
        "download"
    ];
    minifyJS::minifyJS($scriptComponents, "downloadApp");


    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "home"
    ];
    minifyJS::minifyCSS($styleComponents, "homeApp", $globalFilesCSS);
    $scriptComponents = [
        "GlobalFunctions/ScrollToSectionID",
        "table-mobile-fix",
    ];
    minifyJS::minifyJS($scriptComponents, "homeApp");


    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "form",
        "login"

    ];
    minifyJS::minifyCSS($styleComponents, "loginApp", $globalFilesCSS);
    $scriptComponents = [
        "login"
    ];
    minifyJS::minifyJS($scriptComponents, "loginApp");

    // #######################################################################################################################

    // #######################################################################################################################
    // https://rephp.mvc/courses
    $styleComponents = [
        "CssComponents/Table",
        "CssComponents/basic-class",
        "course"
    ];
    minifyJS::minifyCSS($styleComponents, "courseApp", $globalFilesCSS);
    $scriptComponents = [
        "course"
    ];
    minifyJS::minifyJS($scriptComponents, "courseApp");
   

    
}
