CREATE TABLE lessons_content
    (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `json_link` TEXT NOT NULL ,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `authors` JSON NOT NULL ,
    `quiz_id` INT NULL ,

    PRIMARY KEY (`id`)
    )
ENGINE = InnoDB;
