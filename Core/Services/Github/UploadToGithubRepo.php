<?php
namespace Core\Services\Github;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class UploadToGithubRepo
{
    //https://github.com/settings/tokens
    //Zastosuj OAuth token


  
    public function uploadToGithubRepo($filePath)
    {
        $owner = 'KiraTheGames';
        $repo = 'test';
        $path = "./dupa.zip"; // Nazwa pliku na GitHubie
        
        $branch = 'main';
        $message = 'Twoja wiadomość commita';
        $accessToken = $_SESSION['user']['github_token'];
       
        $content = base64_encode(file_get_contents($filePath));
        
        // // Otwórz plik jako strumień
        // $handle = fopen($filePath, 'r');
        // $content = "./Files/".$filePath;
    
        // // Odczytaj i zakoduj plik kawałek po kawałku
        // while (!feof($handle)) {
        //     $part = fread($handle, 8192);
        //     $content .= base64_encode($part);
        // }
    
        // fclose($handle);
    
        $client = new Client([
            'base_uri' => 'https://api.github.com',
            'headers' => [
                'Authorization' => "token $accessToken",
                'User-Agent' => 'GuzzleHttp'
            ]
        ]);
    
        try {
            $response = $client->request('PUT', "/repos/$owner/$repo/contents/$path", [
                'json' => [
                    'message' => $message,
                    'content' => $content, 
                    'branch' => $branch
                ]
            ]);
            echo $response->getBody();
        } catch (ClientException $e) {
            if ($e->getResponse()->getStatusCode() == 404) {
                echo "Nie znaleziono repozytorium lub pliku.";
            } else {
                throw $e;
            }
        }
    }
    

    
}

