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

    public function activeArticleForClass($classesNames, $id)
    {

        $stmt = $this->db->prepare("UPDATE articles SET classes=? WHERE id = $id");
        $stmt->bind_param("s", $classesNames);
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
    public function getAllArticlesForStudent($classID)
    {
        $result = $this->db->query("SELECT name FROM `classes` WHERE id = $classID;");
        $className = $result->fetch_row();
        //$className = $className->fetch_all(MYSQLI_ASSOC);
        $className = '%' . $className[0] . '%';
        $stmt = $this->db->prepare("SELECT * FROM articles WHERE classes LIKE ?");
        $stmt->bind_param("s", $className);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result;
    }

    public function getArticle($filename)
    {
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
