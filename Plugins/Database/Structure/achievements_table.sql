CREATE TABLE achievements 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `img_name` VARCHAR(220) NOT NULL ,
    `title` VARCHAR(220) NOT NULL ,
    `description_text` TEXT NOT NULL ,

    PRIMARY KEY (`id`)
    
    )
ENGINE = InnoDB;
