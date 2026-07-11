terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

# Sin endpoints ni credenciales hardcodeadas: usa las que configuraste
# con "aws configure" (el usuario IAM dev-terraform).
provider "aws" {
  region = "us-east-1"
}

# El nombre de un bucket S3 tiene que ser único en TODO AWS (no solo en tu cuenta),
# por eso usamos el account id para armar un nombre que no choque con nadie más.
data "aws_caller_identity" "current" {}
