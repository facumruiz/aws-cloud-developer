resource "aws_api_gateway_rest_api" "api" {
  name = "crud-tasks-api"
}

# /tasks
resource "aws_api_gateway_resource" "tasks" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "tasks"
}

# /tasks/{id}
resource "aws_api_gateway_resource" "task_id" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.tasks.id
  path_part   = "{id}"
}

# --- POST /tasks -> create_task ---
resource "aws_api_gateway_method" "post_tasks" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.tasks.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_tasks" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.tasks.id
  http_method             = aws_api_gateway_method.post_tasks.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tasks["create_task"].invoke_arn
}

# --- GET /tasks -> list_tasks ---
resource "aws_api_gateway_method" "get_tasks" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.tasks.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_tasks" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.tasks.id
  http_method             = aws_api_gateway_method.get_tasks.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tasks["list_tasks"].invoke_arn
}

# --- GET /tasks/{id} -> get_task ---
resource "aws_api_gateway_method" "get_task" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.task_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_task" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.task_id.id
  http_method             = aws_api_gateway_method.get_task.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tasks["get_task"].invoke_arn
}

# --- PUT /tasks/{id} -> update_task ---
resource "aws_api_gateway_method" "put_task" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.task_id.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "put_task" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.task_id.id
  http_method             = aws_api_gateway_method.put_task.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tasks["update_task"].invoke_arn
}

# --- DELETE /tasks/{id} -> delete_task ---
resource "aws_api_gateway_method" "delete_task" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.task_id.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "delete_task" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.task_id.id
  http_method             = aws_api_gateway_method.delete_task.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.tasks["delete_task"].invoke_arn
}

# Permiso para que API Gateway invoque cada Lambda
resource "aws_lambda_permission" "apigw" {
  for_each = local.functions

  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tasks[each.key].function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on = [
    aws_api_gateway_integration.post_tasks,
    aws_api_gateway_integration.get_tasks,
    aws_api_gateway_integration.get_task,
    aws_api_gateway_integration.put_task,
    aws_api_gateway_integration.delete_task,
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_stage" "local" {
  deployment_id = aws_api_gateway_deployment.deploy.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "local"
}

output "api_base_url" {
  value = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.api.id}/local/_user_request_/tasks"
}
