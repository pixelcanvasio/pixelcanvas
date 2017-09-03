https://github.com/akramhussein/terraform-deepstream.io-mongo-redis-digital-ocean
https://www.terraform.io/docs/providers/do/index.html
https://www.digitalocean.com/community/tutorials/how-to-use-the-redis-one-click-application


https://github.com/GetStream/stream-react-example/blob/master/terraform/do/cabin/templates/processes.tpl

source envs.sh
terraform graph | dot -Tpng > graph.png


# redis
https://www.digitalocean.com/community/tutorials/how-to-use-the-redis-one-click-application
http://stackoverflow.com/questions/7537905/redis-set-a-password-for-redis

redis-cli ping
redis-cli -h redis_ip_address -p 6379 -a your_redis_password

# Blue-Green deployment
https://cloudnative.io/blog/2015/02/the-dos-and-donts-of-bluegreen-deployment/
