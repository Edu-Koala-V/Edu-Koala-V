<?php
class UserModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getUserByUsername($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function getUserByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function createUser($username, $password, $email) //Chyba trzeba usunąć
    {
        $stmt = $this->db->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $password, $email);
        $stmt->execute();
        $stmt->close();
    }

        public function getUser($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $result = $result->fetch_assoc();
            $id = $result['class'];
            $data = $this->getClassNameByID($id);
            if(isset($data['name']))
            {
                $result['className'] = $data['name'];
            } else {
                $result['className'] ='brak';
            }
            
            $stmt->close();
            return $result;
        } else {
            $stmt->close();
            return null;
        }
    }
    public function getClassNameByID($id)
    {
        $stmt = $this->db->prepare("SELECT name FROM classes WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $stmt->close();
        return $result->fetch_assoc();;
    }
    public function updateUserAvatar($username, $avatarFileName)
    {
        $stmt = $this->db->prepare("UPDATE users SET avatar = ? WHERE username = ?");
        $stmt->bind_param("ss", $avatarFileName, $username);
        $stmt->execute();
        $stmt->close();
    }
    public function changeCryptPassword($username, $cryptPassword)
    {
        $stmt = $this->db->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->bind_param("ss", $cryptPassword, $username);
        $stmt->execute();
        $stmt->close();
    }
}
