resource "aws_api_gateway_rest_api" "api" {
  name = "portfolio-api"
}

resource "aws_api_gateway_resource" "hello" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "hello"
}

resource "aws_api_gateway_method" "get_hello" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.hello.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.hello.id
  http_method             = aws_api_gateway_method.get_hello.http_method
  integration_http_method = "POST" # API Gateway siempre invoca Lambda con POST internamente
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.hello.invoke_arn
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on  = [aws_api_gateway_integration.lambda]
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_stage" "local" {
  deployment_id = aws_api_gateway_deployment.deploy.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "local"
}

output "api_url" {
  value = "http://localhost:4566/restapis/${aws_api_gateway_rest_api.api.id}/local/_user_request_/hello"
}

output "bucket_website_url" {
  value = "http://localhost:4566/portfolio-static-site/index.html"
}
