// src/lib/response.js
// Todas las Lambdas devuelven el mismo formato, para no repetir headers en cada handler.
function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

module.exports = { response };
