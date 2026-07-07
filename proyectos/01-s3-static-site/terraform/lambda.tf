# Rol de ejecución que necesita toda Lambda (mínimo indispensable)
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Empaqueta src/handler.js en un .zip (Terraform lo genera solo)
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../src/handler.js"
  output_path = "${path.module}/../build/handler.zip"
}

resource "aws_lambda_function" "hello" {
  function_name    = "hello-function"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "handler.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}
