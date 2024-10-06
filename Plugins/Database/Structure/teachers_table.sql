CREATE TABLE teachers (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `fname` VARCHAR(125) NOT NULL , 
    `sname` VARCHAR(125) NULL , 
    `lname` VARCHAR(125) NOT NULL , 
    `email` VARCHAR(300) NOT NULL , 
    `github_token` TEXT NULL,
    
    PRIMARY KEY (`id`)
    
) ENGINE = InnoDB;

ALTER TABLE `teachers` ADD CONSTRAINT `FK_t_accounts_id`
    FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;