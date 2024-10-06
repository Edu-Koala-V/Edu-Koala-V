<?php
namespace Core\Views\Components;
class BlockSortingComponent {

    public static function getElementHTML($AssocArrayDataElement, $questionNumber) {
        $blockSortingComponent = file_get_contents(__DIR__ . "/../../../Pages/Components/block-sorting.html");
        $blockSortingHTML= "";
            $blockSortingHTML = str_replace('%%QUESTION_NUMBER%%', $questionNumber, $blockSortingComponent);
            $blockSortingHTML = str_replace('%%QUESTION_POINTS%%', $AssocArrayDataElement["points"], $blockSortingHTML);
            $blockSortingHTML = str_replace('%%QUESTION%%', $AssocArrayDataElement["question"], $blockSortingHTML);
            $htmlBlockElements = "";
            $setCollectionsHTML = "";
        foreach($AssocArrayDataElement["sets"] as $key => $setValue) {
            $setCollectionsHTML.= '
                <div class="set">
                    <div class="set-name">'.$setValue["setName"].'</div>
                    <div class="set-container"></div>
                </div>
            ';
            foreach($setValue["values"] as $key => $value) {
                $htmlBlockElements .= "<div class='block'>".$value."</div>";
            }
        }
        $blockSortingHTML = str_replace('%%BLOCK_VALUES%%', $htmlBlockElements, $blockSortingHTML);
        $blockSortingHTML = str_replace('%%SETS_COLLECTION%%', $setCollectionsHTML, $blockSortingHTML);

        
        return $blockSortingHTML;
    }

}


// $quizData = [
//     [
//         "id" => 1,
//         "type" => "block_sorting",
//         "points" => 6,
//         "question" => "Przyporządkuj odpowiednie nazwy do odpowiednich kategorii:",
//         "sets" => [
//             [
//                 "setName" => "Wirusy rezydentne",
//                 "values"=> [
//                     "Trojan",
//                     "Wabbit",
//                     "Rootkit",
//                     "Ransomware",
//                     "Wirus płyty głównej",
//                     "Backdoor"
//                 ],
//             ],
//             [
//                 "setName" => "Wirusy nie rezydentne",
//                 "values"=> [
//                     "SQL/URL injection",
//                     "Adware",
//                     "Stealware",
//                     "Keylogger",
//                     "Dialer",
//                     "Cryptomining",
//                     "Hijacker Browser Helper Object",
//                     "Wirus Dyskowy klastrowy",
//                     "Wirus plikowy",
//                     "Wirus Makro",
//                     "Wirus telefonu komórkowego",
//                     "Wirus typu robak",
//                     "Exploit",
//                     "Spam"
//                 ],
//             ]
//         ],
//     ],
// ];