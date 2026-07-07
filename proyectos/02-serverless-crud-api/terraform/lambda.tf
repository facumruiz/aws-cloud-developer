# Rol de ejecución compartido por las 5 Lambdas (mismo permiso mínimo: leer/escribir en la tabla)
resource "aws_iam_role" "lambda_exec" {
  name = "crud_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# El zip se arma en deploy.sh (incluye src/ + node_modules), acá solo lo referenciamos.
locals {
  lambda_zip_path = "${path.module}/../build/lambda.zip"

  functions = {
    create_task = "createTask.handler"
    list_tasks  = "listTasks.handler"
    get_task    = "getTask.handler"
    update_task = "updateTask.handler"
    delete_task = "deleteTask.handler"
  }
}

resource "aws_lambda_function" "tasks" {
  for_each = local.functions

  function_name    = "${each.key}-function"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "handlers/${each.value}"
  runtime          = "nodejs20.x"
  filename         = local.lambda_zip_path
  source_code_hash = filebase64sha256(local.lambda_zip_path)
  timeout          = 10

  environment {
    variables = {
      TABLE_NAME       = aws_dynamodb_table.tasks.name
      AWS_ENDPOINT_URL = "http://localstack:4566" # las Lambdas se ven entre sí por el nombre del container en la red de Docker
    }
  }
}
