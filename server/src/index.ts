import { Hono } from "hono";
import { cors } from "hono/cors";
import { generateMockData } from "../mock";

const app = new Hono();
app.use("/*", cors());

const mockData = generateMockData(2000);

app.get("/api/products", (c) => {
  return c.json({
    data: mockData,
  });
});

app.get("/api/products/:id", (c) => {
  const id = c.req.param("id");
  const product = mockData.find((p) => p.id === id);

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json(product);
});

export default app;
