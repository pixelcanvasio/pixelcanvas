#!/usr/bin/env bash

chown -R pixel /home/pixel
chmod -R 0755 /home/pixel/www/public

# FIX ENOMEM: out of memory when installing packages
# https://stackoverflow.com/questions/26193654/node-js-catch-enomem-error-thrown-after-spawn
fallocate -l 1G /swapfile
mkswap /swapfile
swapon /swapfile

su - pixel
cd /home/pixel/www
npm install
