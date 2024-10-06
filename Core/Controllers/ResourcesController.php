<?php
namespace Core\Controllers;
use Core\Base\BaseController;
use Core\Models\ResourcesModel;
use Core\Views\ResourcesView;

class ResourcesController extends BaseController{
    public function index(){
        $resources = ResourcesModel::getResources();
        $view = new ResourcesView();
        $view->render($resources);
    }
}