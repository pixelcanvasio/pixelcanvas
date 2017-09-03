
# Configure the Cloudflare provider
provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}

# Configure the Digital Ocean Provider
provider "digitalocean" {
  token = "${var.do_token}"
}

resource "digitalocean_ssh_key" "ssh_key" {
  name       = "PixelCanvas"
  public_key = "${var.public_key}"
}
