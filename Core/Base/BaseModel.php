<?php
namespace Core\Base;

use Attribute;
use mysqli;
use Dotenv\Dotenv;
use Exception;

class BaseModel{

    private static $dbConnection;

    /**
     * Pobierz połączenie z bazą danych.
     *
     * @return mysqli Połączenie z bazą danych.
     */
    public static function getDbConnection() {
        if (!self::$dbConnection) {
            // Wczytaj zmienne środowiskowe
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->load();

            self::$dbConnection = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD'], $_ENV['DB_DATABASE']);
            
            // Sprawdź, czy połączenie zostało pomyślnie ustanowione
            if (self::$dbConnection->connect_error) {
                die('Błąd połączenia: ' . self::$dbConnection->connect_error);
            }

            self::$dbConnection->set_charset("utf8mb4");
        }
        return self::$dbConnection;
    }

    /**
     * Wykonaj zapytanie do bazy danych i zwróć odpowiedni wynik dla:
     * - SELECT: zwróć wynik zapytania
     * - INSERT: zwróć true, jeśli rekordy zostały pomyślnie dodane, w przeciwnym razie false
     * - UPDATE: zwróć true, jeśli rekordy zostały pomyślnie zaktualizowane, w przeciwnym razie false
     * - DELETE: zwróć true, jeśli rekordy zostały pomyślnie usunięte, w przeciwnym razie false
     *
     * @param string $sql Zapytanie SQL do wykonania.
     * @param string|null $attributesType Typ parametrów zapytania. (s - string, i - integer, d - double, b - blob)
     * @param array|null $attributes Parametry zapytania.(Muszą być w takiej samej kolejności jak w zapytaniu są "?" i w tablicy)
     * @return mixed Wynik zapytania.
     * @throws Exception Jeśli wystąpi błąd podczas wykonywania zapytania.
     */
    public static function DB(string $sql, string $attributesType=null, array $attributes=null){
        $db = self::getDbConnection();
        $stmt = $db->prepare($sql);
        if ($stmt === false) {
            throw new Exception($db->error);
        }
    
        if ($attributesType != null && $attributes != null) {
            $bindResult = $stmt->bind_param($attributesType, ...$attributes);
            if ($bindResult === false) {
                throw new Exception($stmt->error);
            }
        }
    
        $executeResult = $stmt->execute();
        if ($executeResult === false) {
            throw new Exception($stmt->error);
        }
    
        $result = $stmt->get_result();
        $firstWord = explode(" ", $sql);
    
        switch(strtoupper($firstWord[0])){
            case "SELECT": 
                return $result; 
            default: 
                if (mysqli_affected_rows($db) > 0) {
                    return true; // Rekordy zostały pomyślnie dodane, zaktualizowane lub usunięte
                }
                return false; // Nie udało się dodać rekordów, zaktualizować lub usunąć
        }
        $stmt->close();
    }
}