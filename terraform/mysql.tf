
# Create Droplet w/ Docker for Deepstream.io
resource "digitalocean_droplet" "mysql" {
  image  = "mysql-16-04"
  name   = "pixelcanvas-mysql"
  region = "${var.region}"
  size   = "2gb"

  ipv6               = true
  private_networking = true

  ssh_keys = [
    "${digitalocean_ssh_key.ssh_key.fingerprint}",
  ]
}
