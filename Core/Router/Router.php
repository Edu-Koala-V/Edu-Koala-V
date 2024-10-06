<?php
namespace Core\Router;

use Core\Container;
use Core\Auth\Validator;
use Core\Base\BaseView;
class Router {
    private static $routes = [];
    private static $middlewares = [];

    /**
     * Trasa renderująca stronę HTML z ./Pages/ o nazwie $filename
     * @param url adres URL bez domeny 
     * @param filename nazwa pliku z folderu ./Pages/ bez rozszerzenia .html
     * @return void
     */
    public static function render($url, $filename, $pageName ="", $JS_CSS = "globalApp") {
        self::$routes['GET'][$url] = function() use ($filename,$pageName, $JS_CSS) {

            $view = new BaseView();
            ob_start();
            $pageContent = file_get_contents("./Pages/".$filename.".html");

            echo  $view->renderPage($pageName, $pageContent, $JS_CSS);
            return ob_get_clean();
        };
    }
    /**
     * Trasa zwracająca rekordy z bazy danych i wyniki metody z kontrolera
     * Klient otrzymuje response w formacie JSON
     *
     * @param url adres URL bez domeny
     * @param controller nazwa kontrolera
     * @param method nazwa metody w kontrolerze
     * @return void
     */
    public static function get(string $url, string $controller, string $method) {
        self::$routes['GET'][$url] = [$controller, $method];
    }
    /**
     * Trasa modyfikująca rekordy tabel w bazie danych
     * (Przyjmowane wartości powinny być w formacie JSON)
     *
     * @param url adres URL bez domeny
     * @param controller nazwa kontrolera
     * @param method nazwa metody w kontrolerze
     * @return void
     */
    public static function post($url, $controller, $method) {
        if(isset($_POST)){
            $validator = Validator::getInstance();
            $requestData = $validator->validatePOST($_POST);
            if($requestData){
                $_POST = $requestData;
            }
        }
        self::$routes['POST'][$url] = [$controller, $method];
    }


    public static function put($url, $controller, $method) {
        if(isset($_FILES)){
            self::$routes['PUT'][$url] = [$controller, $method];
        }
    }

    public static function delete($url, $controller, $method) {
        self::$routes['DELETE'][$url] = [$controller, $method];
    }

    public static function patch($url, $controller, $method) {
        self::$routes['PATCH'][$url] = [$controller, $method];
    }

    public static function middleware($name, $callback) {
        self::$middlewares[$name] = $callback;
    }


    public static function execute($method, $url) {
        foreach (self::$routes[$method] as $routePattern => $action) {
            $routePattern = str_replace('/', '\/', $routePattern);
            $routePattern = preg_replace('/\{[a-zA-Z0-9_-]+\}/', '([a-zA-Z0-9_\'\s-]+)', $routePattern);
            if (preg_match('/^' . $routePattern . '$/', $url, $matches)) {
                array_shift($matches);
                if (is_callable($action)) {
                    echo call_user_func_array($action, $matches);
                } else {
                    list($controller, $method) = $action;
                    $controller = "Core\\Controllers\\$controller";
                    $controllerInstance = new $controller(new Container());
                    call_user_func_array([$controllerInstance, $method], $matches);
                }
                return;
            }
        }
        $pageContent = file_get_contents("./Pages/ERROR.html");
        if(__PRIVILEGES__ === "guest"){
            $pageContent = str_replace("%%ERROR_MESSAGE%%", "Sesja wygasła musisz ponownie się zalogować", $pageContent);
        } else {
        $pageContent = str_replace("%%ERROR_MESSAGE%%", "404: Nie znaleziono strony", $pageContent);
        }
        $view = new BaseView();
            echo  $view->renderPage("ERROR", $pageContent, "globalApp");
        //throw new NotFoundException("No route found for $method $url");
    }



    public static function executeMiddleware($name) {
        if (isset(self::$middlewares[$name])) {
            call_user_func(self::$middlewares[$name]);
        } else {
            //throw new NotFoundException("No middleware found for $name");
        }
    }
}