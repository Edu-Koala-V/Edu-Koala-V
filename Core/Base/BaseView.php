<?php
namespace Core\Base;

use Dotenv\Dotenv;
use Core\Auth\Auth;
use Core\Models\AccountModel;
use Core\Models\AchievementsModel;

use function PHPUnit\Framework\isEmpty;

class BaseView {
    private static $templateCache = [];

    /**
     * Ładuje szablon z podanej ścieżki i zapisuje go w pamięci podręcznej.
     *
     * @param string $path Ścieżka do pliku szablonu.
     * @return string Zawartość szablonu.
     */
    private function loadTemplate($path) {
        if (isset($_SESSION["templateCache"])) {
            self::$templateCache = $_SESSION["templateCache"];
        }
        if (!isset(self::$templateCache[$path])) {
            self::$templateCache[$path] = file_get_contents($path);
            $_SESSION["templateCache"] = self::$templateCache;
        }
        return self::$templateCache[$path];
    }

    /**
     * Renderuje stronę z podanymi parametrami.
     *
     * @param string $pageName Nazwa strony.
     * @param string $content Zawartość strony.
     * @param string $js_css_FileName Nazwa pliku JS/CSS.
     * @return string Renderowana strona HTML.
     */
    public function renderPage($pageName, $content, $js_css_FileName) {
        $this->loadEnvironmentVariables();

        $head = $this->loadTemplate(__DIR__ . "/../../Pages/Templates/head.html");
        $header = $this->loadTemplate(__DIR__ . "/../../Pages/Templates/header.html");
        $footer = $this->loadTemplate(__DIR__ . "/../../Pages/Templates/footer.html");

        $head = $this->replacePlaceholders($head, [
            '%%PAGE_NAME%%' => $pageName,
            '%%JS_CSS%%' => $js_css_FileName,
            '%%DOMAIN_NAME%%' => $_ENV['DOMAIN_NAME']
        ]);

        $header = $this->replacePlaceholders($header, [
            '%%DOMAIN_NAME%%' => $_ENV['DOMAIN_NAME']
        ]);

        $navbar = $this->generateNavbar();
        $navbarButtonMenu = $this->generateNavbarButtonMenu();

        $tokenCSRF = Auth::tokenCSRF();
        $header = str_replace(" %%BUTTON_MENU%%", $navbarButtonMenu, $header);
        $header = str_replace("%%CSRF%%", $tokenCSRF, $header);
        $scriptFileLink = "";

        if( is_file(__DIR__ . "/../../app/JS/$js_css_FileName.js") ){
            $scriptFileLink = "<script src='/app/JS/$js_css_FileName.js'></script>";
        }
        $html = $head . "<body>" . $header . $navbar . "<main>" . $content . "</main>" . $footer . $scriptFileLink . "</body></html>";
        ob_start();
        header('Content-Type: text/html; charset=utf-8');
        echo $html;
        return ob_get_clean();
    }

    /**
     * Ładuje zmienne środowiskowe z pliku .env.
     */
    private function loadEnvironmentVariables() {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();
    }

    /**
     * Zastępuje znaczniki w szablonie podanymi wartościami.
     *
     * @param string $template Szablon do przetworzenia.
     * @param array $placeholders Tablica znaczników i ich wartości.
     * @return string Przetworzony szablon.
     */
    private function replacePlaceholders($template, $placeholders) {
        foreach ($placeholders as $placeholder => $value) {
            $template = str_replace($placeholder, $value, $template);
        }
        return $template;
    }

    /**
     * Generuje pasek nawigacyjny na podstawie uprawnień użytkownika.
     *
     * @return string Pasek nawigacyjny.
     */
    private function generateNavbar() {
        if (!isset($_SESSION["user"])) {
            return "";
        }

        $settings = AccountModel::getSettings($_SESSION["user"]["id"]);
        $avatarIMG = $this->getAvatarImage($settings);

        $navbarTemplate = $this->getNavbarTemplate();
        $navbar = $this->replacePlaceholders($navbarTemplate, [
            '%%AVATAR_IMG%%' => $avatarIMG["img_name"],
            '%%FNAME%%' => $_SESSION["user"]["fname"],
            '%%SNAME%%' => $_SESSION["user"]["sname"],
            '%%LNAME%%' => $_SESSION["user"]["lname"]
        ]);

        $navbar = $this->replaceUserSpecificPlaceholders($navbar);

        return $navbar;
    }

    /**
     * Pobiera obrazek awatara użytkownika.
     *
     * @param array $settings Ustawienia konta użytkownika.
     * @return array Informacje o obrazku awatara.
     */
    private function getAvatarImage($settings) {
        if (isEmpty($settings) || $settings["avatar"] == 0 || $settings["avatar"] == null) {
            return ["img_name" => "defaultAvatar.jpg"];
        } else {
            return AchievementsModel::getAchievementIMG($_SESSION["user"]["id"], $settings["avatar"]);
        }
    }

    /**
     * Pobiera odpowiedni szablon paska nawigacyjnego na podstawie uprawnień użytkownika.
     *
     * @return string Szablon paska nawigacyjnego.
     */
    private function getNavbarTemplate() {
        switch (__PRIVILEGES__) {
            case "student":
                return $this->loadTemplate(__DIR__ . "/../../Pages/Templates/navbarStudent.html");
            case "teacher":
                return $this->loadTemplate(__DIR__ . "/../../Pages/Templates/navbarTeacher.html");
            case "admin":
                return $this->loadTemplate(__DIR__ . "/../../Pages/Templates/navbarAdmin.html");
            default:
                return "";
        }
    }

    /**
     * Zastępuje specyficzne dla użytkownika znaczniki w pasku nawigacyjnym.
     *
     * @param string $navbar Pasek nawigacyjny do przetworzenia.
     * @return string Przetworzony pasek nawigacyjny.
     */
    private function replaceUserSpecificPlaceholders($navbar) {
        switch ($_SESSION['user']['privileges']) {
            case "student":
                $navbar = str_replace("%%CLASS_NAME%%", "<span>Klasa </span><b>" . $_SESSION['user']['class_name'] . "</b>", $navbar);
                $navbar = str_replace("%%STUDENT_NR%%", "<span>Nr. </span><b>" . $_SESSION['user']['student_nr'] . "</b>", $navbar);
                break;
            case "teacher":
                $navbar = str_replace("%%CLASS_NAME%%", "<i>&nbsp;</i>", $navbar);
                $navbar = str_replace("%%STUDENT_NR%%", "<i>Nauczyciel</i>", $navbar);
                break;
            case "admin":
                $navbar = str_replace("%%CLASS_NAME%%", "<i>&nbsp;</i>", $navbar);
                $navbar = str_replace("%%STUDENT_NR%%", "<i>Admin</i>", $navbar);
                break;
        }
        return $navbar;
    }

    /**
     * Generuje menu przycisków paska nawigacyjnego.
     *
     * @return string Menu przycisków paska nawigacyjnego.
     */
    private function generateNavbarButtonMenu() {
        if (isset($_SESSION["user"])) {
            return $this->loadTemplate(__DIR__ . "/../../Pages/Templates/navbar-button-menu.html");
        }
        return "";
    }
}