# Copyright (C) 2021 Alix Routhier-Lalonde. This file is subject to the terms and conditions defined in file "LICENSE.txt", which is part of this source code package.

cd ..
npm update
cd client
npm update
cd ..
scp pi@raspberrypi.local:/home/pi/simple-home/backend/constants/mysql.json ./backend/constants/mysql.json
