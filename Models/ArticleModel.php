<?php
class ArticleModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function createArticle($category, $title)
    {
        $stmt = $this->db->prepare("INSERT INTO articles (title, category, update_date) VALUES (?, ?, NOW())");
        $stmt->bind_param("ss", $title, $category);
        $stmt->execute();
        $stmt->close();
    }

    public function updateArticle($id, $title, $category)
    {
        $stmt = $this->db->prepare("UPDATE articles SET title = $title, update_date = NOW(), category = $category WHERE id = $id");
        $stmt->bind_param("ss", $title, $category);
        $stmt->execute();
        $stmt->close();
    }
    public function indexArticle($title, $category)
    {
        $stmt = $this->db->prepare("SELECT * FROM articles WHERE title = $title AND category = $category");
        $stmt->bind_param("ss", $title, $category);
        $stmt->execute();
        $stmt->close();
    }

    public function getAllArticles()
    {
        $stmt = $this->db->query("SELECT * FROM articles ORDER BY category");
        return $stmt;
    }

    public function getArticle($filename)
    {

        // TODO: pobieranie tytułów lekcji z baz danych i nazw plików by zwrócić do widoku
        $path = 'Views/Articles/' . $filename . '.php';
        $path2 = 'Views/Articles/' . $filename . '.html';
        if (file_exists($path)) {
            $html = file_get_contents($path);
            $article =  $html;
            return $article;
        } else if (file_exists($path2)) {
            $html = file_get_contents($path2);
            $article =  $html;
            return $article;
        } else {
            return null;
        }
    }
}
