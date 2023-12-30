
<?php
require_once  __DIR__ . '/../Models/QuizModel.php';
require_once  __DIR__ . '/../Views/CMS/ArticleView.php';
class QuizController
{
    private $model;
    private $view;
    public function __construct($model, $view) //! Określ który chcesz widok
    {
        $this->model = $model;
        $this->view = $view;
    }

    public function createQuiz()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $title = $_POST['title'];
            $category = $_POST['category'];
            $content = $_POST['content'];
            $contentBlob = $_POST['contentBlob'];

            // $filename = $this->generateFilename($title);
            // $filenameJSON = $this->generateFilename($title, true);
            // $this->model->createArticle($category, $title);
            // $this->saveArticle($filename, $content, $title);
            // $this->saveArticleJSON($filenameJSON, $contentBlob, $title);
            // ('Location: /Lekcje/' . $filename);
        } else {
            $this->view->renderEditor();
        }
    }
}
