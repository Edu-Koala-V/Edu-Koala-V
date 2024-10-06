<?php
namespace Core\Models;
use Core\Base\BaseModel;

class AchievementsModel extends BaseModel{
    public static function getAchievements(){
        $result = self::DB("SELECT * FROM user_achievements 
                                INNER JOIN achievements ON achievements.id = user_achievements.achievements_id
                                WHERE user_id = ?
                            ","i",[$_SESSION['user']['id']]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getAchievementIMG($user_id, $achievement_id){
        $result = self::DB("SELECT img_name FROM user_achievements 
                                INNER JOIN achievements ON achievements.id = user_achievements.achievements_id
                                WHERE user_id = ? AND achievements_id = ?
                            ","ii",[$user_id, $achievement_id]);
        return $result->fetch_assoc();
    }
}