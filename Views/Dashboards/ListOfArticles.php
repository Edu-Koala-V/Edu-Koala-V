<?php

class ListOfArticles
{

    public function renderTable($articleSortOfCategory)
    {
        foreach ($articleSortOfCategory as $category => $articles) {
            echo "<table>";
            echo "<tr><th>ID</th><th>Title</th><th>Update Date</th><th>Category</th></tr>";
            foreach ($articles as $article) {
                echo "<tr>";
                echo "<td>" . $article["id"] . "</td>";
                echo "<td>" . $article["title"] . "</td>";
                echo "<td>" . $article["update_date"] . "</td>";
                echo "<td>" . $category . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }
}
