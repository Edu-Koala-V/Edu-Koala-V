CREATE TABLE accounts 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `login` VARCHAR(125) NOT NULL ,
    `password` VARCHAR(125) NOT NULL DEFAULT 'ZAQ!2wsx1234' ,
    `role` ENUM('Student','Teacher','Admin') NOT NULL DEFAULT 'Student' ,
    `status` ENUM('new','blocked','suspended') NULL ,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
    `settings` JSON NOT NULL DEFAULT '{}' ,
     PRIMARY KEY (`id`), 
     UNIQUE `UNIQUES_login_accounts` (`login`)

) ENGINE = InnoDB;