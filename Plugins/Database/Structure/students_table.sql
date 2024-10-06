CREATE TABLE students (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `fname` VARCHAR(125) NOT NULL , 
    `sname` VARCHAR(125) NULL , 
    `lname` VARCHAR(125) NOT NULL , 
    `class_id` INT NOT NULL , 
    `student_nr` INT NOT NULL , 
    `apkt` INT NOT NULL , 
    `npkt` INT NOT NULL , 
    `qpkt` INT NOT NULL , 

    PRIMARY KEY (`id`)

) ENGINE = InnoDB;

ALTER TABLE `students` ADD CONSTRAINT `FK_s_accounts_id` 
    FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;