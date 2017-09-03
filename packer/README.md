https://www.nginx.com/blog/5-performance-tips-for-node-js-applications/
http://pnommensen.com/tag/ghost/
https://www.digitalocean.com/community/tutorials/how-to-create-digitalocean-snapshots-using-packer-on-centos-7#step-5-—-adding-configuration-files-and-installation-scripts
https://t37.net/nginx-optimization-understanding-sendfile-tcp_nodelay-and-tcp_nopush.html
https://github.com/h5bp/server-configs-nginx/blob/master/nginx.conf

source terraform/envs.sh
cd packer
packer build base.json
copy paste obtained id in pielcanvas.json
packer build pixelcanvas.json
