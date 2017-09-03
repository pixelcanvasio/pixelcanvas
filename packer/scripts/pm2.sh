#!/usr/bin/env bash

# su - pixel
yarn global add pm2
pm2 install pm2-logrotate
# sudo env PATH=$PATH:/usr/local/bin pm2 startup -u pixel --hp /home/pixel

