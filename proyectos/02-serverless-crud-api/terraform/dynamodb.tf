resource "aws_dynamodb_table" "tasks" {
  name         = "tasks"
  billing_mode = "PAY_PER_REQUEST" # sin capacidad fija que gestionar, ideal para serverless
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
