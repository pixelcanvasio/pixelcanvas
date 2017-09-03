variable "do_token" {
  description = "DigitalOcean Token"
}

variable "region" {
  description = "DigitalOcean region"
  default = "fra1"
}

variable "public_key" {
  description = "Public key"
}

variable "private_key" {
  description = "Private key"
}

variable "cloudflare_email" {
  description = "Login email cloudflare"
}

variable "cloudflare_token" {

}

variable "redis_password" {
  description = "redis auth password"
}

variable "amqp_user" {
  description = "rabbitmq auth password"
}

variable "amqp_password" {
  description = "rabbitmq auth password"
}
