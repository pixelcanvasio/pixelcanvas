
resource "cloudflare_record" "production" {
  domain = "pixelcanvas.io"
  name   = "pixelcanvas.io"
  value  = "${digitalocean_loadbalancer.public.ip}"
  type   = "A"
  proxied= "true"
}

resource "cloudflare_record" "staging" {
  domain = "pixelcanvas.io"
  name   = "staging"
  value  = "${digitalocean_floating_ip.web_staging.ip_address}"
  type   = "A"
  proxied= "true"
}

// APOTEMA

resource "cloudflare_record" "apotema_production" {
  domain = "apotema.games"
  name   = "pixelcanvas"
  value  = "${digitalocean_loadbalancer.public.ip}"
  type   = "A"
  proxied= "true"
}

resource "cloudflare_record" "apotema_staging" {
  domain = "apotema.games"
  name   = "staging.pixelcanvas"
  value  = "${digitalocean_floating_ip.web_staging.ip_address}"
  type   = "A"
  proxied= "true"
}
