<?php

class ListOfArticles
{

    public function renderTable($articleSortOfCategory)
    {
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
