CREATE TABLE archive_exam 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `quiz_id` INT NOT NULL ,
    `time` INT NOT NULL ,
    `approach_one` JSON NOT NULL ,
    `approach_two` JSON NULL ,
    `score_one` INT NOT NULL ,
    `score_two` INT NULL ,
    `date_approach_one` DATE NOT NULL ,
    `date_approach_two` DATE NULL ,
    
    PRIMARY KEY (`id`)
    
    )
ENGINE = InnoDB;
