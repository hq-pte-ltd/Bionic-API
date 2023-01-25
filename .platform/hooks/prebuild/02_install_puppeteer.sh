#!/bin/bash
source /home/ec2-user/.bash_profile
sudo amazon-linux-extras install epel -y
sudo yum install -y cups-libs dbus-glib libXrandr libXcursor libXinerama cairo cairo-gobject pango libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libcups2 chromium