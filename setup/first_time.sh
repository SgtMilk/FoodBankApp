# Copyright (C) 2021 Alix Routhier-Lalonde. This file is subject to the terms and conditions defined in file "LICENSE.txt", which is part of this source code package.

sudo apt-get update
sudo apt-get upgrade
curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install mariadb-server
cd ..
npm update
cd meettheneed
npm update
npm run build
cd ..
sudo mysql_secure_installation
mysql -u root -Bse "CREATE USER 'temp'@'localhost' IDENTIFIED BY 'qwertyui';"
mysql -u root -Bse "GRANT ALL PRIVILEGES ON * . * TO 'temp'@'localhost';"
mysql -u root -Bse "FLUSH PRIVILEGES;"
mysql -u root -Bse "GRANT GRANT OPTION ON * . * TO 'temp'@'localhost';"
cd backend/constants
node ../../setup/helper/database.js
mysql -u root -Bse "DROP USER 'temp'@'localhost'";
sudo systemctl daemon-reload
sudo systemctl enable administration_system
sudo systemctl restart administration_system
sudo systemctl status administration_system