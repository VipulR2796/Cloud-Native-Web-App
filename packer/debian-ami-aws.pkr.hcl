packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0619217d4d0d7732d"
}

variable "ami_users" {
  type    = list(string)
  default = ["405204851463"]
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

source "amazon-ebs" "debian12" {
  ami_name      = "packer-debian-12-ami_${formatdate("YYYY-MM-DD_hh-mm-ss", timestamp())}"
  ami_users     = var.ami_users
  profile       = var.aws_profile
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  source_ami_filter {
    filters = {
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  subnet_id    = "${var.subnet_id}"
  ssh_username = var.ssh_username

  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    delete_on_termination = true
    volume_size           = 25
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.debian12"]

  provisioner "file" {
    sources = [
      "./data/users.csv",
      "./webapp.tar.gz"
    ]
    destination = "/tmp/"
  }

  provisioner "shell" {

    script = "./scripts/setup.sh"
  }


}