Welcome to the Meet The Need food bank web app. This web app helps food banks manage the food baskets they give through QR code recognition.

This web app was made to sustain a five-fold increase in demand of food bank services during the Covid-19 pandemic.

This web-app was made to run on a raspberry pi, but could be easily adapted to other hardware.

Note that this web-app is made to run on a normal 1080p (higher resolutions and 720p are fine too) desktop and not on any tablets/smartphone. There are no media queries on this web-app.

I would recommend doing a clone of the raspberry pi disk each month just in case of a problem so that not all data is lost.

Setup:

    On the raspberry pi, clone this repo and run the ```/setup/first_time.sh``` bash script.

And there you go! everything should be working fine. You can access this website by typing raspberrypi.local in a browser in the same network.

I recommend running a backup of your mysql database at least every month or so. To do that, run:

    mysqldump -u admin -p meettheneed > backup.sql

...and then send you the file through scp.

Disclaimer

This web-app is made to run under https with nginx or apache as web servers (not directly on port 80 as said earlier) for higher security. It has some security features, such as ignoring back-end XXS and SQL injection attacks, but it is still vulnerable to other attacks. All authors remove themselves from all liability towards any inconvinience the user may encounter during the use of this web-app.

Copyright (C) 2020 Alix Routhier-Lalonde. This file is subject to the terms and conditions defined in file "LICENSE.txt", which is part of this source code package.
