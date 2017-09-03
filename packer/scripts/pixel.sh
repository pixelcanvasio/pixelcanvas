#!/usr/bin/env bash

useradd -m -d /home/pixel -G sudo pixel

# TODO disable password logi

# https://unix.stackexchange.com/questions/73978/using-root-to-mkdir-in-another-users-home-directory
sudo -u pixel mkdir /home/pixel/www

