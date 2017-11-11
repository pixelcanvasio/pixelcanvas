
########
# BLUE #
########

data "template_file" "pm2_websockets_blue" {
  template = "${file("${path.module}/blue/processes.yml")}"

  vars {
    script = "websockets"
    REDIS_URL = "redis://:${var.redis_password}@${digitalocean_droplet.redis.ipv4_address_private}:6379"
    AMQP_URL = "amqp://${var.amqp_user}:${var.amqp_password}@${digitalocean_droplet.rabbitmq.ipv4_address_private}:5672/"
    WS_HOSTNAMES = "[]"
  }
}

data "template_file" "userdata_websockets_blue" {
  template = "${file("${path.module}/blue/cloud-config.yml")}"

  vars {
    userdata_public_key = "${var.public_key}"
    userdata_pm2_conf = "${base64encode("${data.template_file.pm2_websockets_blue.rendered}")}"
  }
}


# Create Droplet w/ Docker for Deepstream.io
resource "digitalocean_droplet" "websockets_blue" {
  image  = "${data.digitalocean_image.pixelcanvas_blue_ws.image}"
  name   = "pixelcanvas-websockets-blue-${count.index}"
  region = "${var.region}"
  size   = "512mb"

  ipv6               = false
  private_networking = true

  ssh_keys = [
    "${digitalocean_ssh_key.ssh_key.fingerprint}",
  ]

  user_data = "${data.template_file.userdata_websockets_blue.rendered}"

  # This will create 8 instances
  count = 2

  provisioner "local-exec" {
    command = "sleep 30"
  }
}
