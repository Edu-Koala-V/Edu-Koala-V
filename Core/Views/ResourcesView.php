<?php
namespace Core\Views;
use Core\Base\BaseView;

class ResourcesView extends BaseView{
    public function render($resources){
        $resourcesHTML = $this->setupResources($resources);
        echo self::renderPage("Zasoby do pobrania",$resourcesHTML,"downloadApp");
    }

    private function setupResources($resources){
        $resourcesPage = file_get_contents(__DIR__ . "/../../Pages/ResourcesPage.html");
        $resourceBox = file_get_contents(__DIR__ . "/../../Pages/ResourceBox.html");
        $resourcesHTML = "";
        foreach($resources as $resource){
            $resourcesHTML .= str_replace("%%NAME%%", $resource['name'], $resourceBox);
            $resourcesHTML = str_replace("%%URL%%", $resource['link'], $resourcesHTML);
            switch($resource['type']){
                case "gdrive":
                    $type = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png";
                    $service_name = "Google Drive";
                    break;
                case "mega_nz":
                    $type = "https://mega.nz/favicon.ico";
                    $service_name = "Mega.nz";
                    break;
                case "dropbox":
                    $type = "https://www.dropbox.com/static/images/favicon-vflUeLeeY.ico";
                    $service_name = "Dropbox";
                    break;
                default:
                    $type = "https://www.google.com/s2/favicons?domain=" . $resource['type'];
                    $service_name = "Inny";
            }
            $resourcesHTML = str_replace("%%TYPE%%", $type, $resourcesHTML);
            $resourcesHTML = str_replace("%%SERVICE_NAME%%", $service_name, $resourcesHTML);
        }
        $resourcesPage = str_replace("%%RESOURCES%%", $resourcesHTML, $resourcesPage);

        if($_SESSION["user"]["privileges"] !== "student"){
            $addResourceButton = '<button class="btn classical add-new-resources" type="button" role="button" aria-label="Dodaj nowe zasoby" title="Dodaj nowe zasoby">
                                    + 
                                </button>';
            $resourcesPage = str_replace("%%BUTTON_ADD_NEW_RESOURCES%%", $addResourceButton, $resourcesPage);
        }else{
            $resourcesPage = str_replace("%%BUTTON_ADD_NEW_RESOURCES%%", "", $resourcesPage);

        }

        return $resourcesPage;
    }
}