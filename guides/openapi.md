# OpenAPI

You can create an application that supports generating OpenAPI documents by using middleware.
There are several middleware and wrappers for OpenAPI.

## Zod OpenAPI

[Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) is an extended Hono class that supports OpenAPI.
With it, you can validate values and types using [Zod](https://zod.dev/) and generate OpenAPI Swagger documentation.

## Swagger UI

[Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) provides a middleware and a component for integrating [Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) with Hono applications.

## Scalar API Reference

[@scalar/hono-api-reference](https://github.com/scalar/scalar/tree/main/packages/hono-api-reference)
provides a middleware for generating beautiful API references based on OpenAPI files (from Zod OpenAPI) with Hono applications.
