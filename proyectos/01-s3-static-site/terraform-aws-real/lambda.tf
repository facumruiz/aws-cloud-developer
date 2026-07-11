resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role_real"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# En LocalStack esto no hacía falta (no lo exige), pero en AWS real,
# sin este permiso la Lambda corre igual pero NO puede escribir logs
# en CloudWatch. Es la política administrada estándar de AWS para esto.
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../src/handler.js"
  output_path = "${path.module}/../build/handler-real.zip"
}

resource "aws_lambda_function" "hello" {
  function_name    = "hello-function-real"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "handler.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}
