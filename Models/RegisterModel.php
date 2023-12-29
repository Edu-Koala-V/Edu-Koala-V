<?php

class RegisterModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getUserByUsername($username)
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        return $stmt->fetch();
    }


    public function createUser($username, $password, $name, $surname, $class, $nr, $privileges, $avatar, $theme, $score)
    {
        $stmt = $this->db->prepare('INSERT INTO users (username, password, name, surname, class, nr_student, privileges, avatar, theme, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$username, $password, $name, $surname, $class, $nr, $privileges, $avatar, json_encode($theme), $score]);
    }
}
