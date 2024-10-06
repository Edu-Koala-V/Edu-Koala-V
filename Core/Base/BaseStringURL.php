<?php
namespace Core\Base;

class BaseStringURL{

    public static function getBaseURL() {
        return "https://".$_SERVER['HTTP_HOST']."/Resources/Upload";
    }


    public static function convertStringToURL($string) {
        // $string = strtolower($string);
        $string = str_replace("-", "_", $string);
        $string = str_replace(" ", "-", $string);
        $string = strtr($string, array(
            'ą' => "'a", 'ć' => "'c", 'ę' => "'e", 'ł' => "'l", 'ń' => "'n", 'ó' => "'o", 'ś' => "'s", 'ź' => "''z", 'ż' => "'z"
        ));
        return $string;
    }

    public static function convertURLToString($URL) {
        // $URL = strtolower($URL);
        $URL = str_replace("-", " ", $URL);
        $URL = str_replace("_", "-", $URL);
        $URL = strtr($URL, array(
            "'a" => 'ą', "'c" => 'ć', "'e" => 'ę', "'l" => 'ł', "'n" => 'ń', "'o" => 'ó', "'s" => 'ś', "''z" => 'ź', "'z" => 'ż'
        ));
        return ucwords($URL); // Convert first character of each word to uppercase
    }
}