#!/usr/bin/env bash

chown -R pixel /home/pixel
chmod -R 0755 /home/pixel/www/public
su - pixel
cd /home/pixel/www
yarn install
