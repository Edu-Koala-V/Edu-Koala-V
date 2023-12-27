<?php
class ImageController
{
    public function upload()
    {

        $title = $_POST['title'];
        $uploadDir = __DIR__ . '/../Views/Resource/Images/Articles/';
        if (!file_exists($uploadDir . $title)) {
            mkdir($uploadDir . $title, 0777, true);
        }
        $fileName = $_POST['filename'];
        $filePath = $uploadDir . $fileName;
        echo $_FILES['file']['tmp_name'];
        if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
            return 'Image uploaded successfully!';
        } else {
            return 'Error uploading image.';
        }
    }
}
