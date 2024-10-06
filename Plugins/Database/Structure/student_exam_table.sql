CREATE TABLE student_exam 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `quiz_id` INT NOT NULL ,
    `time` INT NOT NULL ,
    `archive_id` INT NULL ,
    `user_id` INT NOT NULL,

    PRIMARY KEY (`id`)
    
    )
    
ENGINE = InnoDB;