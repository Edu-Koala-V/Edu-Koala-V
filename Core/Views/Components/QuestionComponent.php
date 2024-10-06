<?php
namespace Core\Views\Components;

use Core\Views\Components\VideoComponent;
use Core\Views\Components\ImagesComponent;

use function PHPUnit\Framework\isJson;

class QuestionComponent {
    public static function getElementHTML($type, $AssocArrayDataElement, $questionNumber , $checkedExamAnswers=null, $userChecked=null) {
        $questionWrapperComponent = file_get_contents(__DIR__ . "/../../../Pages/Components/question-wrapper.html");
        $questionInputAnswerComponent = file_get_contents(__DIR__ . "/../../../Pages/Components/question-answer.html");


        $questionHTML = "";
        $questionHTML = str_replace('%%QUESTION_NUMBER%%', $questionNumber, $questionWrapperComponent);
        $questionHTML = str_replace('%%TYPE%%', $type, $questionHTML);

        $questionHTML = str_replace('%%QUESTION_POINTS%%', self::getPoints($checkedExamAnswers, $questionNumber).$AssocArrayDataElement["points"], $questionHTML);


        $questionHTML = str_replace('%%QUESTION_TEXT%%', $AssocArrayDataElement["question"], $questionHTML);
//Konwersja img w formacie json na wartości tablicy asocjacyjnej
        if(isJson($AssocArrayDataElement["img"]) && $AssocArrayDataElement["img"] != null){
            $imgArrayFromJson = json_decode($AssocArrayDataElement["img"], true);
            $AssocArrayDataElement["img"] = $imgArrayFromJson["img"];
            $AssocArrayDataElement["imgAlt"] = $imgArrayFromJson["imgAlt"];
            $AssocArrayDataElement["big_src"] = $imgArrayFromJson["big_src"];
            $AssocArrayDataElement["width"] = $imgArrayFromJson["width"];
            $AssocArrayDataElement["height"]= $imgArrayFromJson["height"];
        }

        if(isset($AssocArrayDataElement["img"]) && $AssocArrayDataElement["img"] != null){
            $questionHTML = str_replace("%%QUESTION_IMG%%", ImagesComponent::getElementHTML($AssocArrayDataElement, $questionNumber),$questionHTML);
        }else{
            $questionHTML = str_replace("%%QUESTION_IMG%%", "",$questionHTML);
        }

        if(isset($AssocArrayDataElement["video"]) && $AssocArrayDataElement["video"] != null){
            $questionHTML = str_replace("%%VIDEO%%", VideoComponent::getElementHTML($AssocArrayDataElement, $questionNumber),$questionHTML);
        }else{
            $questionHTML = str_replace("%%VIDEO%%","",$questionHTML);
        }


        $answers = json_decode($AssocArrayDataElement["answers"], true);
        $answersWithKeys = [];
        foreach ($answers as $key => $value) {
            $answersWithKeys[] = ['key' => $key, 'value' => $value];
        }

        // Losowanie kolejności odpowiedzi
        shuffle($answersWithKeys);

        $_SESSION['answers'][$AssocArrayDataElement["question_id"]] = $answersWithKeys;
        if( is_array($AssocArrayDataElement["correct"])){
            $_SESSION['correct'][$AssocArrayDataElement["question_id"]] = $AssocArrayDataElement["correct"];
        }else{
            $_SESSION['correct'][$AssocArrayDataElement["question_id"]] = [$AssocArrayDataElement["correct"]];
        }
        // Generowanie HTML dla odpowiedzi
        $answersHTML = "";
        $index = 0;
        foreach ($answersWithKeys as $item) {
            $key = $item['key'];
            $answer = $item['value'];
            $answerComponentHTML = str_replace("%%QUESTION_ID%%", $AssocArrayDataElement["question_id"], $questionInputAnswerComponent);
            $answerComponentHTML = str_replace("%%ANSWER_LITERAL%%", self::getAnswerLiteral($index), $answerComponentHTML);
            $answerComponentHTML = str_replace("%%ANSWER_CONTENT%%", $answer, $answerComponentHTML);
            $answerComponentHTML = str_replace("%%INPUT_TYPE%%", $type, $answerComponentHTML);
            // Ustawienie oryginalnego indeksu jako data-id
            $answerComponentHTML = str_replace("%%ANSWER_DATA-ID%%", $key, $answerComponentHTML);

            $answerComponentHTML = str_replace("%%CHECKED%%", self::isChecked($checkedExamAnswers, $userChecked, $AssocArrayDataElement["question_id"], $key), $answerComponentHTML);
            
            $answersHTML .= $answerComponentHTML;
            $index++;
        }
        

        $questionHTML = str_replace("%%ANSWERS%%", $answersHTML,$questionHTML);
        return $questionHTML;
    }



    private static function getAnswerLiteral($index){
        $letters = ["A","B","C","D","E","F","G","H","I","J","K"];
        return $letters[$index];
    }


    private static function isChecked($checkedExamAnswers, $userChecked, $questionID, $answerID){
        if($userChecked == null){
            return "";
        }
     
        foreach($userChecked as $key => $value){
            foreach($value as $item){
                if($item->questionID == $questionID){
                    if($item->answerRelID == $answerID){
                        return 'checked disabled data-correct="'.$checkedExamAnswers[$questionID-1][1][$item->answerRelID].'"';
                    }else if($item->answerRelID == "-1"){
                        return 'checked disabled data-correct="null"';
                    }
                }
            }
        }
        return "disabled";
    }

    private static function getPoints($checkedExamAnswers, $questionID){
        if($checkedExamAnswers == null){
            return "Punkty do zdobycia:";
        }else{
            $points = 0;

            foreach($checkedExamAnswers[$questionID-1][1] as $value){
                if($value == "true"){
                $points += 1;
                }
            }
            return "Zdobyte punkty: " . $points. "/";;
        }
    }

}

// $quizData = [
//     [
//            "id"=> 23,
//            "type" => "checked",
//            "points" => 1,
//            "img"=> "KiraTheGames/test/main/testImages/WindowsServer.webp",
//           "imgAlt"=> "Na obrazku jest Windows Server 2019",
//           "big_src" => "KiraTheGames/test/main/testImages/WindowsServer_Orginal.webp",
//            "width"=> "533",
//            "height"=> "300",
//            "videoHLS_Github_Master"=> "KiraTheGames/test/main/nightcore",
//            "videoTitle"=> "Nightcore - Monster",
//            "question" => "Czy jesteś programistą?",
//            "answers" => [
//                "Tak",
//                "Nie",
//                "Może"          //MAX 11 pozycji
//            ],
//            "correctAnswer" => 'A'
//    ],
// ];