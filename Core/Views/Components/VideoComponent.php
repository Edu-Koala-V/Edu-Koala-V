<?php
namespace Core\Views\Components;

class VideoComponent {
    public static function getElementHTML($AssocArrayDataElement, $VIDEO_ID) {
        $videoComponent = file_get_contents(__DIR__ . "/../../../Pages/Components/videoJS.html");
        $videoHTML = "";
        $videoHTML = str_replace("%%VIDEO_GITHUB_LOCATION_FOLDER%%", $AssocArrayDataElement["videoHLS_Github_Master"],$videoComponent);
        $videoHTML = str_replace("%%VIDEO_ID%%", $VIDEO_ID,$videoHTML);
        $videoHTML = str_replace("%%VIDEO_TITLE%%", $AssocArrayDataElement["videoTitle"],$videoHTML);
        return $videoHTML="";
    }
}