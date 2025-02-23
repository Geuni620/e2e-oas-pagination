import { Hono } from "hono";
import { cors } from "hono/cors";
import { generateMockData } from "../mock";
import z from "zod";

import "zod-openapi/extend";
import { openAPISpecs, describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";

import { zValidator } from "@hono/zod-validator";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();
app.use("/*", cors());

const mockData = generateMockData(2000);

// 제품 스키마 정의
const ProductSchema = z
  .object({
    id: z.string().openapi({ example: "1" }),
    boxCount: z.number().openapi({ example: 10 }),
    shippingMethod: z.string().openapi({ example: "택배" }),
    productTemperature: z.string().openapi({ example: "상온" }),
    configurationCount: z.number().openapi({ example: 1 }),
    productCode: z.string().openapi({ example: "1234567890" }),
    productName: z.string().openapi({ example: "Product 1" }),
  })
  .openapi({ ref: "Product" });

const ProductsResponseSchema = z
  .object({
    data: z.array(ProductSchema),
  })
  .openapi({ ref: "ProductsResponse" });

app.get("/health", (c) => {
  return c.json({
    status: "ok",
  });
});

// 라우트 정의
app.get(
  "/api/products",
  describeRoute({
    tags: ["products"],
    summary: "모든 제품 목록 조회",
    responses: {
      200: {
        description: "제품 목록 조회 성공",
        content: {
          "application/json": {
            schema: resolver(ProductsResponseSchema),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      data: mockData,
    });
  }
);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono",
        version: "1.0.0",
        description: "API for greeting users",
      },
      servers: [
        {
          url: "http://localhost:8787",
          description: "Local server",
        },
      ],
    },
  })
);

app.get("/swagger", swaggerUI({ url: "/openapi" }));

export default app;
