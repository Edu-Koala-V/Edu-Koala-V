<?php
namespace Core\Controllers;
use Core\Base\BaseController;
use Core\Models\AchievementsModel;

class AchievementsController extends BaseController{
    public function getAchievements(){
        $achievements = AchievementsModel::getAchievements();
        self::echo_asJSON($achievements);
    }
}