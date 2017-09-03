#!/usr/bin/env bash

# The sleep 30 in the example above is very important.
# Because Packer is able to detect and SSH into the instance as soon as SSH is
# available, Ubuntu actually doesn't get proper amounts of time to initialize.
# The sleep makes sure that the OS properly initializes.
sleep 30

apt-get update
apt-get -y dist-upgrade
apt-get -yq install git
apt-get -yq install ntp
apt-get -yq install build-essential
#apt-get -yq install nmap
apt-get -yq install python2.7

#nginx
add-apt-repository ppa:nginx/stable
apt-get update
apt-get -yq install nginx

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt-get update
apt-get -yq install yarn
