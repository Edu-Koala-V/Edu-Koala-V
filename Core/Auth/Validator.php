<?php
namespace Core\Auth;

class Validator {
    private static $instance;

    private function __construct() {}

    public static function getInstance() {
        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function validatePOST($request) {
        if($this->isValidRequest($request)){
            return array_map([$this, 'sanitize'], $request);
        }
    }

    public function sanitize($data){
        return htmlspecialchars($data);
    }

    private function isValidRequest($requestData){
        return isset($requestData['user_token']) && $requestData['user_token'] === $_SESSION['csrf_token']; 
    }
}