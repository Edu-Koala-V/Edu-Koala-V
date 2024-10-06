<?php
namespace Core\Models;
use Core\Base\BaseModel;

class ResourcesModel extends BaseModel
{
    public static function getResources()
    {
        $result = self::DB("SELECT * FROM resources");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function addResource($name, $url, $type)
    {
        $result = self::DB("INSERT INTO resources 
                        (name, url, type) 
                        VALUES (?,?,?)
                        ", "sss", [$name, $url, $type]);
        return $result;
    }
    public static function updateResource($id, $name, $url, $type)
    {
        $result = self::DB("UPDATE resources 
                        SET name = ?, url = ?, type = ?
                        WHERE id = ?
                        ", "sssi", [$name, $url, $type, $id]);
        return $result;
    }
    public static function deleteResource($id)
    {
        $result = self::DB("DELETE FROM resources WHERE id = ?", "i", [$id]);
        return $result;
    }
}