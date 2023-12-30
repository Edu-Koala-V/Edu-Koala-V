<?php
require_once  __DIR__ . '/../Models/ArticleModel.php';
require_once  __DIR__ . '/../Views/CMS/ArticleView.php';
require_once  __DIR__ . '/../Views/Dashboards/ListOfArticles.php';
class ArticleController
{
    private $model;
    private $view;
    public function __construct($model, $view) //! Określ który chcesz widok
    {
        $this->model = $model;
        $this->view = $view;
    }
    public function createArticle()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $title = $_POST['title'];
            $category = $_POST['category'];
            $content = $_POST['content'];
            $contentBlob = $_POST['contentBlob'];

            $filename = $this->generateFilename($title);
            $filenameJSON = $this->generateFilename($title, true);
            $this->model->createArticle($category, $title);
            $this->saveArticle($filename, $content, $title);
            $this->saveArticleJSON($filenameJSON, $contentBlob, $title);
            // ('Location: /Lekcje/' . $filename);
        } else {
            $this->view->renderEditor();
        }
    }
    public function displayArticle($filename)
    {
        $article = $this->model->getArticle($filename);
        if ($article) {
            $this->view->renderArticle($article);
        } else {
            http_response_code(404);
        }
    }
    private function generateFilename($title, $JSON = false)
    {
        $filename = strtolower($title);
        $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
        if ($JSON) {
            return $filename . '.json';
        } else {
            return $filename . '.html';
        }
    }
    private function saveArticleJSON($filename, $JSON)
    {
        $content =  $JSON;
        $path = 'Views/JSON/' . $filename;
        file_put_contents($path, $content);
    }
    private function saveArticle($filename, $html, $title)
    {
        $layout = file_get_contents('Views/Layouts/ArticleLayout.html');
        $layout = str_replace('{{{Title_article}}}', $title, $layout);
        $content = str_replace('{{{Article_Content}}}', $html, $layout);
        $path = 'Views/Articles/' . $filename;
        file_put_contents($path, $content);
    }
    public function getAllArticlesArray($classesArray)
    {
        $articles = $this->model->getAllArticles();
        $data = $articles->fetch_all(MYSQLI_ASSOC);

        //? Podział tablicy na mniejsze tablice
        $categories = array();
        foreach ($data as $row) {
            $category = $row['category'];
            unset($row['category']);
            $categories[$category][] = $row;
        }
        if ($categories) {
            $this->view->renderTable($categories, $classesArray);
        }
        return $categories;
    }
    public function setActiveArticleForClass()
    {
        $id = $_POST['lessonID'];
        $classesNames = $_POST['classesNames'];
        $this->model->activeArticleForClass($classesNames, $id);
    }
    public function getAllArticlesForStudent($classID)
    {
        $articles = $this->model->getAllArticlesForStudent($classID);
        $data = $articles->fetch_all(MYSQLI_ASSOC);

        //? Podział tablicy na mniejsze tablice
        $categories = array();
        foreach ($data as $row) {
            $category = $row['category'];
            unset($row['category']);
            $categories[$category][] = $row;
        }
        if ($categories) {
            $this->view->renderTable($categories);
        }
        return $categories;
    }
}
