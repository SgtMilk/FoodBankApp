Welcome to the Meet The Need food bank web app. This web app helps food banks manage the food baskets they give through QR code recognition.

This web-app was made to run on a raspberry pi, but could be easily adapted to other hardware.

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
            `password` VARCHAR(45) NOT NULL,
            PRIMARY KEY (`id`));

        CREATE TABLE `meettheneed`.`dependants` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `firstName` VARCHAR(45) NOT NULL,
        `lastName` VARCHAR(45) NOT NULL,
        `dateOfBirth` VARCHAR(15) NOT NULL,
        `email` VARCHAR(45) NULL,
        `homeAddress` VARCHAR(45) NULL,
        `currentWeek` INT NOT NULL,
        `numberOfBaskets` INT NOT NULL,
        `registrationDate` DATETIME NOT NULL,
        PRIMARY KEY (`id`));

        INSERT INTO admins(username, password) VALUES('admin', 'your admin password here');

        exit;

    cd FoodBankApp

    nano server.js

        //Here, change the password attribute on line 22 to your admin msql user password (from line 53 of this file)

        //Type Ctrl + O

        //Type Ctrl + X

Now, lets test what we have done:

    sudo npm run start

    // everything should work fine here

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
