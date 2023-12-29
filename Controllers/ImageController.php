<?php
class ImageController
{
    public function upload()
    {
        if ($_POST['type'] == 'avatar') {
            $title = $_POST['username'];
            $uploadDir = __DIR__ . '/../Views/Resource/Images/Users/';

            $katalog = $uploadDir . $title;
            $this->removeDir($katalog);
        } else {
            $title = $_POST['title'];
            $uploadDir = __DIR__ . '/../Views/Resource/Images/Articles/';
        }



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

    private function removeDir($path)
    {
        $dir = new DirectoryIterator($path);
        foreach ($dir as $fileinfo) {
            if ($fileinfo->isFile() || $fileinfo->isLink()) {
                unlink($fileinfo->getPathName());
            } elseif (!$fileinfo->isDot() && $fileinfo->isDir()) {
                $this->removeDir($fileinfo->getPathName());
            }
        }
        rmdir($path);
    }
}
