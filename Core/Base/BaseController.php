<?php
namespace Core\Base;

/**
 * Klasa bazowa dla kontrolerów.
 */
class BaseController
{

    /**
     * Przekonstruowuje i wyświetla dane jako JSON.
     *
     * @param mixed $varData Dane do wyświetlenia.
     */
    public static function echo_asJSON($varData){
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($varData);
    }

    /**
     * Pobiera dane żądania.
     *
     * @return array|null Dane żądania lub null, jeśli żądanie jest nieprawidłowe.
     */
    public function getRequestData() {
        $requestData = file_get_contents('php://input');// Pobierz dane przesłane w formie ciągu JSON
        $requestData = json_decode($requestData, true);// Dekoduj dane do tablicy asocjacyjnej
        
        return $this->isValidRequest($requestData) ? $requestData : null;
    }

    /**
     * Sprawdza, czy żądanie posiada prawidłowy user_token zgodny z $_SESSION['csrf_token'] .
     *
     * @param array $requestData Dane żądania.
     * @return bool True, jeśli żądanie jest prawidłowe, w przeciwnym razie false.
     */
    private function isValidRequest($requestData){
        return isset($requestData['user_token']) && $requestData['user_token'] === $_SESSION['csrf_token']; 
    }

    
}