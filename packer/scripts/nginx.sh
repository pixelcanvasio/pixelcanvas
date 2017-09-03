#!/usr/bin/env bash

# useradd www

# Create a copy of original configuration files and import configuration:
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.original
cp /tmp/nginx.conf /etc/nginx/nginx.conf
cp /tmp/pixelcanvas.conf /etc/nginx/pixelcanvas.conf

# Restart Nginx:
nginx -t
service nginx restart
