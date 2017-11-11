#!/usr/bin/env bash

# The sleep 30 in the example above is very important.
# Because Packer is able to detect and SSH into the instance as soon as SSH is
# available, Ubuntu actually doesn't get proper amounts of time to initialize.
# The sleep makes sure that the OS properly initializes.
sleep 30

apt-get update
apt-get -y dist-upgrade
apt-get -yq install curl

# nodejs
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get -yq install nodejs

# other tools
apt-get -yq install git
apt-get -yq install ntp
apt-get -yq install build-essential
#apt-get -yq install nmap
apt-get -yq install python2.7

#nginx
add-apt-repository ppa:nginx/stable
apt-get update
apt-get -yq install nginx
