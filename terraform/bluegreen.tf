
# green now is PRODUCTION
data "digitalocean_image" "pixelcanvas_green_web" {
  name = "pixelcanvas-1501248731"
}
data "digitalocean_image" "pixelcanvas_green_ws" {
  name = "pixelcanvas-1501248731"
}

# blue now is STAGING
data "digitalocean_image" "pixelcanvas_blue" {
  name = "pixelcanvas-1501253443"
}
data "digitalocean_image" "pixelcanvas_blue_ws" {
  name = "pixelcanvas-1501253443"
}

resource "digitalocean_loadbalancer" "public" {
  name = "pixelcanvas-loadbalancer"
  region = "${var.region}"

  forwarding_rule {
    entry_port = 80
    entry_protocol = "http"

    target_port = 80
    target_protocol = "http"
  }
  healthcheck {
    port = 80
    protocol = "http"
    path = "/api/bigchunk/0.0.bmp"
  }

  droplet_ids = ["${digitalocean_droplet.web_blue.*.id}"]
}

resource "digitalocean_floating_ip" "web_staging" {
  droplet_id = "${digitalocean_droplet.web_blue.0.id}"
  region     = "${var.region}"
}
