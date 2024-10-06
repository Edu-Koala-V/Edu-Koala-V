<?php
namespace Core\Models;
use Core\Base\BaseModel;
class TasksModel extends BaseModel{
    public static function getTasks($student_id){
        if($student_id==null){
            return self::getAllTask();
        }
        $result = self::DB("SELECT tasks.id, tasks.name, tasks.link, student_tasks_status.status
                                FROM `student_tasks_status`
                                INNER JOIN tasks ON student_tasks_status.task_id=tasks.id
                                WHERE student_id = ?
                                ORDER BY student_tasks_status.id DESC;
            ", "i", [$student_id]);
        return $result->fetch_all(MYSQLI_ASSOC);
      
    }
    public static function getAllTask(){
        $result = self::DB("SELECT * FROM tasks");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getAllTaskByClasses($class_id, $task_id){
        $result = self::DB("SELECT tasks.name as task_name, tasks.id as task_id, students.class_id AS class_id, students.student_nr AS student_nr, fname, sname, lname, student_tasks_status.id as status_id, student_tasks_status.status as status  FROM tasks
                                LEFT JOIN student_tasks_status ON student_tasks_status.task_id = tasks.id
                                INNER JOIN students ON students.id = student_tasks_status.student_id
                                WHERE students.class_id=? AND tasks.id=?
                                ORDER BY tasks.name ASC , students.student_nr ASC;
            ", "ii", [$class_id,$task_id]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function activateTaskByStudent($task_id,$student_id){
        $result = self::DB("INSERT INTO student_tasks_status 
                            (task_id, student_id, status) 
                            VALUES (?,?,?)
                            ", "iii", [$task_id, $student_id, 0]);
        return $result;
    }
    public static function updateTaskStatus($statusID, $status){
        $result = self::DB("UPDATE student_tasks_status 
                            SET status = ?
                            WHERE id = ?
                            ", "si", [$status, $statusID]);
        return $result;
    }
}