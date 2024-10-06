<?php
namespace Core\Views\Components;

class ImagesComponent {
    public static function getElementHTML($AssocArrayDataElement) {
        $imagesComponent = file_get_contents(__DIR__ . "/../../../Pages/Components/image.html");
        $imagesHTML = "";
        $imagesHTML = str_replace("%%IMAGE_SRC%%", $AssocArrayDataElement["img"],$imagesComponent);
        $imagesHTML = str_replace("%%IMAGE_ALT%%", $AssocArrayDataElement["imgAlt"],$imagesHTML);
        $imagesHTML = str_replace("%%IMAGE_WIDTH%%", $AssocArrayDataElement["width"],$imagesHTML);
        $imagesHTML = str_replace("%%IMAGE_HEIGHT%%", $AssocArrayDataElement["height"],$imagesHTML);
        $imagesHTML = str_replace("%%IMAGE_BIG_SRC%%", $AssocArrayDataElement["big_src"],$imagesHTML);
        return $imagesHTML;
    }
}