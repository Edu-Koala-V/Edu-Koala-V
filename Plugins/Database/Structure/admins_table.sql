CREATE TABLE admins (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `fname` VARCHAR(125) NOT NULL , 
    `sname` VARCHAR(125) NULL , 
    `lname` VARCHAR(125) NOT NULL , 
    `email` VARCHAR(300) NOT NULL , 
    
    PRIMARY KEY (`id`)
    
) ENGINE = InnoDB;

ALTER TABLE `admins` ADD CONSTRAINT `FK_a_accounts_id`
    FOREIGN KEY (`id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;