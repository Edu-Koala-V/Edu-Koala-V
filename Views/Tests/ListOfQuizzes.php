<?php

class ListOfQuizzes
{

    public function renderQuizzesTable($quizzesSortOfCategory, $classesArray = array())
    {

        if ($_SESSION['user']['privileges'] == "teacher") {
            foreach ($quizzesSortOfCategory as $category => $quizzes) {
                echo "<h2>" . $category . "</h2>";
                echo "<table>";
                echo "<tr><th>Nazwa lekcji</th><th>Link do lekcji</th></tr>";

                foreach ($quizzes as $quiz) {
                    echo "<tr>";
                    echo '<td id="quiz' . $quiz["quiz_id"] . '">' . $quiz["title"] . "</td>";
                    $filename = strtolower($quiz["title"]);
                    $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
                    echo '<td> <a href="/Lekcje/' . $filename . '">Link do lekcji </a></td>';
                    echo "</tr>";
                    echo "<tr>";
                    echo '<td colspan="3">';
                    foreach ($classesArray as $class) {
                        echo '<label for="' . $class["name"] . '">' . $class["name"] . '</label><input type="checkbox"';

                        echo 'id="' . $class["name"] . '" name="' . $class["name"] . '" data-class="x' . $quiz["quiz_id"] . '">';
                    }
                    echo '<button id="' . $quiz["title"] . '" class="btn-classSeter"';
                    echo 'onclick="activeQuizForClass(\'' . $quiz["quiz_id"] . '\')">Aktywuj dla wybranej klasy</button>';
                    echo "</td></tr>";
                }
                echo "</table>";
            }
        } else {
            foreach ($quizzesSortOfCategory as $category => $quizzes) {

                echo "<h2>" . $category . "</h2>";
                echo "<table>";
                foreach ($quizzes as $quiz) {
                    echo <<<HTML
                <tr><th>Nazwa testu</th><th>Wynik testu</th></tr>
                <tr>
                HTML;
                    echo '<td>' . $quiz["title"] . '</td>';
                    if ($classesArray[0][$quiz["title"]] === "") {
                        $filename = strtolower($quiz["title"]);
                        $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
                        echo '<td> <a href="/Lekcje/' . $filename . '">Link do lekcji </a></td>';
                    } else {
                        $pointsOfMax = explode('/', $classesArray[0][$quiz["title"]]);
                        $procent = $pointsOfMax[0] / $pointsOfMax[1];
                        switch ($procent) {
                            case $procent >= 0.9:
                                $ocena = 6;
                                break;
                            case $procent >= 0.85:
                                $ocena = 5;
                                break;
                            case $procent >= 0.75:
                                $ocena = 4;
                                break;
                            case $procent >= 0.6:
                                $ocena = 3;
                                break;
                            case $procent >= 0.4:
                                $ocena = 2;
                                break;
                            default:
                                $ocena = 1;
                                break;
                        }



                        echo '<td>' . 'Uzyskano ' . $pointsOfMax[0] . '/' . $pointsOfMax[1] . ' jest to ' .
                            $procent * 100 . "%" . '</br> co odpowiada ocenie ' . $ocena . '</td>';
                    }

                    echo <<<HTML
                </tr>
                HTML;
                }
            }
        }
    }
}
