# https://www.rabbitmq.com/production-checklist.html
# http://stackoverflow.com/questions/8808909/simple-way-to-install-rabbitmq-in-ubuntu

#admin url http://138.68.88.203:15672
resource "digitalocean_droplet" "rabbitmq" {
  image  = "debian-8-x64"
  name   = "pixelcanvas-rabbitmq"
  region = "${var.region}"
  size   = "512mb"

  ipv6               = false
  private_networking = true

  count = 1

  ssh_keys = [
    "${digitalocean_ssh_key.ssh_key.fingerprint}",
  ]

  connection {
    host     = "${digitalocean_droplet.rabbitmq.ipv4_address}"
    user     = "root"
    type     = "ssh"
    timeout  = "2m"
    private_key = "${var.private_key}"
  }

  # http://stackoverflow.com/questions/8808909/simple-way-to-install-rabbitmq-in-ubuntu
  provisioner "remote-exec" {
    inline = [
      "sleep 30",
      "curl -sSL https://agent.digitalocean.com/install.sh | sh",

      "apt-get update",
      "apt-get install rabbitmq-server -y",

      "service rabbitmq-server start",
      "rabbitmq-plugins enable rabbitmq_management",
      "rabbitmqctl add_user ${var.amqp_user} ${var.amqp_password}",
      "rabbitmqctl set_user_tags ${var.amqp_user} administrator",
      "rabbitmqctl set_permissions -p / ${var.amqp_user} \".*\" \".*\" \".*\"",
      "rabbitmqctl delete_user guest",
      "service rabbitmq-server restart",

      "echo \"RESTARTING rabbitmq!!!!!\"",
      "sleep 5"
    ]
  }
}
