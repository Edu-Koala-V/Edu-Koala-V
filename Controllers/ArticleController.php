<?php
require_once  __DIR__ . '/../Models/ArticleModel.php';
require_once  __DIR__ . '/../Views/CMS/ArticleView.php';
require_once  __DIR__ . '/../Views/Dashboards/ListOfArticles.php';

class ArticleController
{
    private $model;
    private $view;

    public function __construct($model, $view) // Określ który chcesz widok
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
            $html = $this->convertToHtml($content);
            $filename = $this->generateFilename($title);
            $this->model->createArticle($category, $title);
            $this->saveArticle($filename, $html);
            ('Location: /Lekcje/' . $filename);
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

    private function convertToHtml($content)
    {
        // TODO: Pozamieniać wszystkie znaczki na klasy z zmiennymi CSS
        return $content;
    }

    private function generateFilename($title)
    {
        $filename = strtolower($title);
        $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
        return $filename . '.html';
    }

    private function saveArticle($filename, $html)
    {
        $layout = file_get_contents('Views/Layouts/ArticleLayout.html');
        $content = str_replace('{{{Article_Content}}}', $html, $layout);
        $file_article = 'Views/Articles/' . $filename . '.html';
        file_put_contents($file_article, $content);
        $path = 'Views/Articles/' . $filename;
        file_put_contents($path, $html);
    }

    public function getAllArticlesArray()
    {
        $articles = $this->model->getAllArticles();
        $data = $articles->fetch_all(MYSQLI_ASSOC);

        // Podział tablicy na mniejsze tablice
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
