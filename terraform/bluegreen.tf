
data "digitalocean_image" "pixelcanvas_green_web" {
  # STAGING
  name = "pixelcanvas-1510398298"
}
data "digitalocean_image" "pixelcanvas_green_ws" {
  # STAGING
  name = "pixelcanvas-1501248731"
}


data "digitalocean_image" "pixelcanvas_blue" {
  # PRODUCTION
  name = "pixelcanvas-1510480311"
}
data "digitalocean_image" "pixelcanvas_blue_ws" {
  # PRODUCTION
  name = "pixelcanvas-1510393407"
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
  droplet_id = "${digitalocean_droplet.web_green.0.id}"
  region     = "${var.region}"
}
