<?php
namespace Core\Services\Github;

use GuzzleHttp\Client;

class GetAllFileNameFromGithubRepo
{
    private $client;
    private $owner = 'KiraTheGames';
    private $repo = 'test';
    private $accessToken = '';

    public function __construct()
    {
        $this->accessToken = $_SESSION['user']['github_token'];
        $this->client = new Client([
            'base_uri' => 'https://api.github.com',
            'headers' => [
                'Authorization' => "token $this->accessToken",
                'User-Agent' => 'GuzzleHttp'
            ]
        ]);
    }

    public function getFiles($path = '')
    {
        $response = $this->client->request('GET', "/repos/$this->owner/$this->repo/contents/$path");
        $data = json_decode($response->getBody(), true);
        echo '/repos/$this->owner/$this->repo/contents/$path';
        $files = [];
        foreach ($data as $file) {
            if ($file['type'] == 'dir') {
                $files[$file['name']] = $this->getFiles($file['path']);
            } else {
                $files[] = $file['name'];
            }
        }
        return $files;
    }
}