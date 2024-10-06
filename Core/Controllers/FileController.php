<?php
namespace Core\Controllers;
use Core\Services\Github\UploadToGithubRepo;

class FileController {
    
    private $uploadToGithubRepo;
    public function __construct(){
        $this->uploadToGithubRepo = new UploadToGithubRepo();
    }


    public function deployFile() {
        // Odczytaj surowe dane wejściowe
        $input = file_get_contents('php://input');
    
        // Odczytaj nazwę pliku z nagłówka 'X-File-Name'
        $fileName = $_SERVER['HTTP_X_FILE_NAME'] ?? '';
    
        if ($fileName) {
            // Zapisz dane wejściowe do pliku na serwerze
            $file = './Resources/Upload/' . $fileName;
            file_put_contents($file, $input);
    
            // Sprawdź czy plik został zapisany poprawnie
            if (file_exists($file)) {
                echo 'Plik został zapisany na serwerze pod nazwą: ' . $fileName;
                $this->uploadToGithubRepo->uploadToGithubRepo($file);
            } else {
                echo 'Wystąpił problem podczas zapisu pliku na serwerze.';
            }
        } else {
            echo 'Nie przesłano nazwy pliku.';
        }
    }

}