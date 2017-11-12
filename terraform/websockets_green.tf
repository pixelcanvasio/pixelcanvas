
#########
# GREEN #
#########

data "template_file" "pm2_websockets_green" {
  template = "${file("${path.module}/green/processes.yml")}"

  vars {
    script = "websockets"
    REDIS_URL = "redis://:${var.redis_password}@${digitalocean_droplet.redis.ipv4_address_private}:6379"
    AMQP_URL = "amqp://${var.amqp_user}:${var.amqp_password}@${digitalocean_droplet.rabbitmq.ipv4_address_private}:5672/"
    WS_HOSTNAMES = "[]"
  }
}

data "template_file" "userdata_websockets_green" {
  template = "${file("${path.module}/green/cloud-config.yml")}"

  vars {
    userdata_public_key = "${var.public_key}"
    userdata_pm2_conf = "${base64encode("${data.template_file.pm2_websockets_green.rendered}")}"
  }
}


# Create Droplet w/ Docker for Deepstream.io
resource "digitalocean_droplet" "websockets_green" {
  image  = "${data.digitalocean_image.pixelcanvas_green_ws.image}"
  name   = "pixelcanvas-websockets-green-${count.index}"
  region = "${var.region}"
  size   = "512mb"

  ipv6               = false
  private_networking = true

  ssh_keys = [
    "${digitalocean_ssh_key.ssh_key.fingerprint}",
  ]

  user_data = "${data.template_file.userdata_websockets_green.rendered}"

  # This will create 1 instances
  count = 0

  provisioner "local-exec" {
    command = "sleep 30"
  }
}
