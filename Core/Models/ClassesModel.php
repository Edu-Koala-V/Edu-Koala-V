<?php
namespace Core\Models;
use Core\Base\BaseModel;

class ClassesModel extends BaseModel
{
    public static function getClasses()
    {
        $result = self::DB("SELECT classes.id, classes.name, COUNT(students.id) as students_count
                                FROM `classes`
                                LEFT JOIN students ON classes.id = students.class_id
                                WHERE teacher_id = ?
                                GROUP BY classes.name;
                            ", "i", [$_SESSION['user']['id']]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    public static function getClassByName($className)
    {
        $result = self::DB("SELECT * FROM classes 
                            WHERE name = ? AND teacher_id = ?
                            LIMIT 1
                        ", "si", [$className, $_SESSION['user']['id']]);
        return $result->fetch_assoc();
    }
    public static function getStudents($classId)
    {
        $result = self::DB("SELECT students.id, students.fname, students.sname, students.lname, students.student_nr, classes.name, accounts.login, accounts.status FROM `students` 
                            INNER JOIN classes ON students.class_id = classes.id
                            RIGHT JOIN accounts ON students.id = accounts.id
                            WHERE class_id = ?
                            ORDER BY students.student_nr;
                        ", "i",[$classId]);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function addClass($className, $teacherId)
    {
        $result = self::DB("INSERT INTO classes 
                        (name, teacher_id) 
                        VALUES (?,?)
                        ", "si", [$className, $teacherId]);
        return $result;
    }

    public static function addStudentInClass($accountID, $Fname, $Sname, $Lname, $NR, $classID)
    {
        $result = self::DB("INSERT INTO students 
                        (id, fname, sname, lname, class_id, student_nr) 
                        VALUES (?,?,?,?,?,?)
                        ", "isssii", [$accountID, $Fname, $Sname, $Lname, $classID, $NR]);
        return $result;
    }

    public static function getClassName($classID)
    {
        $result = self::DB("SELECT name FROM classes 
                            WHERE id = ?
                            LIMIT 1
                        ", "i", [$classID]);
        return $result->fetch_assoc()['name'];
    }
}