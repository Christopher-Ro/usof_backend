DROP DATABASE IF EXISTS `usof`;
CREATE DATABASE IF NOT EXISTS `usof`;

USE `usof`;

DROP TABLE IF EXISTS `usof`.`user`;

CREATE TABLE IF NOT EXISTS `usof`.`user` (
    `login` VARCHAR(45) NOT NULL UNIQUE,
    `password` VARCHAR(60) NOT NULL,
    `full_name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL UNIQUE,
    `profile_pictrue` VARCHAR(45) NOT NULL,
    `rating` INT NOT NULL,
    `role` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`login`)
);

DROP TABLE IF EXISTS `usof`.`post`;

CREATE TABLE IF NOT EXISTS `usof`.`post` (
    `id` INT AUTO_INCREMENT NOT NULL UNIQUE,
    `author` VARCHAR(45) NOT NULL,
    `title` VARCHAR(45) NOT NULL,
    `publish_date` DATETIME NOT NULL,
    `status` BOOLEAN NOT NULL,
    `content` VARCHAR(800) NOT NULL,
    FOREIGN KEY (`author`) REFERENCES `user` (`login`),
    PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `usof`.`category`;

CREATE TABLE IF NOT EXISTS `usof`.`category` (
    `id` INT AUTO_INCREMENT NOT NULL UNIQUE,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `usof`.`post_category`;

CREATE TABLE IF NOT EXISTS `usof`.`post_category` (
    `post_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
    PRIMARY KEY (`post_id`, `category_id`)
);

DROP TABLE IF EXISTS `usof`.`comment`;

CREATE TABLE IF NOT EXISTS `usof`.`comment` (
    `id` INT AUTO_INCREMENT NOT NULL UNIQUE,
    `author` VARCHAR(45) NOT NULL,
    `publish_date` DATETIME NOT NULL,
    `content` VARCHAR(400) NOT NULL,
    `post_id` INT NOT NULL,
    FOREIGN KEY (`author`) REFERENCES `user` (`login`),
    FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `usof`.`like`;

CREATE TABLE IF NOT EXISTS `usof`.`like` (
    `id` INT AUTO_INCREMENT NOT NULL UNIQUE,
    `author` VARCHAR(45) NOT NULL,
    `publish_date` DATETIME NOT NULL,
    `is_post` BOOLEAN NOT NULL,
    `liked_entity_id` INT NOT NULL,
    `is_like` BOOLEAN NOT NULL,
    FOREIGN KEY (`author`) REFERENCES `user` (`login`),
    UNIQUE(`author`, `is_post`, `liked_entity_id`),
    PRIMARY KEY (`id`)
);


INSERT INTO `user` (`login`, `password`, `full_name`, `email`, `profile_pictrue`, `rating`, `role`)
VALUES 
        ('admin', '$2a$10$FfV01b6o7mJWKbWr5y4Bhe5eaCkn.V0wKmJ53UTCC31Nu07Tgbg7i', 'Ludwig Wanstain', 'admin@adminmail.com', 'Pic.jpg', -1, 'ADMIN'), /* password: admin */
        ('Nerd', '$2a$10$L/dBeQmFq5FSek3bEOHJ8.OK4GIqUSKEuGZ1pgNJ0AMMNibOMXhX.', '', 'sabuki@mail.com', 'the_portret.jpg', 99, 'USER'); /* password: securepass */

INSERT INTO `post` (`author`, `title`, `status`, `publish_date`, `content`)
VALUES 
        ('admin', 'TEST TITLE', TRUE, NOW(), 'How do I post stuff on this resourse?'),
        ('admin', 'I am your new admin', TRUE, NOW(), 'YOU ALL ARE SHIT! SHIT MUST SPEAK LOUDER!'),
        ('admin', 'asdfdkfaldsh', FALSE, NOW(), 'adgafljdslfj'),
        ('Nerd', 'I am new dude', TRUE, NOW(), 'Give me free tips on JS.'),
        ('Nerd', 'NullReference Exception', TRUE, NOW(), 'I had this error in my code. What did I do wrong?');

INSERT INTO `comment` (`author`, `publish_date`, `content`, `post_id`)
VALUES 
        ('Nerd', NOW(), 'Please, stop :(', 2),
        ('admin', NOW(), 'I AM THE POWER!', 2),
        ('Nerd', NOW(), 'Stop abusing me', 2),
        ('admin', NOW(), 'I will BAN you!', 2),
        ('Nerd', NOW(), 'NOOOOooo...', 2);

INSERT INTO `like` (`author`, `publish_date`, `is_post`, `liked_entity_id`, `is_like`)
VALUES 
        ('Nerd', NOW(), TRUE, 2, FALSE),
        ('admin', NOW(), FALSE, 1, FALSE),
        ('Nerd', NOW(), FALSE, 2, FALSE),
        ('admin', NOW(), FALSE, 3, FALSE),
        ('Nerd', NOW(), FALSE, 5, TRUE);

INSERT INTO `category` (`title`, `description`)
VALUES
        ('TEST', 'This is a test category. Nothing interesting'),
        ('Spam', 'Bad thing'),
        ('Question', 'Asking for information'),
        ('Announcement', 'General announcement'),
        ('Bad Idea', 'For bad ideas only');

INSERT INTO `post_category` (`post_id`, `category_id`)
VALUES
    (1, 1),
    (1, 2),
    (2, 4),
    (3, 2),
    (4, 5),
    (5, 3);
