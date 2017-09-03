#!/usr/bin/env bash

#https://github.com/lumerit/s3-shell-backups

#### BEGIN CONFIGURATION ####

# set dates for backup rotation
NOWDATE=`date +%Y-%m-%d`
LASTDATE=$(date +%Y-%m-%d --date='1 week ago')

# set backup directory variables
SRCDIR='/tmp/s3backups'
DESTDIR='backups'
BUCKET='pixelcanvas.io'

#### END CONFIGURATION ####

# make the temp directory if it doesn't exist
mkdir -p $SRCDIR

# make a compressed copy of the redis dump

cp /var/lib/redis/dump.rdb $SRCDIR/$NOWDATE-redis-dump.rdb
gzip $SRCDIR/$NOWDATE-redis-dump.rdb

# send the file off to s3
/usr/bin/s3cmd put $SRCDIR/$NOWDATE-redis-dump.rdb.gz s3://$BUCKET/$DESTDIR/

# delete old backups from s3
# /usr/bin/s3cmd del --recursive s3://$BUCKET/$DESTDIR/$LASTDATE-redis-dump.rdb.gz

# remove all files in our source directory
rm -f $SRCDIR/*
