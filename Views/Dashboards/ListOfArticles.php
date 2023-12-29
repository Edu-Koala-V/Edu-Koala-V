<?php

class ListOfArticles
{

    public function renderTable($articleSortOfCategory, $classesArray = array())
    {
        if ($_SESSION['user']['privileges'] == "teacher") {
            foreach ($articleSortOfCategory as $category => $articles) {
                echo "<h2>" . $category . "</h2>";
                echo "<table>";
                echo "<tr><th>Nazwa lekcji</th><th>Link do lekcji</th></tr>";
                foreach ($articles as $article) {
                    echo "<tr>";
                    echo "<td>" . $article["title"] . "</td>";
                    $filename = strtolower($article["title"]);
                    $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
                    echo '<td> <a href="/Lekcje/' . $filename . '">Link do lekcji </a></td>';
                    echo "</tr>";
                    echo "<tr>";
                    echo '<td colspan="2">';
                    foreach ($classesArray as $class) {
                        echo '<label for="' . $class["name"] . '">' . $class["name"] . '</label><input type="checkbox"';
                        $array = explode('_', $article['classes']);
                        for ($i = 0; $i < count($array); $i++) {
                            if ($array[$i] == $class["name"]) {
                                echo "checked disabled ";
                            }
                        }
                        echo 'id="' . $class["name"] . '" name="' . $class["name"] . '" data-class="' . $article["id"] . '">';
                    }
                    echo '<button id="' . $article["title"] . '" class="btn-classSeter"';
                    echo 'onclick="activeLessonForClasses(\'' . $article["id"] . '\')">Aktywuj dla wybranych klas</button>';
                    echo "</td></tr>";
                }
                echo "</table>";
            }
        } else {
            foreach ($articleSortOfCategory as $category => $articles) {
                echo "<h2>" . $category . "</h2>";
                echo "<table>";
                echo "<tr><th>Nazwa lekcji</th><th>Link do lekcji</th></tr>";
                foreach ($articles as $article) {
                    echo "<tr>";
                    echo "<td>" . $article["title"] . "</td>";
                    $filename = strtolower($article["title"]);
                    $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
                    echo '<td> <a href="/Lekcje/' . $filename . '">Link do lekcji </a></td>';
                    echo "</tr>";
                }
                echo "</table>";
            }
        }
    }
}
// checked disabled