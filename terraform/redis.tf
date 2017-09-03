
# Create Droplet w/ Docker for Deepstream.io
resource "digitalocean_droplet" "redis" {
  image  = "redis"
  name   = "pixelcanvas-redis"
  region = "${var.region}"
  size   = "2gb"

  ipv6               = true
  private_networking = true

  ssh_keys = [
    "${digitalocean_ssh_key.ssh_key.fingerprint}",
  ]
}


resource "null_resource" "redis_ip" {
  depends_on = ["digitalocean_droplet.redis"]

  connection {
    host     = "${digitalocean_droplet.redis.ipv4_address}"
    user     = "root"
    type     = "ssh"
    timeout  = "2m"
    private_key = "${var.private_key}"
  }

  provisioner "remote-exec" {
    inline = [
      "sleep 30",
      "curl -sSL https://agent.digitalocean.com/install.sh | sh",
      "service redis stop",
      "sed -i 's/bind 127.0.0.1$/bind ${digitalocean_droplet.redis.ipv4_address_private}/g' /etc/redis/redis.conf",
      "echo \"requirepass ${var.redis_password}\" >> /etc/redis/redis.conf",
      "echo \"RESTARTING redis!!!!!\"",
      "service redis start",
      "sleep 5"
    ]
  }
}
