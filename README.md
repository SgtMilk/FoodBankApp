Welcome to the Meet The Need food bank web app. This web app helps food banks manage the food baskets they give through QR code recognition.

This web-app was made to run on a raspberry pi, but could be easily adapted to other hardware.

Note that this web-app is made to run on a normal 1080p (higher resolutions and 720p are fine too) desktop and not on any tablets/smartphone. There are no media queries on this web-app.

I would recommend doing a clone of the raspberry pi disk each month just in case of a problem so that not all data is lost.

Setup:

On your raspberry pi command line, type:

    sudo apt-get update

    sudo apt-get upgrade

    sudo apt-get install git

    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

    sudo apt-get install -y nodejs

    sudo apt-get install mariadb-server

Now that everything is installed, let's create our environment. Type:

    cd

    git clone https://github.com/SgtMilk/FoodBankApp.git

    cd FoodBankApp

    npm update

    cd meettheneed

    npm update

    npm run build

    cd

Now, let's configure our mysql database. Type:

    cd

    sudo mysql_secure_installation

    //Here, answer yes to all questions and set your root password

    sudo mysql -u root -p       //and enter mysql password

    //Type the following in the mysql interface:

        CREATE USER 'admin'@'localhost' identified by 'your admin password here';

        GRANT ALL PRIVILEGES ON * . * TO 'admin'@'localhost';

        FLUSH PRIVILEGES;

        exit;

    mysql -u admin -p

    //Type the following in the mysql interface:

        CREATE DATABASE meettheneed;

        USE meettheneed;

        CREATE TABLE `meettheneed`.`admins` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `username` VARCHAR(45) NOT NULL,
            `password` VARCHAR(64) NOT NULL,
            PRIMARY KEY (`id`));

        CREATE TABLE `meettheneed`.`dependants` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `firstName` VARCHAR(45) NOT NULL,
        `lastName` VARCHAR(45) NOT NULL,
        `dateOfBirth` VARCHAR(45) NOT NULL,
        `sex` VARCHAR(15) NOT NULL,
        `studentStatus` VARCHAR(45) NOT NULL,
        `memberStatus` VARCHAR(45) NOT NULL,
        `volunteerStatus` VARCHAR(45) NOT NULL,
        `email` VARCHAR(45) NULL DEFAULT NULL,
        `homePhoneNumber` VARCHAR(45) NULL DEFAULT NULL,
        `cellphoneNumber` VARCHAR(45) NULL DEFAULT NULL,
        `homeNumber` INT NOT NULL,
        `homeStreet` VARCHAR(45) NOT NULL,
        `appartmentNumber` VARCHAR(45) NULL DEFAULT NULL,
        `appartmentLevel` VARCHAR(45) NULL DEFAULT NULL,
        `homeEntryCode` VARCHAR(45) NULL DEFAULT NULL,
        `homePostalCode` VARCHAR(20) NOT NULL,
        `residencyProofStatus` VARCHAR(45) NOT NULL,
        `typeOfHouse` VARCHAR(100) NOT NULL,
        `sourceOfRevenue` VARCHAR(100) NOT NULL,
        `familyComposition` VARCHAR(100) NOT NULL,
        `numberOfOtherFamilyMembers` VARCHAR(45) NOT NULL,
        `DOBfamilyMember1` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember2` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember3` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember4` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember5` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember6` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember7` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember8` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember9` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember10` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember11` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember12` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember13` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember14` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember15` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember16` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember17` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember18` VARCHAR(20) NULL DEFAULT NULL,
        `DOBfamilyMember19` VARCHAR(20) NULL DEFAULT NULL,
        `sourceOrganismName` VARCHAR(100) NULL DEFAULT NULL,
        `socialWorkerNameOrganism` VARCHAR(100) NULL DEFAULT NULL,
        `socialWorkerPhoneNumberOrganism` VARCHAR(45) NULL DEFAULT NULL,
        `socialWorkerPostOrganism` INT NULL DEFAULT NULL,
        `curatelName` VARCHAR(100) NULL DEFAULT NULL,
        `socialWorkerNameCuratel` VARCHAR(100) NULL DEFAULT NULL,
        `socialWorkerPhoneNumberCuratel` VARCHAR(45) NULL DEFAULT NULL,
        `socialWorkerPostCuratel` INT NULL DEFAULT NULL,
        `registrationDate` DATETIME NOT NULL,
        `lastRenewment` DATETIME NOT NULL,
        `expirationDate` DATETIME NOT NULL,
        `balance` DECIMAL(10,2) NOT NULL,
        PRIMARY KEY (`id`));

        CREATE TABLE `meettheneed`.`transactions` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `date` DATE NOT NULL,
            `time` TIME NULL DEFAULT NULL,
            `currentWeek` INT NOT NULL,
            `currentYear` INT NOT NULL,
            `dependant` VARCHAR(145) NULL DEFAULT NULL,
            `admin` VARCHAR(100) NULL DEFAULT NULL,
            `amount_to_admin` DECIMAL(10,2) NOT NULL,
            `transactionType` VARCHAR(45) NOT NULL,
            `livraison` VARCHAR(45) NULL DEFAULT NULL,
            `depannage` VARCHAR(45) NULL DEFAULT NULL,
            `christmasBasket` VARCHAR(45) NULL DEFAULT NULL,
            `address` VARCHAR(500) NULL DEFAULT NULL,
            PRIMARY KEY (`id`));

        CREATE TABLE `meettheneed`.`variables` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `priceBasket` DECIMAL(10,2) NOT NULL,
            `priceBasketDepannage` DECIMAL(10,2) NOT NULL,
            `priceBasketLivraison` DECIMAL(10,2) NOT NULL,
            `priceBasketChristmas` DECIMAL(10,2) NOT NULL,
            `priceBasketDepannageLivraison` DECIMAL(10,2) NOT NULL,
            `priceBasketDepannageChristmas` DECIMAL(10,2) NOT NULL,
            `priceBasketLivraisonChristmas` DECIMAL(10,2) NOT NULL,
            `priceBasketDepannageLivraisonChristmas` DECIMAL(10,2) NOT NULL,
            `priceMembership` DECIMAL(10,2) NOT NULL,
            PRIMARY KEY (`id`));

        //Create a hashed password from the initial_setup_password.js file. Enter your password on line 9.

        INSERT INTO admins(username, password) VALUES('admin', 'your hashed password produced by initial_setup_password.js here');

        INSERT INTO variables(priceBasket, priceBasketDepannage, priceBasketLivraison, priceBasketChristmas, priceBasketDepannageLivraison, priceBasketDepannageChristmas, priceBasketLivraisonChristmas, priceBasketDepannageLivraisonChristmas, priceMembership) values(0,0,0,0,0,0,0,0,0);

        exit;

    cd FoodBankApp

    nano server.js

        //Here, change the password attribute on line 22 to your admin msql user password (from line 162 of this file)

        //Type Ctrl + O

        //Type Ctrl + X

    sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

        //add this line to the end of the file:

        secure_file_priv=""

        //Type Ctrl + O

        //Type Ctrl + X

Now, lets test what we have done:

    sudo npm run start

    // everything should work fine here, but you wont be able to open the web-page

If yo are on a computer, you can also test the app on localhost:80 if you change the proxy to http://localhost:80 in the root package.json file (not the one inside the react project).

You can put the server.js file as a service if you want it to work in the background. To do this, type:

    cd /etc/systemd/system

    sudo touch administration_system.service

    sudo nano administration_system.service

    //and type:

        [Unit]
        Description=Service to run administration system
        After=network.target

        [Service]
        ExecStart=sudo /usr/bin/node /home/pi/FoodBankApp/server.js
        WorkingDirectory=/home/pi/FoodBankApp
        StandardOutput=inherit
        StandardError=inherit
        Restart=always
        User=pi

        [Install]
        WantedBy=multi-user.target

    //then, type Ctrl + O and Ctrl + X and continue...

    sudo systemctl daemon-reload

    sudo systemctl enable administration_system

    sudo systemctl restart administration_system

    sudo systemctl status administration_system         //if everything is green, then everything should be working


And there you go! everything should be working fine. You can access this website by typing raspberrypi.local in a browser in the same network.

I recommend running a backup of your mysql database at least every month or so. To do that, run:

    mysqldump -u admin -p meettheneed > backup.sql

...and then send you the file through scp.

Disclaimer

This web-app is made to run under https with nginx or apache as web servers (not directly on port 80 as said earlier) for higher security. It has some security features, such as ignoring back-end XXS and SQL injection attacks, but it is still vulnerable to other attacks. All authors remove themselves from all liability towards any inconvinience the user may encounter during the use of this web-app.

Copyright (C) 2020 Alix Routhier-Lalonde. This file is subject to the terms and conditions defined in file "LICENSE.txt", which is part of this source code package.
